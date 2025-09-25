import { useLocalStorage } from "./useLocalStorage";

export interface UIState {
  sidebarCollapsed: boolean;
  perAnalysis: Record<string, {
    resultsTab?: "patents" | "publications";
    showAllResults?: boolean;
    filters?: Record<string, unknown>;
    abstractExpanded?: boolean;
  }>;
}

const UI_STORAGE_KEY = "valorize.ui.v2";

const defaultUIState: UIState = {
  sidebarCollapsed: false,
  perAnalysis: {}
};

export function useUIState() {
  const [uiState, setUIState] = useLocalStorage<UIState>(UI_STORAGE_KEY, defaultUIState);

  const toggleSidebar = () => {
    setUIState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  };

  const setAbstractExpanded = (analysisId: string, expanded: boolean) => {
    setUIState(prev => ({
      ...prev,
      perAnalysis: {
        ...prev.perAnalysis,
        [analysisId]: {
          ...prev.perAnalysis[analysisId],
          abstractExpanded: expanded
        }
      }
    }));
  };

  const getAnalysisUIState = (analysisId: string) => {
    return uiState.perAnalysis[analysisId] || {};
  };

  return {
    uiState,
    setUIState,
    toggleSidebar,
    setAbstractExpanded,
    getAnalysisUIState
  };
}