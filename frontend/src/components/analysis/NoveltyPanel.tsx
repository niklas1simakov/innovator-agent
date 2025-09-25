import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { NoveltyAnalysis } from "@/types/research";
import { formatNoveltyPercentage } from "@/lib/utils";

interface NoveltyPanelProps {
  analysis: NoveltyAnalysis;
  className?: string;
}

export const NoveltyPanel = ({ analysis, className = "" }: NoveltyPanelProps) => {
  const getNoveltyLevel = (percentage: number) => {
    if (percentage >= 80) return { level: "High", color: "success", icon: CheckCircle };
    if (percentage >= 40) return { level: "Moderate", color: "warning", icon: TrendingUp };
    return { level: "Low", color: "destructive", icon: AlertCircle };
  };

  const noveltyInfo = getNoveltyLevel(analysis.noveltyPercentage);
  const NoveltyIcon = noveltyInfo.icon;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          Novelty Analysis
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="h-60">
        <CardContent className="space-y-4 pr-4">
          <div className="text-center space-y-3">
            <div className="relative">
              <div className="text-4xl font-bold text-primary mb-1">
                {formatNoveltyPercentage(analysis.noveltyPercentage)}%
              </div>
              <Badge 
                variant="outline" 
                className={`gap-1 ${
                  noveltyInfo.color === "success" ? "border-success text-success" :
                  noveltyInfo.color === "warning" ? "border-warning text-warning" :
                  "border-destructive text-destructive"
                }`}
              >
                <NoveltyIcon className="h-3 w-3" />
                {noveltyInfo.level} Novelty
              </Badge>
            </div>
            
            <Progress 
              value={analysis.noveltyPercentage} 
              className="h-3"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.analysisText}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Max Similarity Found:</span>
              <span className="font-medium text-foreground">
                {formatNoveltyPercentage(analysis.maxSimilarity)}%
              </span>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default NoveltyPanel;