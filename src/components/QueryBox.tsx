import { useState } from 'react';
import { Send, Loader as Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Citation {
  document: string;
  page: string;
}

interface Answer {
  text: string;
  citations: Citation[];
}

export function QueryBox() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);

  const handleAsk = async () => {
    if (!query.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      setAnswer({
        text: 'Based on the financial documents provided, the company shows strong revenue growth of 42% year-over-year with EBITDA margins improving from 18% to 23%. The balance sheet demonstrates healthy liquidity with a current ratio of 2.3x and minimal long-term debt exposure.',
        citations: [
          { document: 'Financial_Statement_2024.pdf', page: 'Page 12' },
          { document: 'Balance_Sheet_Q4.xlsx', page: 'Sheet 2' },
          { document: 'Revenue_Analysis.pdf', page: 'Page 5' },
        ],
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask Questions</CardTitle>
        <CardDescription>
          Query your documents using natural language
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="e.g., What is the company's revenue growth over the last 3 years?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
        </div>

        <Button
          onClick={handleAsk}
          disabled={isLoading || !query.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Ask
            </>
          )}
        </Button>

        {answer && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
            <div>
              <h3 className="text-sm font-semibold mb-2">Answer</h3>
              <p className="text-sm leading-relaxed">{answer.text}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Citations</h3>
              <div className="flex flex-wrap gap-2">
                {answer.citations.map((citation, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {citation.document} • {citation.page}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
