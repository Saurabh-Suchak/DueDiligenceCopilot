import { QueryBox } from '@/components/QueryBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

const exampleQueries = [
  'What is the company\'s revenue growth over the last 3 years?',
  'Are there any pending legal disputes or litigation?',
  'What is the current debt-to-equity ratio?',
  'Who are the company\'s key customers?',
  'What are the main risk factors mentioned in the documents?',
  'Summarize the company\'s competitive advantages',
];

export function QA() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Q&A Interface</h1>
        <p className="text-muted-foreground">
          Ask questions about your uploaded documents using natural language
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QueryBox />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Example Questions
              </CardTitle>
              <CardDescription>
                Try asking these questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exampleQueries.map((query, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="w-full justify-start text-left p-3 h-auto cursor-pointer hover:bg-accent transition-colors"
                  >
                    {query}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
