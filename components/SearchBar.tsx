"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  onSearch: (query: string) => void;
  isLoading: boolean;
  disabled: boolean;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  searching: "Searching GitHub...",
  analyzing: "AI is analyzing repos...",
};

export function SearchBar({ onSearch, isLoading, disabled, status }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading && !disabled) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="full stack hotel management app..."
        disabled={isLoading || disabled}
        className="flex-1 h-11"
      />
      <Button
        type="submit"
        disabled={isLoading || disabled || query.trim().length < 2}
        className="h-11 px-6"
      >
        {isLoading ? STATUS_LABELS[status] ?? "Loading..." : "Search"}
      </Button>
    </form>
  );
}
