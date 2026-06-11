"use client";

import { EnrichedRepo } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface RepoCardProps {
  repo: EnrichedRepo;
  status?: string;
  onClick?: () => void;
}

export function RepoCard({ repo, status, onClick }: RepoCardProps) {
  const { analysis } = repo;
  const stars = repo.stargazers_count.toLocaleString();
  const forks = repo.forks_count.toLocaleString();
  const updatedAt = new Date(repo.updated_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  const getScoreBadgeStyle = (score: number) => {
    const baseStyle = {
      fontSize: "11px",
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: "999px",
      display: "inline-block",
    };

    if (score >= 8) {
      return {
        ...baseStyle,
        backgroundColor: "rgba(90, 158, 111, 0.15)",
        border: "1px solid rgba(90, 158, 111, 0.3)",
        color: "#5a9e6f",
      };
    } else if (score >= 5) {
      return {
        ...baseStyle,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        color: "#7a8f7a",
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        color: "#4a5c4a",
      };
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? "#141d14" : "#111812",
        border: isHovered ? "1px solid rgba(255,255,255,0.13)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        transition: "border-color 0.15s, background-color 0.15s",
      }}
      className="relative flex flex-col space-y-3"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 pr-16">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            className="flex-shrink-0"
          />
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsLinkHovered(true)}
            onMouseLeave={() => setIsLinkHovered(false)}
            style={{
              color: isLinkHovered ? "#5a9e6f" : "#e8ede8",
              fontWeight: 500,
              fontSize: "13px",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            className="truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {repo.full_name}
          </a>
        </div>
      </div>

      {/* Score Badge - Absolute Positioned */}
      {analysis ? (
        <span
          style={getScoreBadgeStyle(analysis.relevanceScore)}
          className="absolute top-5 right-5"
        >
          {analysis.relevanceScore}/10
        </span>
      ) : status === "done" || status === "error" ? (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "999px",
            display: "inline-block",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            color: "#4a5c4a",
          }}
          className="absolute top-5 right-5"
        >
          –
        </span>
      ) : (
        <Skeleton className="absolute top-5 right-5 h-5 w-12" />
      )}

      {/* AI Summary */}
      {analysis ? (
        <p
          style={{
            color: "#7a8f7a",
            fontSize: "13px",
            lineHeight: "1.6",
            marginTop: "8px",
          }}
          className="pr-2"
        >
          {analysis.summary}
        </p>
      ) : status === "done" || status === "error" ? (
        null
      ) : (
        <div className="space-y-1.5 pr-2 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      )}

      {/* Original Description */}
      {repo.description && (
        <p
          style={{
            color: "#4a5c4a",
            fontSize: "12px",
            fontStyle: "italic",
          }}
          className="line-clamp-2 pr-2"
        >
          {repo.description}
        </p>
      )}

      {/* Tech Stack Badges */}
      {analysis ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {analysis.techStack.map((tech) => (
            <span
              key={tech}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                color: "#7a8f7a",
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
              className="font-medium"
            >
              {tech}
            </span>
          ))}
          {analysis.productionReady && (
            <span
              style={{
                backgroundColor: "rgba(90, 158, 111, 0.12)",
                border: "1px solid rgba(90, 158, 111, 0.2)",
                color: "#5a9e6f",
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
              className="font-medium"
            >
              Production ready
            </span>
          )}
        </div>
      ) : status === "done" || status === "error" ? (
        repo.topics && repo.topics.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {repo.topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  color: "#7a8f7a",
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "6px",
                }}
                className="font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        ) : null
      ) : (
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      )}

      {/* Stats row */}
      <div
        style={{
          color: "#4a5c4a",
          fontSize: "12px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "12px",
          marginTop: "12px",
        }}
        className="flex items-center gap-3"
      >
        <span>⭐ {stars}</span>
        <span>🍴 {forks}</span>
        {repo.language && <span>· {repo.language}</span>}
        <span className="ml-auto">Updated {updatedAt}</span>
      </div>
    </div>
  );
}
