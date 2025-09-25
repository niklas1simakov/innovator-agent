import { useState } from "react";
import { SearchFilters } from "@/types/research";
import { Analysis } from "@/types/analysis";
import HeaderStrip from "@/components/results/HeaderStrip";
import ResultsTabs from "@/components/results/ResultsTabs";
import InsightsPanel from "@/components/results/InsightsPanel";
import { AbstractViewer } from "@/components/results/AbstractViewer";
import { EditAbstractDialog } from "@/components/results/EditAbstractDialog";
import { useUIState } from "@/hooks/useUIState";
import { useToast } from "@/hooks/use-toast";

interface ResultsLayoutProps {
  analysis: Analysis;
  onEditSearch: () => void;
  onUpdateAnalysis: (id: string, updates: { title: string; abstract: string }) => void;
  onCreateNewAnalysis: (input: { title: string; abstract: string }) => void;
}

export const ResultsLayout = ({ 
  analysis: analysisData, 
  onEditSearch, 
  onUpdateAnalysis, 
  onCreateNewAnalysis 
}: ResultsLayoutProps) => {
  const { toast } = useToast();
  const { getAnalysisUIState, setAbstractExpanded } = useUIState();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const patents = analysisData.result.patents;
  const publications = analysisData.result.publications;
  
  const analysisUIState = getAnalysisUIState(analysisData.input.id);
  const abstractExpanded = analysisUIState.abstractExpanded || false;
  
  const [patentFilters, setPatentFilters] = useState<SearchFilters>({
    keyword: "",
    yearRange: [2015, 2024],
    similarityThreshold: 0,
    sortBy: "similarity",
    sortOrder: "desc"
  });
  
  const [publicationFilters, setPublicationFilters] = useState<SearchFilters>({
    keyword: "",
    yearRange: [2015, 2024],
    similarityThreshold: 0,
    sortBy: "similarity",
    sortOrder: "desc"
  });

  const handleAbstractToggle = () => {
    setAbstractExpanded(analysisData.input.id, !abstractExpanded);
  };

  const handleEditAbstract = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (mode: "update" | "new", values: { title: string; abstract: string }) => {
    if (mode === "update") {
      onUpdateAnalysis(analysisData.input.id, values);
      toast({
        title: "Analysis updated",
        description: "Your analysis has been updated with the new abstract."
      });
    } else {
      onCreateNewAnalysis(values);
      toast({
        title: "New analysis created",
        description: "A new analysis has been created from your updated abstract."
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Strip */}
        <HeaderStrip analysis={analysisData} onEditSearch={handleEditAbstract} />
        
        {/* Abstract Viewer */}
        <AbstractViewer
          title={analysisData.input.title}
          abstract={analysisData.input.abstract}
          expanded={abstractExpanded}
          onToggle={handleAbstractToggle}
          onEdit={handleEditAbstract}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Results */}
          <div className="lg:col-span-2">
            <ResultsTabs
              patents={patents}
              publications={publications}
              patentFilters={patentFilters}
              publicationFilters={publicationFilters}
              onPatentFiltersChange={setPatentFilters}
              onPublicationFiltersChange={setPublicationFilters}
            />
          </div>

          {/* Right Column - Insights */}
          <div>
            <InsightsPanel 
              patents={patents} 
              publications={publications} 
            />
          </div>
        </div>
        
        {/* Edit Abstract Dialog */}
        <EditAbstractDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          title={analysisData.input.title}
          abstract={analysisData.input.abstract}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default ResultsLayout;