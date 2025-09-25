import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";
import { ResearchItem } from "@/types/research";
import TimelineChart from "@/components/analysis/TimelineChart";
import TopAuthors from "@/components/analysis/TopAuthors";

interface InsightsPanelProps {
  patents: ResearchItem[];
  publications: ResearchItem[];
  className?: string;
}

export const InsightsPanel = ({ patents, publications, className = "" }: InsightsPanelProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Research Insights</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 px-6 pb-6">
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="timeline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="authors" className="gap-2">
              <Users className="h-4 w-4" />
              Top Authors
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-0">
            <TimelineChart patents={patents} publications={publications} />
          </TabsContent>
          
          <TabsContent value="authors" className="mt-0">
            <TopAuthors patents={patents} publications={publications} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;