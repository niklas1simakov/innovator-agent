import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, ExternalLink, FileText, Scale } from "lucide-react";
import { ResearchItem } from "@/types/research";

interface ResearchCardProps {
  item: ResearchItem;
  className?: string;
}

export const ResearchCard = ({ item, className = "" }: ResearchCardProps) => {
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 85) return "text-warning";
    if (similarity >= 70) return "text-orange-500";
    if (similarity >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const getSimilarityBgColor = (similarity: number) => {
    if (similarity >= 85) return "bg-warning/10";
    if (similarity >= 70) return "bg-orange-50";
    if (similarity >= 50) return "bg-yellow-50";
    return "bg-green-50";
  };

  return (
    <Card className={`border-l-4 ${
      item.patentWarning ? "border-l-warning" : "border-l-border"
    } hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-primary/10 shrink-0">
            {item.type === "patent" ? (
              <Scale className="h-4 w-4 text-primary" />
            ) : (
              <FileText className="h-4 w-4 text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-base leading-tight line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSimilarityBgColor(item.similarity)}`}>
                <span className={getSimilarityColor(item.similarity)}>
                  {item.similarity}% similar
                </span>
              </div>
              
              {item.patentWarning && (
                <Badge variant="destructive" className="gap-1 bg-warning text-warning-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  License may be required
                </Badge>
              )}
            </div>

            <Progress 
              value={item.similarity} 
              className="h-2 mb-3"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-sm text-red-600 mb-2">Key Similarities</h4>
            <ul className="space-y-1">
              {item.similarities.map((similarity, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-red-500 mt-1 text-xs">●</span>
                  <span>{similarity}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-green-600 mb-2">Key Differences</h4>
            <ul className="space-y-1">
              {item.differences.map((difference, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500 mt-1 text-xs">●</span>
                  <span>{difference}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-3 border-t text-xs text-muted-foreground">
          <span className="font-medium">
            {item.authorsOrAssignee.slice(0, 2).join(", ")}
            {item.authorsOrAssignee.length > 2 && ` +${item.authorsOrAssignee.length - 2} more`}
          </span>
          
          {(item.venue || item.jurisdiction) && (
            <span>
              {item.venue || item.jurisdiction}
            </span>
          )}
          
          <span>{item.year}</span>
          
          {item.citationCount && (
            <span>{item.citationCount} citations</span>
          )}

          <span>{item.authorsOrAssignee} authors</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchCard;