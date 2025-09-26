import { useState, useEffect, useCallback } from "react";
import { SearchInput } from "@/types/research";
import { Analysis, AnalysisInput, ViewMode } from "@/types/analysis";
import SearchForm from "@/components/input/SearchForm";
import ResultsLayout from "@/components/results/ResultsLayout";
import { AnalysisSidebar } from "@/components/sidebar/AnalysisSidebar";
import { MobileSidebar } from "@/components/sidebar/MobileSidebar";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useUIState } from "@/hooks/useUIState";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState<SearchInput | null>(null);
  const [waitingForResults, setWaitingForResults] = useState(false);
  const [startedLoading, setStartedLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    analyses,
    activeAnalysis,
    activeAnalysisId,
    addAnalysis,
    updateAnalysis,
    updateAnalysisWithRecompute,
    deleteAnalysis,
    duplicateAnalysis,
    setActiveAnalysisId,
    clearActive
  } = useAnalysisHistory();

  const { uiState, toggleSidebar } = useUIState();

  // Use the existing search results hook for new searches
  const searchResults = useSearchResults(currentInput);

  // Handle new search submission
  const handleSearch = (input: SearchInput) => {
    setIsLoading(true);
    setCurrentInput(input);
    setWaitingForResults(true);
    setStartedLoading(false);
  };

  // Handle selecting an analysis from sidebar
  const handleSelectAnalysis = (id: string) => {
    setActiveAnalysisId(id);
    setViewMode("results");
  };

  // Handle creating new search
  const handleCreateNew = useCallback(() => {
    clearActive();
    setViewMode("input");
  }, [clearActive]);

  // Handle editing current search (back to input)
  const handleEditSearch = () => {
    setViewMode("input");
  };

  // Track when the hook enters loading for this request
  useEffect(() => {
    if (waitingForResults && searchResults?.isLoading) {
      setStartedLoading(true);
    }
  }, [waitingForResults, searchResults?.isLoading]);

  // Handle when search results are ready (successful)
  useEffect(() => {
    if (
      waitingForResults &&
      startedLoading &&
      currentInput &&
      searchResults &&
      !searchResults.isLoading &&
      !searchResults.error &&
      (searchResults.patents.length > 0 || searchResults.publications.length > 0)
    ) {
      const analysisInput: AnalysisInput = {
        id: crypto.randomUUID(),
        title: currentInput.title,
        abstract: currentInput.abstract,
        createdAt: new Date().toISOString()
      };

      addAnalysis(analysisInput, searchResults);
      setViewMode("results");
      setIsLoading(false);
      setCurrentInput(null);
      setWaitingForResults(false);
      setStartedLoading(false);
    }
  }, [waitingForResults, startedLoading, currentInput, searchResults, addAnalysis]);

  // Handle errors
  useEffect(() => {
    if (waitingForResults && searchResults?.error) {
      toast({
        title: "Analysis failed",
        description: searchResults.error,
        variant: "destructive"
      });
      setIsLoading(false);
      setWaitingForResults(false);
      setStartedLoading(false);
      setCurrentInput(null);
    }
  }, [waitingForResults, searchResults?.error, toast]);

  // Handle updating analysis with recomputation
  const handleUpdateAnalysis = (id: string, updates: { title: string; abstract: string }) => {
    updateAnalysisWithRecompute(id, updates);
  };

  // Handle creating new analysis from edit
  const handleCreateNewAnalysis = (input: { title: string; abstract: string }) => {
    const searchInput: SearchInput = input;
    setCurrentInput(searchInput);
    setIsLoading(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleCreateNew();
        // Focus on title input after switching to input view
        setTimeout(() => {
          const titleInput = document.querySelector('#title') as HTMLInputElement;
          titleInput?.focus();
        }, 100);
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Focus on filter input in sidebar - handled by sidebar component
        const filterInput = document.querySelector('[placeholder="Filter analyses..."]') as HTMLInputElement;
        filterInput?.focus();
      }

      if (e.key === '[') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [toggleSidebar, handleCreateNew]);

  // Determine what to render
  const renderContent = () => {
    if (viewMode === "input") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
          <SearchForm 
            onSubmit={handleSearch} 
            isLoading={isLoading}
            className="animate-fade-in"
          />
        </div>
      );
    }

    if (activeAnalysis) {
      return (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <ResultsLayout 
              analysis={activeAnalysis}
              onEditSearch={handleEditSearch}
              onUpdateAnalysis={handleUpdateAnalysis}
              onCreateNewAnalysis={handleCreateNewAnalysis}
            />
          </div>
          
        </div>
      );
    }

    // Fallback to input if no active analysis
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <SearchForm 
          onSubmit={handleSearch} 
          isLoading={isLoading}
          className="animate-fade-in"
        />
      </div>
    );
  };

  // Wrapper functions to match sidebar interface
  const handleRename = (id: string, newTitle: string) => {
    updateAnalysis(id, { title: newTitle });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 w-full">
      <div className={cn(
        "grid h-screen transition-all duration-300 ease-in-out",
        uiState.sidebarCollapsed 
          ? "grid-cols-[72px_1fr]" 
          : "grid-cols-[280px_1fr]"
      )}>
        {/* Mobile Hamburger */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <MobileSidebar
            analyses={analyses}
            activeId={activeAnalysisId}
            onSelect={handleSelectAnalysis}
            onCreateNew={handleCreateNew}
            onRename={handleRename}
            onDuplicate={duplicateAnalysis}
            onDelete={deleteAnalysis}
          />
        </div>
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AnalysisSidebar
            analyses={analyses}
            activeId={activeAnalysisId}
            collapsed={uiState.sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            onSelect={handleSelectAnalysis}
            onCreateNew={handleCreateNew}
            onRename={handleRename}
            onDuplicate={duplicateAnalysis}
            onDelete={deleteAnalysis}
          />
        </div>

        {/* Main Content */}
        <div className="overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;