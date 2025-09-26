import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Analysis, AnalysisInput, AnalysisResult } from "@/types/analysis";
import { SearchResults, ResearchItem } from "@/types/research";
import { fetchAnalysis, BackendDocument } from "@/lib/api";

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

  // New function to update analysis and recompute results via backend
  const updateAnalysisWithRecompute = async (id: string, updates: { title: string; abstract: string }) => {
    const analysis = analyses.find(a => a.input.id === id);
    if (!analysis) return;

    const updatedInput: AnalysisInput = {
      ...analysis.input,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const backend = await fetchAnalysis({ title: updates.title, abstract: updates.abstract });

    // Map backend docs to existing ResearchItem-like shape used in UI
    const toItem = (d: BackendDocument) => {
      const similarity = Math.round((d.score <= 1 ? d.score * 100 : d.score) || 0);
      const year = new Date(d.publication_date).getFullYear();
      return {
        id: d.id,
        type: d.type,
        title: d.title,
        authorsOrAssignee: d.authors || [],
        year: Number.isFinite(year) ? year : 0,
        date: d.publication_date,
        similarity,
        similarities: d.similarities || [],
        differences: d.differences || [],
        patentWarning: d.type === 'patent' ? (d.novelty_score !== null && d.novelty_score !== undefined ? d.novelty_score < 60 : undefined) : undefined,
        url: d.url,
      };
    };

    const patents = backend.documents.filter(d => d.type === 'patent').map(toItem);
    const publications = backend.documents.filter(d => d.type === 'publication').map(toItem);

    const topAuthors = calculateTopAuthors(patents, publications);
    const timeline = calculateTimeline(patents, publications);

    const maxSimilarity = Math.max(0, ...[...patents, ...publications].map(i => i.similarity));

    const updatedResult: AnalysisResult = {
      noveltyPercent: Math.round(backend.novelty_score),
      maxSimilarity,
      publications,
      patents,
      topAuthors,
      timeline,
    };

    setAnalyses(prev => prev.map(a => 
      a.input.id === id 
        ? { input: updatedInput, result: updatedResult }
        : a
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