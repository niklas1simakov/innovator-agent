import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchFilters } from "@/types/research";

interface FiltersDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: "patents" | "publications";
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const FiltersDrawer = ({
  isOpen,
  onOpenChange,
  activeTab,
  filters,
  onFiltersChange,
}: FiltersDrawerProps) => {
  
  const handleYearRangeChange = (yearRange: number[]) => {
    onFiltersChange({ ...filters, yearRange: [yearRange[0], yearRange[1]] });
  };

  const handleSimilarityThresholdChange = (threshold: number[]) => {
    onFiltersChange({ ...filters, similarityThreshold: threshold[0] });
  };

  const handleLicenseRiskToggle = (checked: boolean) => {
    if (checked) {
      // Show only high-risk items (similarity >= 80%)
      onFiltersChange({ ...filters, similarityThreshold: 80 });
    } else {
      // Reset similarity threshold
      onFiltersChange({ ...filters, similarityThreshold: 0 });
    }
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

  const hasActiveFilters = 
    filters.yearRange[0] !== 2015 || 
    filters.yearRange[1] !== 2024 || 
    filters.similarityThreshold > 0;

  const isLicenseRiskOnly = filters.similarityThreshold >= 80;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Filter {activeTab === "patents" ? "Patents" : "Publications"}
          </SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Year Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Publication Year Range</Label>
            <div className="px-2">
              <Slider
                value={filters.yearRange}
                onValueChange={handleYearRangeChange}
                min={2010}
                max={2024}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{filters.yearRange[0]}</span>
                <span>{filters.yearRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Similarity Threshold */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Minimum Similarity</Label>
            <div className="px-2">
              <Slider
                value={[filters.similarityThreshold]}
                onValueChange={handleSimilarityThresholdChange}
                min={0}
                max={95}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0%</span>
                <span className="font-medium">{filters.similarityThreshold}%</span>
                <span>95%</span>
              </div>
            </div>
          </div>

          {/* Patent-specific filters */}
          {activeTab === "patents" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">License Risk Only</Label>
                  <p className="text-xs text-muted-foreground">
                    Show only patents with ≥80% similarity
                  </p>
                </div>
                <Switch
                  checked={isLicenseRiskOnly}
                  onCheckedChange={handleLicenseRiskToggle}
                />
              </div>
            </div>
          )}

          {/* Publication-specific filters */}
          {activeTab === "publications" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Minimum Citations</Label>
                  <p className="text-xs text-muted-foreground">
                    Filter by citation count (mock filter)
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">Any</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
            <Button onClick={() => onOpenChange(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersDrawer;