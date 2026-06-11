import { useState, useCallback } from "react";
import { EnrichedRepo, GitHubRepo, AIAnalysis } from "@/lib/types";

type SearchStatus = "idle" | "searching" | "analyzing" | "done" | "error";

export function useRepoSearch() {
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<EnrichedRepo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState("");

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setStatus("searching");
    setError(null);
    setResults([]);
    setLastQuery(query);

    try {
      const searchRes = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!searchRes.ok) throw new Error("GitHub search failed");
      const searchData = await searchRes.json();

      const repos: GitHubRepo[] = searchData.repos;
      setTotalCount(searchData.total_count);

      setResults(repos.map((r) => ({ ...r, analysis: null })));
      setStatus("analyzing");

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos, query }),
      });

      if (!analyzeRes.ok) throw new Error("AI analysis failed");
      const analyzeData = await analyzeRes.json();
      const analyses: AIAnalysis[] = analyzeData.analyses;

      const enriched: EnrichedRepo[] = repos.map((r) => ({
        ...r,
        analysis: analyses.find((a) => a.repoId === r.id) ?? null,
      }));

      enriched.sort((a, b) => {
        const aScore = a.analysis?.relevanceScore ?? 0;
        const bScore = b.analysis?.relevanceScore ?? 0;
        return bScore - aScore;
      });

      setResults(enriched);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }, []);

  return { search, status, results, totalCount, error, lastQuery };
}
