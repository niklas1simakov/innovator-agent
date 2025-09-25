import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { SearchFilters } from "@/types/research";

interface FilterChip {
  id: string;
  label: string;
  value: string;
}

interface ResultsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onFiltersOpen: () => void;
  resultCount: number;
  activeTab: "patents" | "publications";
}

export const ResultsToolbar = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFiltersChange, 
  onFiltersOpen, 
  resultCount,
  activeTab 
}: ResultsToolbarProps) => {
  
  const getFilterChips = (): FilterChip[] => {
    const chips: FilterChip[] = [];
    
    if (filters.yearRange[0] !== 2015 || filters.yearRange[1] !== 2024) {
      chips.push({
        id: "year",
        label: "Year",
        value: `${filters.yearRange[0]}–${filters.yearRange[1]}`
      });
    }
    
    if (filters.similarityThreshold > 0) {
      chips.push({
        id: "similarity",
        label: "Min Similarity",
        value: `≥${filters.similarityThreshold}%`
      });
    }

    return chips;
  };

  const filterChips = getFilterChips();
  const hasActiveFilters = filterChips.length > 0;

  const removeFilter = (chipId: string) => {
    const newFilters = { ...filters };
    
    if (chipId === "year") {
      newFilters.yearRange = [2015, 2024];
    } else if (chipId === "similarity") {
      newFilters.similarityThreshold = 0;
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      keyword: "",
      yearRange: [2015, 2024],
      similarityThreshold: 0,
      sortBy: "similarity",
      sortOrder: "desc"
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search within results..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filters Button */}
        <Button 
          variant="outline" 
          onClick={onFiltersOpen}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {filterChips.length}
            </Badge>
          )}
        </Button>

        {/* Result Count */}
        <div className="text-sm text-muted-foreground shrink-0">
          {resultCount} {activeTab}
        </div>
      </div>

      {/* Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {filterChips.map((chip) => (
            <Badge
              key={chip.id}
              variant="secondary"
              className="gap-1 pl-2 pr-1"
            >
              <span className="text-xs">
                {chip.label}: {chip.value}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0.5 hover:bg-transparent"
                onClick={() => removeFilter(chip.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResultsToolbar;