import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SafeClerkProvider } from "@/components/SafeClerkProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepoRadar — AI GitHub Repo Finder",
  description: "Find the best open-source repos for any project, ranked by AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SafeClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </SafeClerkProvider>
  );
}
