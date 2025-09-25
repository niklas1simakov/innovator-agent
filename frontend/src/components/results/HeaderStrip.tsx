import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Analysis } from "@/types/analysis";
import { formatNoveltyPercentage } from "@/lib/utils";
interface HeaderStripProps {
  analysis: Analysis;
  onEditSearch: () => void;
}
interface MiniRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}
export const MiniRing = ({
  percentage,
  size = 60,
  strokeWidth = 4,
  className = ""
}: MiniRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage / 100 * circumference;
  const getColor = (percentage: number) => {
    if (percentage >= 80) return "hsl(var(--success))";
    if (percentage >= 40) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };
  return <div className={`relative ${className}`}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={getColor(percentage)} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold">{formatNoveltyPercentage(percentage)}%</span>
      </div>
    </div>;
};
export const HeaderStrip = ({
  analysis,
  onEditSearch
}: HeaderStripProps) => {
  const noveltyPercent = analysis.result.noveltyPercent;
  const patentCount = analysis.result.patents.length;
  const publicationCount = analysis.result.publications.length;
  const getNoveltyLevel = (percentage: number) => {
    if (percentage >= 80) return {
      level: "High",
      color: "success"
    };
    if (percentage >= 40) return {
      level: "Moderate",
      color: "warning"
    };
    return {
      level: "Low",
      color: "destructive"
    };
  };
  const noveltyInfo = getNoveltyLevel(noveltyPercent);
  return <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-card border border-border rounded-lg shadow-sm">
      {/* Novelty Ring & Badge */}
      <div className="flex items-center gap-4">
        <MiniRing percentage={noveltyPercent} size={80} strokeWidth={6} />
        <div>
          <Badge variant="outline" className={`mb-2 ${noveltyInfo.color === "success" ? "border-success text-success bg-success-muted" : noveltyInfo.color === "warning" ? "border-warning text-warning bg-warning-muted" : "border-destructive text-destructive bg-destructive/10"}`}>
            {noveltyInfo.level} Novelty
          </Badge>
          <div className="text-2xl font-bold">{formatNoveltyPercentage(noveltyPercent)}% Novel</div>
        </div>
      </div>

      {/* Summary Text */}
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground mb-1">
          Based on analysis of <span className="font-medium text-foreground">{patentCount} patents</span> and{" "}
          <span className="font-medium text-foreground">{publicationCount} publications</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {noveltyPercent >= 80 ? "Your research shows strong novelty with low similarity to existing work." : noveltyPercent >= 40 ? "Your research has moderate novelty with some similarities to existing work." : "Your research shows significant overlap with existing patents and publications."}
        </p>
      </div>
      
    </div>;
};
export default HeaderStrip;