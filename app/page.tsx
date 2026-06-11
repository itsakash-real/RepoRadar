"use client";

import { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { SearchBar } from "@/components/SearchBar";
import { RepoGrid } from "@/components/RepoGrid";
import { Header } from "@/components/Header";
import { useCredits } from "@/hooks/useCredits";
import { useRepoSearch } from "@/hooks/useRepoSearch";
import { SafeErrorBoundary } from "@/components/SafeErrorBoundary";

function AppContent() {
  const { credits, consumeCredit } = useCredits();
  const { search, status, results, totalCount, error, lastQuery } = useRepoSearch();
  const { openSignIn } = useClerk();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

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
    <div className="min-h-screen bg-[#000000]">
      <SafeErrorBoundary fallback={
        <header className="border-b border-[#262626] px-4 py-3 flex items-center justify-between max-w-4xl mx-auto">
          <span className="font-semibold text-sm tracking-[4px] uppercase text-white font-mono">
            reporadar
          </span>
          <span className="text-xs tracking-[2px] uppercase text-[#999999] font-mono">
            Auth unavailable
          </span>
        </header>
      }>
        <Header credits={credits} />
      </SafeErrorBoundary>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {status === "idle" && (
          <div className="text-center mb-10">
            <h1 className="text-4xl font-semibold tracking-[2px] mb-3 text-white uppercase">
              Find the best GitHub repos
            </h1>
            <p className="text-[#999999] text-lg max-w-xl mx-auto">
              Type anything — "hotel management app", "React dashboard with auth" —
              and AI will find and rank the top open-source repos for you.
            </p>
          </div>
        )}

        <SearchBar
          onSearch={handleSearch}
          isLoading={status === "searching" || status === "analyzing"}
          disabled={!credits.canSearch && credits.used >= credits.limit}
          status={status}
        />

        {!credits.canSearch && !credits.isLoggedIn && (
          <div className="mt-4 p-4 border border-[#d4a017]/30 bg-[#d4a017]/10 text-[#d4a017] text-sm text-center">
            You've used your 5 free searches.{" "}
            <button
              className="underline font-medium"
              onClick={() => setShowAuthPrompt(true)}
            >
              Sign in for 50 searches/day — free.
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-[#d4a017] text-sm text-center">{error}</p>
        )}

        {(status !== "idle" || results.length > 0) && (
          <RepoGrid
            results={results}
            status={status}
            totalCount={totalCount}
            query={lastQuery}
          />
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <SafeErrorBoundary fallback={
      <div className="min-h-screen bg-[#000000] flex flex-col">
        <header className="border-b border-[#262626] px-4 py-3">
          <span className="font-semibold text-sm tracking-[4px] uppercase text-white font-mono">
            reporadar
          </span>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-semibold tracking-[2px] mb-3 text-white uppercase">
            Find the best GitHub repos
          </h1>
          <p className="text-[#999999] text-lg max-w-xl mx-auto mb-8">
            Type anything — "hotel management app", "React dashboard with auth" —
            and AI will find and rank the top open-source repos for you.
          </p>
          <div className="p-6 border border-[#d4a017]/30 bg-[#d4a017]/10 text-[#d4a017] text-sm max-w-md mx-auto">
            Set your Clerk publishable key in <code className="bg-[#1f1f1f] px-1">.env.local</code> to enable authentication.
            Add GitHub and Groq API keys to enable search and AI analysis.
          </div>
        </main>
      </div>
    }>
      <AppContent />
    </SafeErrorBoundary>
  );
}
