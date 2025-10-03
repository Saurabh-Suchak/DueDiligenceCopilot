import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Report {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'completed' | 'processing' | 'failed';
  size: string;
}

const reports: Report[] = [
  {
    id: '1',
    name: 'Financial_Statement_2024.pdf',
    type: 'Financial',
    uploadDate: '2024-10-02',
    status: 'completed',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Balance_Sheet_Q4.xlsx',
    type: 'Financial',
    uploadDate: '2024-10-02',
    status: 'completed',
    size: '856 KB',
  },
  {
    id: '3',
    name: 'Revenue_Analysis.pdf',
    type: 'Analytics',
    uploadDate: '2024-10-01',
    status: 'completed',
    size: '1.8 MB',
  },
  {
    id: '4',
    name: 'Legal_Documents.pdf',
    type: 'Legal',
    uploadDate: '2024-10-01',
    status: 'processing',
    size: '3.2 MB',
  },
  {
    id: '5',
    name: 'Market_Research.docx',
    type: 'Research',
    uploadDate: '2024-09-30',
    status: 'completed',
    size: '1.1 MB',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
    case 'processing':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
    case 'failed':
      return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function Reports() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">
          View and download your uploaded documents and generated reports
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              All documents uploaded for due diligence analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{report.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.uploadDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {report.size}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={report.status !== 'completed'}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Deal Memos</CardTitle>
            <CardDescription>
              Download previously generated investment memos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Investment Memo - October 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Generated on Oct 2, 2024
                    </p>
                  </div>
                </div>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
