import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Analysis, AnalysisInput, AnalysisResult } from "@/types/analysis";
import { SearchResults, ResearchItem } from "@/types/research";
import { useSearchResults } from "./useSearchResults";

const STORAGE_KEY = "valorize.history.v1";

// Helper function to calculate top authors from research items
const calculateTopAuthors = (patents: ResearchItem[], publications: ResearchItem[]) => {
  const authorCount: { [key: string]: number } = {};
  
  [...patents, ...publications].forEach(item => {
    item.authorsOrAssignee.forEach(author => {
      authorCount[author] = (authorCount[author] || 0) + 1;
    });
  });

  return Object.entries(authorCount)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

// Helper function to calculate timeline data
const calculateTimeline = (patents: ResearchItem[], publications: ResearchItem[]) => {
  const yearCount: { [key: number]: { publication: number; patent: number } } = {};
  
  patents.forEach(item => {
    if (!yearCount[item.year]) {
      yearCount[item.year] = { publication: 0, patent: 0 };
    }
    yearCount[item.year].patent += 1;
  });

  publications.forEach(item => {
    if (!yearCount[item.year]) {
      yearCount[item.year] = { publication: 0, patent: 0 };
    }
    yearCount[item.year].publication += 1;
  });

  return Object.entries(yearCount)
    .map(([year, counts]) => ({
      year: parseInt(year),
      count: counts.publication + counts.patent,
      byType: counts
    }))
    .sort((a, b) => a.year - b.year);
};

export function useAnalysisHistory() {
  const [analyses, setAnalyses] = useLocalStorage<Analysis[]>(STORAGE_KEY, []);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);

  const activeAnalysis = analyses.find(a => a.input.id === activeAnalysisId) || null;

  const addAnalysis = (input: AnalysisInput, searchResults: SearchResults) => {
    const topAuthors = calculateTopAuthors(searchResults.patents, searchResults.publications);
    const timeline = calculateTimeline(searchResults.patents, searchResults.publications);

    const result: AnalysisResult = {
      noveltyPercent: searchResults.analysis.noveltyPercentage,
      maxSimilarity: searchResults.analysis.maxSimilarity,
      publications: searchResults.publications,
      patents: searchResults.patents,
      topAuthors,
      timeline
    };

    const analysis: Analysis = { input, result };
    
    setAnalyses(prev => [analysis, ...prev]);
    setActiveAnalysisId(input.id);
    
    return analysis;
  };

  const updateAnalysis = (id: string, updates: Partial<AnalysisInput>) => {
    setAnalyses(prev => prev.map(analysis => 
      analysis.input.id === id 
        ? { ...analysis, input: { ...analysis.input, ...updates } }
        : analysis
    ));
  };

  // New function to update analysis and recompute results
  const updateAnalysisWithRecompute = (id: string, updates: { title: string; abstract: string }) => {
    const analysis = analyses.find(a => a.input.id === id);
    if (!analysis) return;

    // Create updated input with new timestamp
    const updatedInput: AnalysisInput = {
      ...analysis.input,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Generate mock data for recomputation using the same logic as useSearchResults
    const mockSearchInput = { title: updates.title, abstract: updates.abstract };
    
    // Simulate the mock data generation that useSearchResults would do
    const mockData = {
      publications: [
        {
          id: "pub1",
          type: "publication" as const,
          title: `Related research for: ${mockSearchInput.title}`,
          authorsOrAssignee: ["Dr. Smith", "Dr. Johnson"],
          year: 2023,
          date: "2023-08-15",
          similarity: 85,
          similarities: [
            "Both studies focus on similar methodology",
            "Comparable research objectives",
            "Similar experimental design"
          ],
          differences: [
            "Different sample sizes used",
            "Alternative data collection methods"
          ],
          venue: "Journal of Advanced Research",
          citationCount: 45
        },
        {
          id: "pub2", 
          type: "publication" as const,
          title: `Advanced study on: ${mockSearchInput.title.substring(0, 30)}...`,
          authorsOrAssignee: ["Prof. Davis", "Dr. Wilson"],
          year: 2022,
          date: "2022-06-10",
          similarity: 72,
          similarities: [
            "Similar theoretical framework",
            "Comparable data analysis approach"
          ],
          differences: [
            "Different geographical focus",
            "Alternative statistical methods",
            "Different time period studied"
          ],
          venue: "International Research Journal",
          citationCount: 32
        }
      ],
      patents: [
        {
          id: "pat1",
          type: "patent" as const,
          title: `Patent related to: ${mockSearchInput.title}`,
          authorsOrAssignee: ["TechCorp Inc.", "Innovation Labs"],
          year: 2023,
          date: "2023-03-15",
          similarity: 78,
          similarities: [
            "Similar technical approach",
            "Comparable system architecture",
            "Related problem domain"
          ],
          differences: [
            "Different implementation details",
            "Alternative hardware requirements"
          ],
          jurisdiction: "US",
          patentWarning: false
        }
      ],
      analysis: {
        noveltyPercentage: Math.max(20, Math.min(95, 60 + Math.random() * 30)),
        maxSimilarity: Math.max(0.3, Math.min(0.9, 0.5 + Math.random() * 0.4))
      }
    };

    const topAuthors = calculateTopAuthors(mockData.patents, mockData.publications);
    const timeline = calculateTimeline(mockData.patents, mockData.publications);

    const updatedResult: AnalysisResult = {
      noveltyPercent: mockData.analysis.noveltyPercentage,
      maxSimilarity: mockData.analysis.maxSimilarity,
      publications: mockData.publications,
      patents: mockData.patents,
      topAuthors,
      timeline
    };

    setAnalyses(prev => prev.map(analysis => 
      analysis.input.id === id 
        ? { input: updatedInput, result: updatedResult }
        : analysis
    ));
    
    return { input: updatedInput, result: updatedResult };
  };

  const deleteAnalysis = (id: string) => {
    setAnalyses(prev => prev.filter(analysis => analysis.input.id !== id));
    if (activeAnalysisId === id) {
      setActiveAnalysisId(null);
    }
  };

  const duplicateAnalysis = (id: string) => {
    const original = analyses.find(a => a.input.id === id);
    if (!original) return;

    const newId = crypto.randomUUID();
    const duplicated: Analysis = {
      input: {
        ...original.input,
        id: newId,
        title: `${original.input.title} (copy)`,
        createdAt: new Date().toISOString()
      },
      result: { ...original.result }
    };

    setAnalyses(prev => [duplicated, ...prev]);
    setActiveAnalysisId(newId);
  };

  const clearActive = () => {
    setActiveAnalysisId(null);
  };

  return {
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
  };
}