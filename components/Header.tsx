"use client";

import { SafeUserButton, SafeSignInButton } from "@/hooks/safeClerk";
import { CreditBadge } from "./CreditBadge";
import { CreditState } from "@/lib/types";
import { useState } from "react";

export function Header({ credits }: { credits: CreditState }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
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
        <span
          style={{
            color: "#e8ede8",
            fontWeight: 600,
            fontSize: "16px",
            letterSpacing: "-0.01em",
          }}
          className="select-none"
        >
          RepoRadar
        </span>
        <div className="flex items-center gap-3">
          <CreditBadge credits={credits} />
          {credits.isLoggedIn ? (
            <SafeUserButton afterSignOutUrl="/" />
          ) : (
            <SafeSignInButton mode="modal">
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  color: isHovered ? "#e8ede8" : "#7a8f7a",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  transition: "color 0.15s",
                  padding: 0,
                  outline: "none",
                }}
              >
                Sign in
              </button>
            </SafeSignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
