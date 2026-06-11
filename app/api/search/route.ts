import { NextRequest, NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com/search/repositories";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim() !== "" && !token.includes("placeholder")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const url = `${GITHUB_API}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`;
    const res = await fetch(url, { headers, next: { revalidate: 60 } });

    const rateRemaining = res.headers.get("x-ratelimit-remaining");
    if (rateRemaining === "0") {
      return NextResponse.json(
        { error: "GitHub rate limit hit. Add a GITHUB_TOKEN env var for higher limits." },
        { status: 429 }
      );
    }

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `GitHub API error: ${text}` }, { status: res.status });
    }

    const data = await res.json();

    const repos = (data.items ?? []).map((r: any) => ({
      id: r.id,
      full_name: r.full_name,
      html_url: r.html_url,
      description: r.description,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language,
      topics: r.topics ?? [],
      updated_at: r.updated_at,
      owner: {
        login: r.owner.login,
        avatar_url: r.owner.avatar_url,
      },
    }));

    return NextResponse.json({
      repos,
      total_count: data.total_count,
      query,
    });
  } catch (err) {
    console.error("GitHub search error:", err);
    return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: 500 });
  }
}
