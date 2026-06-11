"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { safeUseClerk, SafeSignInButton } from "@/hooks/safeClerk";
import { SearchBar } from "@/components/SearchBar";
import { RepoGrid } from "@/components/RepoGrid";
import { Header } from "@/components/Header";
import { useCredits } from "@/hooks/useCredits";
import { useRepoSearch } from "@/hooks/useRepoSearch";
import { SafeErrorBoundary } from "@/components/SafeErrorBoundary";
import { RepoDetailDrawer } from "@/components/RepoDetailDrawer";
import { EnrichedRepo } from "@/lib/types";

const SUGGESTIONS = [
  "full stack hotel management app",
  "React admin dashboard",
  "Node.js REST API boilerplate",
  "e-commerce Next.js",
  "AI chatbot Python",
  "mobile app React Native",
];

function SuggestionPill({ text, onClick }: { text: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: hovered ? "1px solid rgba(90,158,111,0.4)" : "1px solid rgba(255,255,255,0.08)",
        color: hovered ? "#5a9e6f" : "#7a8f7a",
        fontSize: "12px",
        padding: "5px 12px",
        borderRadius: "999px",
        cursor: "pointer",
        transition: "all 0.15s",
        outline: "none",
      }}
    >
      {text}
    </button>
  );
}

