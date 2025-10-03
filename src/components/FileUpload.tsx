import { useState, useCallback } from 'react';
import { Upload, X, FileText, CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

type FileStatus = 'uploading' | 'parsing' | 'completed' | 'failed';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  error?: string;
  documentId?: string;
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  const processFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      status: 'uploading' as FileStatus,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileState = newFiles[i];

      try {
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .insert({
            filename: file.name,
            status: 'processing',
          })
          .select()
          .maybeSingle();

        if (docError || !docData) {
          throw new Error(docError?.message || 'Failed to create document record');
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id ? { ...f, status: 'parsing', documentId: docData.id } : f
          )
        );

        const formData = new FormData();
        formData.append('document', file);
        formData.append('model', 'dpt-2-latest');
        formData.append('split', 'page');

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ade-parse`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to parse document');
        }

        const parseResult = await response.json();

        const { error: updateError } = await supabase
          .from('documents')
          .update({
            markdown: parseResult.markdown,
            chunks: parseResult.chunks,
            splits: parseResult.splits,
            metadata: parseResult.metadata,
            status: 'completed',
          })
          .eq('id', docData.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id ? { ...f, status: 'completed' } : f
          )
        );
      } catch (error) {
        console.error('Error processing file:', error);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? { ...f, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' }
              : f
          )
        );

        if (fileState.documentId) {
          await supabase
            .from('documents')
            .update({ status: 'failed' })
            .eq('id', fileState.documentId);
        }
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'uploading':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'parsing':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusText = (status: FileStatus) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'parsing':
        return 'Parsing...';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>Upload financial documents for analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          )}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, Word, Excel, and image files
            </p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Uploaded Files</h3>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-xs">•</span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(file.status)}
                          <span className="text-xs text-muted-foreground">
                            {getStatusText(file.status)}
                          </span>
                        </div>
                      </div>
                      {file.error && (
                        <p className="text-xs text-red-600 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
