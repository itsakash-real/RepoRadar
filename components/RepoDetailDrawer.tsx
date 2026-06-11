"use client";

import { EnrichedRepo } from "@/lib/types";
import { useEffect, useState } from "react";
import { X, ExternalLink, Star, GitFork, Code } from "lucide-react";

interface RepoDetailDrawerProps {
  repo: EnrichedRepo | null;
  onClose: () => void;
}

export function RepoDetailDrawer({ repo, onClose }: RepoDetailDrawerProps) {
  const [activeRepo, setActiveRepo] = useState<EnrichedRepo | null>(null);
  const [animate, setAnimate] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isXHovered, setIsXHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(false);

  useEffect(() => {
    if (repo) {
      setActiveRepo(repo);
      const t = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(t);
    } else {
      setAnimate(false);
      const t = setTimeout(() => setActiveRepo(null), 300);
      return () => clearTimeout(t);
    }
  }, [repo]);

  if (!activeRepo) return null;

  const { analysis } = activeRepo;
  const stars = activeRepo.stargazers_count.toLocaleString();
  const forks = activeRepo.forks_count.toLocaleString();
  const updatedAt = new Date(activeRepo.updated_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {/* Dark Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        style={{
          backgroundColor: "#111812",
          borderLeft: "1px solid rgba(255, 255, 255, 0.07)",
          width: "min(440px, 100vw)",
        }}
        className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          animate ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header Top Section (score + name) */}
        <div
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "24px",
          }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <img
              src={activeRepo.owner.avatar_url}
              alt={activeRepo.owner.login}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
              className="flex-shrink-0"
            />
            <h2 className="font-semibold text-base truncate flex items-center gap-1.5">
              <a
                href={activeRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredLink(true)}
                onMouseLeave={() => setHoveredLink(false)}
                style={{
                  color: hoveredLink ? "#5a9e6f" : "#e8ede8",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {activeRepo.full_name}
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </h2>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={() => setIsXHovered(true)}
            onMouseLeave={() => setIsXHovered(false)}
            style={{
              color: isXHovered ? "#e8ede8" : "#4a5c4a",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "color 0.15s",
              outline: "none",
              padding: "4px",
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* AI Assessment Section */}
          <div
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "20px 24px",
            }}
          >
            <div className="flex items-baseline justify-between mb-4">
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#4a5c4a",
                  letterSpacing: "0.06em",
                }}
                className="uppercase"
              >
                AI Assessment
              </span>
              {analysis ? (
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "#5a9e6f",
                  }}
                >
                  {analysis.relevanceScore}
                  <span
                    style={{
                      color: "#4a5c4a",
                      fontSize: "20px",
                    }}
                    className="font-normal"
                  >
                    /10
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "#4a5c4a",
                  }}
                >
                  –
                </div>
              )}
            </div>

            {analysis ? (
              <div className="space-y-4">
                <div>
                  <h4
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "#4a5c4a",
                      letterSpacing: "0.06em",
                      marginBottom: "8px",
                    }}
                    className="uppercase"
                  >
                    AI Summary
                  </h4>
                  <p
                    style={{
                      color: "#7a8f7a",
                      fontSize: "13px",
                      lineHeight: "1.6",
                    }}
                  >
                    {analysis.summary}
                  </p>
                </div>

                {analysis.productionReady && (
                  <div
                    style={{
                      backgroundColor: "rgba(90, 158, 111, 0.12)",
                      border: "1px solid rgba(90, 158, 111, 0.2)",
                      color: "#5a9e6f",
                      fontSize: "11px",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      display: "inline-block",
                    }}
                    className="font-medium"
                  >
                    Production Ready
                  </div>
                )}
              </div>
            ) : (
              <p
                style={{
                  color: "#4a5c4a",
                  fontSize: "13px",
                  fontStyle: "italic",
                }}
              >
                AI analysis is loading or could not be generated.
              </p>
            )}
          </div>

          {/* Description Section */}
          {activeRepo.description && (
            <div
              style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                padding: "20px 24px",
              }}
            >
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#4a5c4a",
                  letterSpacing: "0.06em",
                  marginBottom: "8px",
                }}
                className="uppercase"
              >
                Original Description
              </h4>
              <p
                style={{
                  color: "#7a8f7a",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  fontStyle: "italic",
                }}
              >
                {activeRepo.description}
              </p>
            </div>
          )}

          {/* Tech Stack Section */}
          {analysis && analysis.techStack && analysis.techStack.length > 0 && (
            <div
              style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                padding: "20px 24px",
              }}
            >
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#4a5c4a",
                  letterSpacing: "0.06em",
                  marginBottom: "8px",
                }}
                className="uppercase"
              >
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
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
              </div>
            </div>
          )}

          {/* Details Section */}
          <div
            style={{
              padding: "20px 24px",
            }}
            className="space-y-4"
          >
            <h4
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#4a5c4a",
                letterSpacing: "0.06em",
              }}
              className="uppercase"
            >
              Repository Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "6px",
                  padding: "12px",
                }}
                className="flex flex-col"
              >
                <span
                  style={{ color: "#4a5c4a", fontSize: "11px" }}
                  className="mb-1 flex items-center gap-1 font-medium"
                >
                  <Star className="w-3.5 h-3.5" /> Stars
                </span>
                <span
                  style={{ color: "#e8ede8", fontSize: "14px" }}
                  className="font-semibold"
                >
                  {stars}
                </span>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "6px",
                  padding: "12px",
                }}
                className="flex flex-col"
              >
                <span
                  style={{ color: "#4a5c4a", fontSize: "11px" }}
                  className="mb-1 flex items-center gap-1 font-medium"
                >
                  <GitFork className="w-3.5 h-3.5" /> Forks
                </span>
                <span
                  style={{ color: "#e8ede8", fontSize: "14px" }}
                  className="font-semibold"
                >
                  {forks}
                </span>
              </div>
              {activeRepo.language && (
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                  className="flex flex-col"
                >
                  <span
                    style={{ color: "#4a5c4a", fontSize: "11px" }}
                    className="mb-1 flex items-center gap-1 font-medium"
                  >
                    <Code className="w-3.5 h-3.5" /> Language
                  </span>
                  <span
                    style={{ color: "#e8ede8", fontSize: "14px" }}
                    className="font-semibold"
                  >
                    {activeRepo.language}
                  </span>
                </div>
              )}
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "6px",
                  padding: "12px",
                }}
                className="flex flex-col col-span-2"
              >
                <span
                  style={{ color: "#4a5c4a", fontSize: "11px" }}
                  className="mb-1 font-medium"
                >
                  Last Updated
                </span>
                <span
                  style={{ color: "#e8ede8", fontSize: "14px" }}
                  className="font-semibold"
                >
                  {updatedAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer button */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "24px",
            backgroundColor: "#0d130e",
          }}
        >
          <a
            href={activeRepo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            style={{
              width: "100%",
              backgroundColor: isBtnHovered ? "#6ab57f" : "#5a9e6f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background-color 0.15s",
              textDecoration: "none",
              display: "block",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </>
  );
}
