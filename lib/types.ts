export interface GitHubRepo {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface AIAnalysis {
  repoId: number;
  relevanceScore: number;
  techStack: string[];
  summary: string;
  productionReady: boolean;
}

export interface EnrichedRepo extends GitHubRepo {
  analysis: AIAnalysis | null;
}

export interface SearchResponse {
  repos: GitHubRepo[];
  total_count: number;
  query: string;
}

export interface AnalyzeResponse {
  analyses: AIAnalysis[];
}

export type CreditState = {
  used: number;
  limit: number;
  isLoggedIn: boolean;
  canSearch: boolean;
};
