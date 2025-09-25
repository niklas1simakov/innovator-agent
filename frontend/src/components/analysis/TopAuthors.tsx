import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import { ResearchItem } from "@/types/research";

interface TopAuthorsProps {
  patents: ResearchItem[];
  publications: ResearchItem[];
  className?: string;
}

interface AuthorCount {
  name: string;
  count: number;
  percentage: number;
}

export const TopAuthors = ({ patents, publications, className = "" }: TopAuthorsProps) => {
  const calculateTopAuthors = (): AuthorCount[] => {
    const authorCounts: Record<string, number> = {};
    
    // Count authors from publications (excluding assignees from patents)
    publications.forEach(publication => {
      publication.authorsOrAssignee.forEach(author => {
        authorCounts[author] = (authorCounts[author] || 0) + 1;
      });
    });
    
    const totalCount = Object.values(authorCounts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(authorCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 authors
  };

  const topAuthors = calculateTopAuthors();
  const maxCount = Math.max(...topAuthors.map(author => author.count), 1);

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          Top Authors
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="h-60">
        <CardContent className="pr-4">
          {topAuthors.length > 0 ? (
            <div className="space-y-4">
              {topAuthors.map((author, index) => (
                <div key={author.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate pr-2" title={author.name}>
                      {index + 1}. {author.name}
                    </span>
                    <span className="text-muted-foreground shrink-0">
                      {author.count} paper{author.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Progress 
                    value={(author.count / maxCount) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No author data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default TopAuthors;