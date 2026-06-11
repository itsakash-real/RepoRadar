import { EnrichedRepo } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function RepoCard({ repo }: { repo: EnrichedRepo }) {
  const { analysis } = repo;
  const stars = repo.stargazers_count.toLocaleString();
  const forks = repo.forks_count.toLocaleString();
  const updatedAt = new Date(repo.updated_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="hover:border-[#3a3a3a] transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-5 h-5 rounded-full flex-shrink-0"
            />
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm hover:underline truncate"
            >
              {repo.full_name}
            </a>
          </div>

          {analysis ? (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 font-mono ${
                analysis.relevanceScore >= 8
                  ? "bg-green-900/40 text-green-400"
                  : analysis.relevanceScore >= 5
                  ? "bg-blue-900/40 text-blue-300"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {analysis.relevanceScore}/10
            </span>
          ) : (
            <Skeleton className="h-5 w-12 rounded-full" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {analysis ? (
          <p className="text-sm text-[#cccccc] leading-relaxed">
            {analysis.summary}
          </p>
        ) : (
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
        )}

        {repo.description && (
          <p className="text-xs text-[#666666] italic line-clamp-2">
            {repo.description}
          </p>
        )}

        {analysis ? (
          <div className="flex flex-wrap gap-1">
            {analysis.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {analysis.productionReady && (
              <Badge className="text-xs bg-green-800/50 hover:bg-green-700/50 text-green-300">
                Production ready
              </Badge>
            )}
          </div>
        ) : (
          <div className="flex gap-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-[#999999] pt-1 border-t border-[#262626]">
          <span>⭐ {stars}</span>
          <span>🍴 {forks}</span>
          {repo.language && <span>· {repo.language}</span>}
          <span className="ml-auto">Updated {updatedAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}
