"use client";

import { CreditState } from "@/lib/types";

export function CreditBadge({ credits }: { credits: CreditState }) {
  const remaining = credits.limit - credits.used;
  const isLow = remaining <= 1 && !credits.isLoggedIn;

  const badgeStyle = isLow
    ? {
        backgroundColor: "rgba(180, 60, 60, 0.10)",
        border: "1px solid rgba(180, 60, 60, 0.20)",
        color: "#c47a7a",
        fontSize: "11px",
        padding: "3px 10px",
        borderRadius: "6px",
        display: "inline-block",
      }
    : {
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        color: "#7a8f7a",
        fontSize: "11px",
        padding: "3px 10px",
        borderRadius: "6px",
        display: "inline-block",
      };

  return (
    <span style={badgeStyle} className="font-medium select-none">
      {credits.isLoggedIn
        ? `${remaining} searches today`
        : `${remaining} free ${remaining === 1 ? "search" : "searches"} left`}
    </span>
  );
}
