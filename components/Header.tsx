"use client";

import { UserButton, SignInButton } from "@clerk/nextjs";
import { CreditBadge } from "./CreditBadge";
import { CreditState } from "@/lib/types";

export function Header({ credits }: { credits: CreditState }) {
  return (
    <header className="border-b border-[#262626] px-4 py-3 flex items-center justify-between max-w-4xl mx-auto">
      <span className="font-semibold text-sm tracking-[4px] uppercase text-white font-mono">
        reporadar
      </span>
      <div className="flex items-center gap-3">
        <CreditBadge credits={credits} />
        {credits.isLoggedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton mode="modal">
            <button className="text-xs tracking-[2px] uppercase text-[#999999] hover:text-white transition-colors font-mono">
              Sign in
            </button>
          </SignInButton>
        )}
      </div>
    </header>
  );
}
