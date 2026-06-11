import type { Metadata } from "next";
import { Saira_Condensed, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const sairaCondensed = Saira_Condensed({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepoRadar — AI GitHub Repo Finder",
  description: "Find the best open-source repos for any project, ranked by AI.",
};

function hasValidClerkKey(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!pk || !pk.startsWith("pk_")) return false;
  if (pk.includes("placeholder")) return false;
  if (pk.length < 30) return false;
  return true;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const validKey = hasValidClerkKey();
  const publishableKey = validKey
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : "pk_test_ZHVtbXkta2V5LWZvci1kZXZlbG9wbWVudC1vbmx5";

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html
        lang="en"
        className={`${sairaCondensed.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
