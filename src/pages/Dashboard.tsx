import { FileUpload } from '@/components/FileUpload';
import { QueryBox } from '@/components/QueryBox';
import { RedFlagRadar } from '@/components/RedFlagRadar';
import { DealMemoGenerator } from '@/components/DealMemoGenerator';

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Upload documents, ask questions, and generate insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FileUpload />
          <QueryBox />
        </div>

        <div className="space-y-6">
          <RedFlagRadar />
          <DealMemoGenerator />
        </div>
      </div>
    </div>
  );
}
