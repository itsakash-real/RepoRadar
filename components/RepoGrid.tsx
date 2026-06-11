import { EnrichedRepo } from "@/lib/types";
import { RepoCard } from "./RepoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

type Props = {
  results: EnrichedRepo[];
  status: string;
  totalCount: number;
  query: string;
};

function SkeletonCard() {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </Card>
  );
}

export function RepoGrid({ results, status, totalCount, query }: Props) {
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
      <p className="mt-8 text-center text-[#999999]">
        No repos found for "{query}". Try a different search.
      </p>
    );
  }

  return (
    <div className="mt-6">
      {status === "done" && (
        <p className="text-sm text-[#999999] mb-4">
          Showing top {results.length} of ~{totalCount.toLocaleString()} repos
          for "{query}", ranked by AI relevance
        </p>
      )}
      {status === "analyzing" && (
        <p className="text-sm text-[#999999] mb-4 animate-pulse">
          AI is scoring repos — results appear below in real time...
        </p>
      )}
      <div className="space-y-4">
        {results.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
