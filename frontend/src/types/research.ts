export interface ResearchItem {
  id: string;
  type: "patent" | "publication";
  title: string;
  authorsOrAssignee: string[];
  year: number;
  date: string;
  similarity: number; // 0 to 100
  similarities: string[]; // 2 to 4 bullets
  differences: string[]; // 2 to 4 bullets
  patentWarning?: boolean; // true if similarity >= 85
  venue?: string; // for publications
  jurisdiction?: string; // for patents
  citationCount?: number;
}

export interface SearchFilters {
  keyword: string;
  yearRange: [number, number];
  similarityThreshold: number;
  sortBy: "similarity" | "date";
  sortOrder: "asc" | "desc";
}

export interface NoveltyAnalysis {
  noveltyPercentage: number;
  analysisText: string;
  maxSimilarity: number;
}

export interface SearchResults {
  patents: ResearchItem[];
  publications: ResearchItem[];
  analysis: NoveltyAnalysis;
  isLoading: boolean;
}

export interface SearchInput {
  title: string;
  abstract: string;
}