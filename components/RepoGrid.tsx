"use client";

import { EnrichedRepo } from "@/lib/types";
import { RepoCard } from "./RepoCard";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  results: EnrichedRepo[];
  status: string;
  totalCount: number;
  query: string;
  onSelect: (repo: EnrichedRepo) => void;
};

function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: "#111812",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "20px",
      }}
      className="relative flex flex-col space-y-3"
    >
      <div className="flex items-center gap-2 pr-16">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="absolute top-5 right-5 h-5 w-12" />
      <div className="space-y-1.5 pr-2 mt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "12px",
          marginTop: "12px",
        }}
        className="flex items-center gap-3"
      >
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-16" />
      </div>
    </div>
  );
}

export function RepoGrid({ results, status, totalCount, query, onSelect }: Props) {
  const isLoading = status === "searching";

  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0 && status === "done") {
    return (
      <p
        style={{ color: "#7a8f7a", fontSize: "14px" }}
        className="mt-8 text-center"
      >
        No repos found for "{query}". Try a different search.
      </p>
    );
  }

  return (
    <div className="mt-6">
      {status === "done" && (
        <p
          style={{
            color: "#4a5c4a",
            fontSize: "12px",
            marginBottom: "20px",
          }}
        >
          Showing top {results.length} of ~{totalCount.toLocaleString()} repos
          for "{query}", ranked by AI relevance
        </p>
      )}
      {status === "analyzing" && (
        <p
          style={{
            color: "#7a8f7a",
            fontSize: "12px",
            marginBottom: "20px",
          }}
          className="animate-pulse"
        >
          AI is scoring repos — results appear below in real time...
        </p>
      )}
      <div className="space-y-4">
        {results.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            status={status}
            onClick={() => onSelect(repo)}
          />
        ))}
      </div>
    </div>
  );
}
