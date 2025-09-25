import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  Building2, 
  Hash, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { ResearchItem } from "@/types/research";

interface ResultRowProps {
  item: ResearchItem;
  className?: string;
}

export const ResultRow = ({ item, className = "" }: ResultRowProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return "text-destructive";
    if (similarity >= 60) return "text-warning";
    return "text-success";
  };

  const getSimilarityBg = (similarity: number) => {
    if (similarity >= 80) return "bg-destructive/10";
    if (similarity >= 60) return "bg-warning/10";
    return "bg-success/10";
  };

  const topSimilarity = item.similarities?.[0];
  const topDifference = item.differences?.[0];
  const hasMoreDetails = (item.similarities?.length ?? 0) > 1 || (item.differences?.length ?? 0) > 1;

  return (
    <div className={`border border-border rounded-lg hover:bg-accent/50 transition-colors ${className}`}>
      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground hover:text-primary cursor-pointer line-clamp-2 mb-2">
              {item.title}
            </h3>
            
            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {item.year}
              </div>
              
              {item.authorsOrAssignee && item.authorsOrAssignee.length > 0 && (
                <div className="flex items-center gap-1">
                  {item.type === "publication" ? <Users className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                  <span className="truncate max-w-32">
                    {item.authorsOrAssignee.slice(0, 2).join(", ")}
                    {item.authorsOrAssignee.length > 2 && " +"}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                {item.type === "patent" ? item.jurisdiction : item.venue}
              </div>

              {item.citationCount && (
                <span className="text-xs">
                  {item.citationCount} citations
                </span>
              )}
            </div>
          </div>

          {/* Similarity Meter */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className={`text-sm font-medium ${getSimilarityColor(item.similarity)}`}>
                {item.similarity}%
              </div>
              <div className="w-20">
                <Progress 
                  value={item.similarity} 
                  className={`h-1 ${getSimilarityBg(item.similarity)}`}
                />
              </div>
            </div>
            
            {/* Patent Warning Badge */}
            {item.patentWarning && item.similarity >= 80 && (
              <Badge variant="destructive" className="gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                License Risk
              </Badge>
            )}
          </div>
        </div>

        {/* Key Points Preview */}
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {topSimilarity && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Key Similarity
              </div>
              <p className="text-foreground">{topSimilarity}</p>
            </div>
          )}
          
          {topDifference && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Key Difference
              </div>
              <p className="text-foreground">{topDifference}</p>
            </div>
          )}
        </div>

        {/* Show Details Toggle */}
        {hasMoreDetails && (
          <div className="mt-3 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Show details
                </>
              )}
            </Button>
          </div>
        )}

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {item.similarities && item.similarities.length > 1 && (
              <div>
                <div className="text-sm font-medium text-foreground mb-2">
                  All Key Similarities
                </div>
                <ul className="space-y-1">
                  {item.similarities.map((similarity, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      {similarity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {item.differences && item.differences.length > 1 && (
              <div>
                <div className="text-sm font-medium text-foreground mb-2">
                  All Key Differences
                </div>
                <ul className="space-y-1">
                  {item.differences.map((difference, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      {difference}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* External Link */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-3 w-3" />
                View Full Document
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultRow;