import { useState } from 'react';
import { FileText, Download, Loader as Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Separator } from './ui/separator';

export function DealMemoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMemo, setShowMemo] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowMemo(true);
    }, 2500);
  };

  const handleExport = () => {
    console.log('Exporting PDF...');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Deal Memo Generator
          </CardTitle>
          <CardDescription>
            Generate comprehensive investment memo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Memo...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Deal Memo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showMemo} onOpenChange={setShowMemo}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Investment Deal Memo</DialogTitle>
            <DialogDescription>
              Generated on {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Target Company demonstrates strong fundamentals with consistent revenue
                growth and improving profitability metrics. The company operates in a
                high-growth sector with significant market opportunities. Key investment
                highlights include robust unit economics, scalable business model, and
                experienced management team.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-3">Financial Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Revenue (FY2024)</p>
                  <p className="font-semibold">$24.5M</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">YoY Growth</p>
                  <p className="font-semibold text-green-600">+42%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">EBITDA Margin</p>
                  <p className="font-semibold">23%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Cash Position</p>
                  <p className="font-semibold">$8.2M</p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-2">Key Risks</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Customer concentration risk with top 3 clients at 67%</li>
                <li>• Declining cash flow in recent quarter requires monitoring</li>
                <li>• Pending litigation with potential $4.2M liability</li>
                <li>• Competitive market with well-funded rivals</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Proceed with investment subject to resolution of identified risks.
                Recommend structured deal with milestone-based earnouts and protective
                provisions around customer concentration.
              </p>
            </section>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMemo(false)}>
              Close
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
