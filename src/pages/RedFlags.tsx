import { RedFlagRadar } from '@/components/RedFlagRadar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TriangleAlert as AlertTriangle, TrendingDown, Users, Scale } from 'lucide-react';

interface DetailedRisk {
  category: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  impact: string;
  icon: React.ReactNode;
}

const detailedRisks: DetailedRisk[] = [
  {
    category: 'Financial',
    title: 'Declining Cash Flow',
    description: 'Operating cash flow decreased 28% in Q4 despite revenue growth, indicating potential issues with working capital management or collection processes.',
    severity: 'high',
    impact: 'May impact ability to fund operations and growth initiatives',
    icon: <TrendingDown className="h-5 w-5" />,
  },
  {
    category: 'Business',
    title: 'High Customer Concentration',
    description: 'Top 3 customers represent 67% of total revenue, creating significant dependency and revenue volatility risk.',
    severity: 'medium',
    impact: 'Loss of any major customer could severely impact financial performance',
    icon: <Users className="h-5 w-5" />,
  },
  {
    category: 'Legal',
    title: 'Pending Litigation',
    description: '2 pending lawsuits with potential aggregate liability of $4.2M related to contract disputes.',
    severity: 'medium',
    impact: 'Could result in material financial loss and reputational damage',
    icon: <Scale className="h-5 w-5" />,
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

export function RedFlags() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Red Flags & Risk Analysis</h1>
        <p className="text-muted-foreground">
          Detailed view of identified risks and concerns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <RedFlagRadar />
        </div>

        <div className="lg:col-span-2 space-y-4">
          {detailedRisks.map((risk, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg mt-1">
                      {risk.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{risk.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {risk.category}
                        </Badge>
                        <Badge className={getSeverityColor(risk.severity)}>
                          {risk.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {risk.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Potential Impact</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {risk.impact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
