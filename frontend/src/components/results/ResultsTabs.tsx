import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale, FileText, ChevronDown } from "lucide-react";
import { ResearchItem, SearchFilters } from "@/types/research";
import ResultRow from "./ResultRow";
import ResultsToolbar from "./ResultsToolbar";
import FiltersDrawer from "./FiltersDrawer";

interface ResultsTabsProps {
  patents: ResearchItem[];
  publications: ResearchItem[];
  patentFilters: SearchFilters;
  publicationFilters: SearchFilters;
  onPatentFiltersChange: (filters: SearchFilters) => void;
  onPublicationFiltersChange: (filters: SearchFilters) => void;
}

export const ResultsTabs = ({
  patents,
  publications,
  patentFilters,
  publicationFilters,
  onPatentFiltersChange,
  onPublicationFiltersChange,
}: ResultsTabsProps) => {
  const [activeTab, setActiveTab] = useState<"patents" | "publications">("patents");
  const [patentSearchQuery, setPatentSearchQuery] = useState("");
  const [publicationSearchQuery, setPublicationSearchQuery] = useState("");
  const [showAllPatents, setShowAllPatents] = useState(false);
  const [showAllPublications, setShowAllPublications] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter and search logic
  const filterItems = (items: ResearchItem[], filters: SearchFilters, searchQuery: string): ResearchItem[] => {
    let filtered = items.filter(item => {
      // Search query filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Year range filter
      if (item.year < filters.yearRange[0] || item.year > filters.yearRange[1]) {
        return false;
      }
      
      // Similarity threshold filter
      if (item.similarity < filters.similarityThreshold) {
        return false;
      }
      
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (filters.sortBy === "similarity") {
        comparison = a.similarity - b.similarity;
      } else if (filters.sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      
      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  };

  const filteredPatents = filterItems(patents, patentFilters, patentSearchQuery);
  const filteredPublications = filterItems(publications, publicationFilters, publicationSearchQuery);

  const PatentsTab = () => {
    const itemsToShow = showAllPatents ? filteredPatents : filteredPatents.slice(0, 3);
    const hasMore = filteredPatents.length > 3;

    return (
      <div className="space-y-4">
        <ResultsToolbar
          searchQuery={patentSearchQuery}
          onSearchChange={setPatentSearchQuery}
          filters={patentFilters}
          onFiltersChange={onPatentFiltersChange}
          onFiltersOpen={() => setIsFiltersOpen(true)}
          resultCount={filteredPatents.length}
          activeTab="patents"
        />
        
        {filteredPatents.length > 0 ? (
          <div className="space-y-3">
            {itemsToShow.map((patent) => (
              <ResultRow key={patent.id} item={patent} />
            ))}
            
            {hasMore && !showAllPatents && (
              <div className="text-center py-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllPatents(true)}
                  className="gap-2"
                >
                  <ChevronDown className="h-4 w-4" />
                  View all {filteredPatents.length} patents
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No patents found</h3>
            <p className="text-sm">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    );
  };

  const PublicationsTab = () => {
    const itemsToShow = showAllPublications ? filteredPublications : filteredPublications.slice(0, 3);
    const hasMore = filteredPublications.length > 3;

    return (
      <div className="space-y-4">
        <ResultsToolbar
          searchQuery={publicationSearchQuery}
          onSearchChange={setPublicationSearchQuery}
          filters={publicationFilters}
          onFiltersChange={onPublicationFiltersChange}
          onFiltersOpen={() => setIsFiltersOpen(true)}
          resultCount={filteredPublications.length}
          activeTab="publications"
        />
        
        {filteredPublications.length > 0 ? (
          <div className="space-y-3">
            {itemsToShow.map((publication) => (
              <ResultRow key={publication.id} item={publication} />
            ))}
            
            {hasMore && !showAllPublications && (
              <div className="text-center py-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllPublications(true)}
                  className="gap-2"
                >
                  <ChevronDown className="h-4 w-4" />
                  View all {filteredPublications.length} publications
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No publications found</h3>
            <p className="text-sm">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "patents" | "publications")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patents" className="gap-2">
            <Scale className="h-4 w-4" />
            Similar Patents ({filteredPatents.length})
          </TabsTrigger>
          <TabsTrigger value="publications" className="gap-2">
            <FileText className="h-4 w-4" />
            Similar Publications ({filteredPublications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patents" className="mt-6">
          <PatentsTab />
        </TabsContent>
        
        <TabsContent value="publications" className="mt-6">
          <PublicationsTab />
        </TabsContent>
      </Tabs>

      {/* Filters Drawer */}
      <FiltersDrawer
        isOpen={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        activeTab={activeTab}
        filters={activeTab === "patents" ? patentFilters : publicationFilters}
        onFiltersChange={activeTab === "patents" ? onPatentFiltersChange : onPublicationFiltersChange}
      />
    </>
  );
};

export default ResultsTabs;