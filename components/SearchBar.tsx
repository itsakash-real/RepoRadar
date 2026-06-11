"use client";

import { useState, FormEvent } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  isLoading: boolean;
  disabled: boolean;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  searching: "Searching...",
  analyzing: "Analyzing...",
};

export function SearchBar({ onSearch, isLoading, disabled, status }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading && !disabled) {
      onSearch(query.trim());
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "8px 20px",
      fontSize: "13px",
      fontWeight: 500,
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      transition: "background-color 0.15s",
      outline: "none",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    };

    if (isLoading) {
      return {
        ...baseStyle,
        backgroundColor: "#3d7050",
      };
    }

    return {
      ...baseStyle,
      backgroundColor: isHovered ? "#6ab57f" : "#5a9e6f",
      opacity: disabled ? 0.5 : 1,
    };
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#111812",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "6px",
        display: "flex",
        gap: "6px",
        width: "100%",
        alignItems: "center",
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="full stack hotel management app..."
        disabled={isLoading || disabled}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#e8ede8",
          fontSize: "14px",
          padding: "8px 12px",
          flex: 1,
        }}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || query.trim().length < 2}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={getButtonStyle()}
      >
        {isLoading && (
          <span
            className="animate-spin w-3 h-3 border border-white/30 border-t-white rounded-full inline-block"
            style={{ borderWidth: "1px" }}
          />
        )}
        <span>{isLoading ? STATUS_LABELS[status] ?? "Loading..." : "Search"}</span>
      </button>
    </form>
  );
}
