export interface BackendDocument {
  id: string;
  title: string;
  type: "patent" | "publication";
  score: number; // 0..1
  url: string;
  abstract: string;
  publication_date: string;
  authors: string[];
  institutions?: string[] | null;
  similarities?: string[] | null;
  differences?: string[] | null;
  novelty_score?: number | null; // 0..100
}

export interface BackendAuthorData {
  name: string;
  number_of_publications: number;
}

export interface BackendAnalysisResponse {
  documents: BackendDocument[];
  novelty_score: number; // average 0..100
  novelty_analysis: string;
  publication_dates: string[];
  authors: BackendAuthorData[];
}

function getBackendBaseUrl(): string {
  // Allow override via env at build time, else default to localhost:8000
  const maybeEnv = (import.meta as unknown as { env?: Record<string, unknown> })?.env;
  const fromEnv = (maybeEnv?.VITE_BACKEND_URL as string | undefined) || undefined;
  return fromEnv || "http://localhost:8000";
}

export async function fetchAnalysis(params: { title: string; abstract: string }): Promise<BackendAnalysisResponse> {
  const base = getBackendBaseUrl();
  const url = new URL("/get_analysis", base);
  url.searchParams.set("title", params.title);
  url.searchParams.set("abstract", params.abstract);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as BackendAnalysisResponse;
}


