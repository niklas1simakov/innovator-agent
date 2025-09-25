import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar } from "lucide-react";
import { ResearchItem } from "@/types/research";

interface TimelineChartProps {
  patents: ResearchItem[];
  publications: ResearchItem[];
  className?: string;
}

export const TimelineChart = ({ patents, publications, className = "" }: TimelineChartProps) => {
  // Prepare data for the chart
  const prepareChartData = () => {
    const yearCounts: Record<number, { year: number; patents: number; publications: number; total: number }> = {};
    
    // Count patents by year
    patents.forEach(patent => {
      if (!yearCounts[patent.year]) {
        yearCounts[patent.year] = { year: patent.year, patents: 0, publications: 0, total: 0 };
      }
      yearCounts[patent.year].patents++;
      yearCounts[patent.year].total++;
    });
    
    // Count publications by year
    publications.forEach(publication => {
      if (!yearCounts[publication.year]) {
        yearCounts[publication.year] = { year: publication.year, patents: 0, publications: 0, total: 0 };
      }
      yearCounts[publication.year].publications++;
      yearCounts[publication.year].total++;
    });
    
    return Object.values(yearCounts).sort((a, b) => a.year - b.year);
  };

  const chartData = prepareChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-lg shadow-lg p-3">
          <p className="font-medium mb-2">{`Year: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'patents' ? 'Patents' : 'Publications'}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          Publication Timeline
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="h-60">
        <CardContent className="pr-4">
          {chartData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={25}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="patents" 
                    stackId="a" 
                    fill="hsl(var(--warning))" 
                    radius={[0, 0, 2, 2]}
                  />
                  <Bar 
                    dataKey="publications" 
                    stackId="a" 
                    fill="hsl(var(--primary))" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No timeline data available</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-warning"></div>
              <span className="text-muted-foreground">Patents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary"></div>
              <span className="text-muted-foreground">Publications</span>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default TimelineChart;