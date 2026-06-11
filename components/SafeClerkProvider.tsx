"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";
import React from "react";

function hasValidClerkKey(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!pk || !pk.startsWith("pk_")) return false;
  if (pk.includes("placeholder")) return false;
  if (pk.length < 30) return false;
  return true;
}

export function SafeClerkProvider({ children }: { children: React.ReactNode }) {
  if (!hasValidClerkKey()) {
    return <>{children}</>;
  }

  return (
    <ClerkProviderBase publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
      {children}
    </ClerkProviderBase>
  );
}