function AppContent() {
  const { credits, consumeCredit } = useCredits();
  const { search, status, results, totalCount, error, lastQuery } = useRepoSearch();
  const { openSignIn } = safeUseClerk();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<EnrichedRepo | null>(null);

  // Hover states for CTA buttons
  const [ctaPrimaryHovered, setCtaPrimaryHovered] = useState(false);
  const [ctaSecondaryHovered, setCtaSecondaryHovered] = useState(false);

  // Search input ref
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    if (!credits.canSearch) {
      setShowAuthPrompt(true);
      return;
    }

    consumeCredit();

    await search(query);

    if (!credits.isLoggedIn && credits.used + 1 >= credits.limit) {
      setShowAuthPrompt(true);
    }
  };

  useEffect(() => {
    if (showAuthPrompt && openSignIn) {
      openSignIn({
        appearance: {
          elements: {
            rootBox: "mx-auto",
          },
        },
      });
      setShowAuthPrompt(false);
    }
  }, [showAuthPrompt, openSignIn]);

  return (
    <div style={{ backgroundColor: "#0b0f0b" }} className="min-h-screen flex flex-col relative overflow-x-hidden">
      <SafeErrorBoundary fallback={
        <header
          style={{
            background: "rgba(11, 15, 11, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
          className="w-full"
        >
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <span style={{ color: "#e8ede8", fontWeight: 600, fontSize: "16px" }} className="select-none">
              RepoRadar
            </span>
            <span style={{ color: "#7a8f7a", fontSize: "12px" }}>
              Auth unavailable
            </span>
          </div>
        </header>
      }>
        <Header credits={credits} />
      </SafeErrorBoundary>

      <main className="w-full flex-1 relative z-10">
        {/* Core Search & Results area */}
        <div className="max-w-4xl w-full mx-auto px-4 py-12">
          {/* Hero Section */}
          {status === "idle" && (
            <div className="relative mb-10 text-center flex flex-col items-center">
              {/* hero ambient glow */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -60%)",
                  width: "600px",
                  height: "400px",
                  background: "radial-gradient(ellipse, rgba(60, 120, 70, 0.18) 0%, transparent 70%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              
              <div className="relative z-10 flex flex-col items-center">
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "rgba(90, 158, 111, 0.12)",
                    border: "1px solid rgba(90, 158, 111, 0.25)",
                    color: "#5a9e6f",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  AI-powered
                </span>
                <h1
                  style={{
                    fontSize: "52px",
                    fontWeight: 700,
                    color: "#e8ede8",
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Find the best GitHub repos
                </h1>
                <p
                  style={{
                    color: "#7a8f7a",
                    fontSize: "17px",
                    maxWidth: "480px",
                    lineHeight: 1.6,
                    marginTop: "12px",
                  }}
                >
                  From simple apps to complex platforms, just describe what you want to build. AI scans thousands of open-source repositories and delivers the most relevant projects, ranked by quality, popularity, and relevance.
                </p>
              </div>
            </div>
          )}

          <div ref={searchRef} className="relative z-10">
            <SearchBar
              onSearch={handleSearch}
              isLoading={status === "searching" || status === "analyzing"}
              disabled={!credits.canSearch && credits.used >= credits.limit}
              status={status}
            />
          </div>

          {/* Popular Searches suggestion pills (Section 1) */}
          {status === "idle" && (
            <div className="mt-6 text-center relative z-10">
              <h3
                style={{
                  color: "#4a5c4a",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "10px",
                }}
                className="font-semibold"
              >
                Try searching for
              </h3>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {SUGGESTIONS.map((text) => (
                  <SuggestionPill
                    key={text}
                    text={text}
                    onClick={() => handleSearch(text)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Credit Exhausted Banner */}
          {!credits.canSearch && !credits.isLoggedIn && (
            <div
              style={{
                backgroundColor: "rgba(90, 158, 111, 0.08)",
                border: "1px solid rgba(90, 158, 111, 0.20)",
                color: "#7a8f7a",
                borderRadius: "10px",
                padding: "14px",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "16px",
              }}
              className="relative z-10"
            >
              You've used your 5 free searches.{" "}
              <button
                style={{
                  color: "#5a9e6f",
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "underline",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  fontSize: "13px",
                }}
                onClick={() => setShowAuthPrompt(true)}
              >
                Sign in for 50 searches/day — free.
              </button>
            </div>
          )}

          {error && (
            <p
              style={{
                color: "#c47a7a",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "16px",
              }}
              className="relative z-10 font-medium"
            >
              {error}
            </p>
          )}

          {/* Results Area with smaller radial glow */}
          {(status !== "idle" || results.length > 0) && (
            <div className="relative mt-6">
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  height: "500px",
                  background: "radial-gradient(ellipse at 50% 0%, rgba(60, 120, 70, 0.10) 0%, transparent 60%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <RepoGrid
                  results={results}
                  status={status}
                  totalCount={totalCount}
                  query={lastQuery}
                  onSelect={setSelectedRepo}
                />
              </div>
            </div>
          )}
        </div>

        {/* Landing content (Sections 2–6) - Visible only on Idle */}
        {status === "idle" && (
          <div className="w-full">
            {/* SECTION 2 — How it works */}
            <div className="relative w-full" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
              {/* Glow */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "600px",
                  height: "400px",
                  background: "radial-gradient(ellipse, rgba(60, 120, 70, 0.15) 0%, transparent 65%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div className="max-w-[1024px] mx-auto px-4 relative z-10 flex flex-col items-center">
                <span
                  style={{
                    backgroundColor: "rgba(90, 158, 111, 0.10)",
                    border: "1px solid rgba(90, 158, 111, 0.20)",
                    color: "#5a9e6f",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  How it works
                </span>
                <h2
                  style={{
                    fontSize: "38px",
                    fontWeight: 700,
                    color: "#e8ede8",
                    textAlign: "center",
                    marginBottom: "48px",
                  }}
                >
                  From query to code in seconds
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {/* Card 1 */}
                  <div
                    style={{
                      backgroundColor: "#111812",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "24px",
                    }}
                    className="md:border-r md:border-dashed md:border-white/[0.15]"
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(90, 158, 111, 0.10)",
                        border: "1px solid rgba(90, 158, 111, 0.20)",
                        borderRadius: "8px",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#5a9e6f",
                        marginBottom: "16px",
                      }}
                    >
                      01
                    </div>
                    <h3 style={{ color: "#e8ede8", fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
                      Describe what you need
                    </h3>
                    <p style={{ color: "#7a8f7a", fontSize: "13px", lineHeight: 1.6 }}>
                      Type anything — a project idea, a tech stack, a problem you're solving. No special syntax needed.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div
                    style={{
                      backgroundColor: "#111812",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "24px",
                    }}
                    className="md:border-r md:border-dashed md:border-white/[0.15]"
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(90, 158, 111, 0.10)",
                        border: "1px solid rgba(90, 158, 111, 0.20)",
                        borderRadius: "8px",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#5a9e6f",
                        marginBottom: "16px",
                      }}
                    >
                      02
                    </div>
                    <h3 style={{ color: "#e8ede8", fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
                      GitHub scans instantly
                    </h3>
                    <p style={{ color: "#7a8f7a", fontSize: "13px", lineHeight: 1.6 }}>
                      We search across millions of GitHub repositories in real time, pulling the top results by stars and relevance.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div
                    style={{
                      backgroundColor: "#111812",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "24px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(90, 158, 111, 0.10)",
                        border: "1px solid rgba(90, 158, 111, 0.20)",
                        borderRadius: "8px",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#5a9e6f",
                        marginBottom: "16px",
                      }}
                    >
                      03
                    </div>
                    <h3 style={{ color: "#e8ede8", fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
                      AI ranks and explains
                    </h3>
                    <p style={{ color: "#7a8f7a", fontSize: "13px", lineHeight: 1.6 }}>
                      Groq AI reads every repo's description, topics, and stack — then scores and summarizes exactly why each one fits your query.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3 — Features */}
            <div className="w-full" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
              <div className="max-w-[1024px] mx-auto px-4 flex flex-col items-center">
                <span
                  style={{
                    backgroundColor: "rgba(90, 158, 111, 0.10)",
                    border: "1px solid rgba(90, 158, 111, 0.20)",
                    color: "#5a9e6f",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  What you get
                </span>
                <h2
                  style={{
                    fontSize: "38px",
                    fontWeight: 700,
                    color: "#e8ede8",
                    textAlign: "center",
                    marginBottom: "48px",
                  }}
                >
                  Everything a developer needs
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {/* Tile 1 */}
                  <div
                    style={{
                      backgroundColor: "#111812",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "24px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(90, 158, 111, 0.10)",
                        border: "1px solid rgba(90, 158, 111, 0.15)",
                        borderRadius: "8px",
                        fontSize: "16px",
                      }}
                    >
                      🎯
                    </div>
                    <h3 style={{ color: "#e8ede8", fontSize: "14px", fontWeight: 600, marginTop: "14px", marginBottom: "6px" }}>
                      AI relevance scoring
                    </h3>
                    <p style={{ color: "#7a8f7a", fontSize: "13px", lineHeight: 1.6 }}>
                      Every result gets a 1–10 score explaining exactly how well it matches your query — not just keyword ranking.
                    </p>
                  </div>

                  {/* Tile 2 */}
                  <div
                    style={{
                      backgroundColor: "#111812",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "24px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(90, 158, 111, 0.10)",
                        border: "1px solid rgba(90, 158, 111, 0.15)",
                        borderRadius: "8px",
                        fontSize: "16px",
                      }}
                    >
                      🔍
                    </div>
                    <h3 style={{ color: "#e8ede8", fontSize: "14px", fontWeight: 600, marginTop: "14px", marginBottom: "6px" }}>
                      Tech stack detection
                    </h3>
                    <p style={{ color: "#7a8f7a", fontSize: "13px", lineHeight: 1.6 }}>
                      AI identifies the real stack from repos — React, FastAPI, Supabase — so you know what you're getting before you click.
                    </p>
                  </div>

                  {/* Tile 3 */}
                  <div
                    style={{
                      backgroundColor: "#111812",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "24px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(90, 158, 111, 0.10)",
                        border: "1px solid rgba(90, 158, 111, 0.15)",
                        borderRadius: "8px",
                        fontSize: "16px",
                      }}
                    >
                      🚀
                    </div>
                    <h3 style={{ color: "#e8ede8", fontSize: "14px", fontWeight: 600, marginTop: "14px", marginBottom: "6px" }}>
                      Production-ready flag
                    </h3>
                    <p style={{ color: "#7a8f7a", fontSize: "13px", lineHeight: 1.6 }}>
                      We filter out tutorials and toy projects. If a repo looks like something you could actually ship, we mark it.
                    </p>
                  </div>

                  {/* Tile 4 */}
                  <div
                    style={{
                      backgroundColor: "#111812",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "24px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(90, 158, 111, 0.10)",
                        border: "1px solid rgba(90, 158, 111, 0.15)",
                        borderRadius: "8px",
                        fontSize: "16px",
                      }}
                    >
                      ⚡
                    </div>
                    <h3 style={{ color: "#e8ede8", fontSize: "14px", fontWeight: 600, marginTop: "14px", marginBottom: "6px" }}>
                      Real-time GitHub data
                    </h3>
                    <p style={{ color: "#7a8f7a", fontSize: "13px", lineHeight: 1.6 }}>
                      Results are fetched live from GitHub every time — always up to date, always sorted by stars.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4 — Stats bar */}
            <div
              style={{
                backgroundColor: "#111812",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                padding: "32px 0",
              }}
              className="w-full"
            >
              <div className="max-w-[1024px] mx-auto px-4 grid grid-cols-3 items-center text-center">
                {/* Stat 1 */}
                <div>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: "#e8ede8" }}>40M+</div>
                  <div style={{ fontSize: "12px", color: "#7a8f7a", marginTop: "4px" }}>
                    GitHub repositories searched
                  </div>
                </div>

                {/* Stat 2 */}
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: "#e8ede8" }}>&lt; 3s</div>
                  <div style={{ fontSize: "12px", color: "#7a8f7a", marginTop: "4px" }}>
                    Average time to ranked results
                  </div>
                </div>

                {/* Stat 3 */}
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: "#e8ede8" }}>Free</div>
                  <div style={{ fontSize: "12px", color: "#7a8f7a", marginTop: "4px" }}>
                    No account needed for 5 searches
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5 — CTA banner */}
            <div className="relative w-full" style={{ padding: "80px 0" }}>
              {/* Glow */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "600px",
                  height: "400px",
                  background: "radial-gradient(ellipse, rgba(60, 120, 70, 0.15) 0%, transparent 65%)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div className="max-w-[1024px] mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                <h2 style={{ fontSize: "34px", fontWeight: 700, color: "#e8ede8" }}>
                  Start finding better repos today
                </h2>
                <p style={{ color: "#7a8f7a", fontSize: "15px", marginTop: "8px", marginBottom: "32px" }}>
                  5 free searches — no account needed. Sign in to unlock 50/day.
                </p>

                <div className="flex gap-4 justify-center">
                  <button
                    onMouseEnter={() => setCtaPrimaryHovered(true)}
                    onMouseLeave={() => setCtaPrimaryHovered(false)}
                    onClick={() => searchRef.current?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                      backgroundColor: ctaPrimaryHovered ? "#6ab57f" : "#5a9e6f",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                      outline: "none",
                    }}
                  >
                    Search now →
                  </button>

                  <SafeSignInButton mode="modal">
                    <button
                      onMouseEnter={() => setCtaSecondaryHovered(true)}
                      onMouseLeave={() => setCtaSecondaryHovered(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: ctaSecondaryHovered ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(255,255,255,0.10)",
                        color: ctaSecondaryHovered ? "#e8ede8" : "#7a8f7a",
                        borderRadius: "8px",
                        padding: "10px 24px",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        outline: "none",
                      }}
                    >
                      Sign in for more
                    </button>
                  </SafeSignInButton>
                </div>
              </div>
            </div>

            {/* SECTION 6 — Footer */}
            <footer
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                padding: "24px 0",
                marginTop: "40px",
              }}
              className="w-full"
            >
              <div className="max-w-[1024px] mx-auto px-4 flex justify-between items-center">
                <span style={{ color: "#4a5c4a", fontSize: "13px", fontWeight: 500 }}>
                  RepoRadar
                </span>
                <span style={{ color: "#4a5c4a", fontSize: "12px" }}>
                  Built with GitHub API + Groq AI
                </span>
              </div>
            </footer>
          </div>
        )}
      </main>

      {/* Repo Detail Drawer */}
      <RepoDetailDrawer repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </div>
  );
}

export default function HomePage() {
  return (
    <SafeErrorBoundary fallback={
      <div style={{ backgroundColor: "#0b0f0b" }} className="min-h-screen flex flex-col">
        <header style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", padding: "12px 16px" }}>
          <span style={{ color: "#e8ede8", fontWeight: 600, fontSize: "16px" }} className="select-none">
            RepoRadar
          </span>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12 text-center flex flex-col items-center">
          <span
            style={{
              display: "inline-block",
              backgroundColor: "rgba(90, 158, 111, 0.12)",
              border: "1px solid rgba(90, 158, 111, 0.25)",
              color: "#5a9e6f",
              fontSize: "11px",
              fontWeight: 500,
              padding: "3px 10px",
              borderRadius: "999px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            AI-powered
          </span>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "#e8ede8",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Find the best GitHub repos
          </h1>
          <p
            style={{
              color: "#7a8f7a",
              fontSize: "17px",
              maxWidth: "480px",
              lineHeight: 1.6,
              marginTop: "12px",
              marginBottom: "32px",
            }}
          >
            From simple apps to complex platforms, just describe what you want to build. AI scans thousands of open-source repositories and delivers the most relevant projects, ranked by quality, popularity, and relevance.
          </p>
          <div
            style={{
              backgroundColor: "rgba(90, 158, 111, 0.08)",
              border: "1px solid rgba(90, 158, 111, 0.20)",
              color: "#7a8f7a",
              borderRadius: "10px",
              padding: "24px",
              fontSize: "13px",
              maxWidth: "400px",
            }}
          >
            Set your Clerk publishable key in <code style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "2px 4px", borderRadius: "4px" }}>.env</code> to enable authentication.
            Add GitHub and Groq API keys to enable search and AI analysis.
          </div>
        </main>
      </div>
    }>
      <AppContent />
    </SafeErrorBoundary>
  );
}
