import { FileUpload } from '@/components/FileUpload';

export function Upload() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
        <p className="text-muted-foreground">
          Upload financial documents, legal contracts, and other materials for analysis
        </p>
      </div>

      <div className="max-w-3xl">
        <FileUpload />
      </div>
    </div>
  );
}
