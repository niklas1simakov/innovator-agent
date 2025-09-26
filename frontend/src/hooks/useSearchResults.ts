import { useState, useEffect } from "react";
import { SearchResults, SearchInput, ResearchItem } from "@/types/research";
import { fetchAnalysis, BackendAnalysisResponse, BackendDocument } from "@/lib/api";

function toResearchItem(doc: BackendDocument): ResearchItem {
  const score = 100 - doc.novelty_score;
  const similarity0to100 = Math.round((score <= 1 ? score * 100 : score));
  const year = new Date(doc.publication_date).getFullYear();

  return {
    id: doc.id,
    type: doc.type,
    title: doc.title,
    authorsOrAssignee: doc.authors || [],
    year: Number.isFinite(year) ? year : 0,
    date: doc.publication_date,
    similarity: similarity0to100,
    similarities: doc.similarities || [],
    differences: doc.differences || [],
    patentWarning: doc.type === "patent" ? (doc.novelty_score !== null && doc.novelty_score !== undefined ? doc.novelty_score < 60 : undefined) : undefined,
    url: doc.url,
  };
}

function mapBackendToResults(res: BackendAnalysisResponse): SearchResults {
  const patents = res.documents.filter(d => d.type === "patent").map(toResearchItem);
  const publications = res.documents.filter(d => d.type === "publication").map(toResearchItem);

  // Frontend expects noveltyPercentage where higher means more novel. Backend returns average novelty_score (0..100 where higher is more novel).
  const noveltyPercentage = Math.round(res.novelty_score);

  const maxSimilarity = Math.max(0, ...[...patents, ...publications].map(i => i.similarity));

  return {
    patents,
    publications,
    analysis: {
    noveltyPercentage,
      analysisText: res.novelty_analysis || "",
      maxSimilarity,
    },
    isLoading: false,
  };
}

export const useSearchResults = (input?: SearchInput): SearchResults => {
  const [results, setResults] = useState<SearchResults>({
    patents: [],
    publications: [],
    analysis: {
      noveltyPercentage: 0,
      analysisText: "",
      maxSimilarity: 0,
    },
    isLoading: false,
    error: undefined,
  });

  useEffect(() => {
    if (!input?.title || !input?.abstract) return;

    let cancelled = false;
    setResults(prev => ({ ...prev, isLoading: true, error: undefined }));

    fetchAnalysis({ title: input.title, abstract: input.abstract })
      .then(res => {
        if (cancelled) return;
        const mapped = mapBackendToResults(res);
        setResults(mapped);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // On failure, return empty results but stop loading
        const message = err instanceof Error ? err.message : "Request failed";
        setResults(prev => ({
          ...prev,
          patents: [],
          publications: [],
          analysis: { noveltyPercentage: 0, analysisText: "", maxSimilarity: 0 },
          isLoading: false,
          error: message,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [input?.title, input?.abstract]);

  return results;
};

export default useSearchResults;