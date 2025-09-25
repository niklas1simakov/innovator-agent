import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { SearchFilters } from "@/types/research";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
interface FilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  resultCount: number;
  className?: string;
}
export const FilterBar = ({
  filters,
  onFiltersChange,
  resultCount,
  className = ""
}: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleKeywordChange = (keyword: string) => {
    onFiltersChange({
      ...filters,
      keyword
    });
  };
  const handleYearRangeChange = ([min, max]: number[]) => {
    onFiltersChange({
      ...filters,
      yearRange: [min, max]
    });
  };
  const handleSimilarityThresholdChange = ([threshold]: number[]) => {
    onFiltersChange({
      ...filters,
      similarityThreshold: threshold
    });
  };
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [SearchFilters["sortBy"], SearchFilters["sortOrder"]];
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder
    });
  };
  const clearFilters = () => {
    onFiltersChange({
      keyword: "",
      yearRange: [2015, 2024],
      similarityThreshold: 0,
      sortBy: "similarity",
      sortOrder: "desc"
    });
  };
  const hasActiveFilters = filters.keyword || filters.yearRange[0] !== 2015 || filters.yearRange[1] !== 2024 || filters.similarityThreshold > 0;
  return <Card className={`border-0 bg-secondary/50 ${className}`}>
      <CardContent className="p-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search keywords..." value={filters.keyword} onChange={e => handleKeywordChange(e.target.value)} className="pl-10 h-10" />
              </div>
              
              <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="similarity-desc">Similarity: High to Low</SelectItem>
                  <SelectItem value="similarity-asc">Similarity: Low to High</SelectItem>
                  <SelectItem value="date-desc">Date: Newest First</SelectItem>
                  <SelectItem value="date-asc">Date: Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {resultCount} results
              </span>
              <CollapsibleTrigger asChild>
                
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Publication Year</Label>
                <div className="px-2">
                  <Slider value={filters.yearRange} onValueChange={handleYearRangeChange} min={2015} max={2024} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{filters.yearRange[0]}</span>
                    <span>{filters.yearRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Minimum Similarity</Label>
                <div className="px-2">
                  <Slider value={[filters.similarityThreshold]} onValueChange={handleSimilarityThresholdChange} min={0} max={90} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className="font-medium">{filters.similarityThreshold}%</span>
                    <span>90%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                {hasActiveFilters && <Button variant="outline" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                    Clear Filters
                  </Button>}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>;
};
export default FilterBar;