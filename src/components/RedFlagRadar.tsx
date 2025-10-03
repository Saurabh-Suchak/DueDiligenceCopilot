import { TriangleAlert as AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface RedFlag {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

const redFlags: RedFlag[] = [
  {
    title: 'Declining Cash Flow',
    description: 'Operating cash flow decreased 28% in Q4 despite revenue growth',
    severity: 'high',
  },
  {
    title: 'High Customer Concentration',
    description: 'Top 3 customers represent 67% of total revenue',
    severity: 'medium',
  },
  {
    title: 'Pending Litigation',
    description: '2 pending lawsuits with potential liability of $4.2M',
    severity: 'medium',
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400';
    case 'low':
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function RedFlagRadar() {
  const riskScore = 35;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Risk Assessment
        </CardTitle>
        <CardDescription>Identified risks and concerns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Risk Score</span>
            <span className="text-2xl font-bold text-yellow-600">{riskScore}/100</span>
          </div>
          <Progress value={riskScore} className="h-3" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Moderate risk level - review required</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Top Red Flags</h3>
          {redFlags.map((flag, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium flex-1">{flag.title}</h4>
                <Badge className={getSeverityColor(flag.severity)}>
                  {flag.severity}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {flag.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
