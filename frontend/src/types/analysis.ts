export interface AnalysisInput {
  id: string;
  title: string;
  abstract: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
}

export interface AnalysisResult {
  noveltyPercent: number;
  maxSimilarity: number;
  publications: any[]; // ResearchItem[]
  patents: any[]; // ResearchItem[]
  topAuthors: { name: string; score: number }[];
  timeline: { year: number; count: number; byType?: { publication: number; patent: number } }[];
}

export interface Analysis {
  input: AnalysisInput;
  result: AnalysisResult;
}

export type ViewMode = "input" | "results";