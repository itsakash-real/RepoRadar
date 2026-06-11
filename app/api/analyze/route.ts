import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { repos, query } = await req.json();

    if (!repos || !Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json({ error: "No repos provided" }, { status: 400 });
    }

    const repoSummaries = repos.map((r: any) => ({
      id: r.id,
      name: r.full_name,
      description: r.description ?? "No description",
      language: r.language ?? "unknown",
      stars: r.stargazers_count,
      topics: r.topics.slice(0, 8).join(", ") || "none",
    }));

    const prompt = `You are a senior software engineer evaluating GitHub repositories.
The user searched for: "${query}"

Analyze each repository below and return a JSON array (no markdown, no extra text — raw JSON only).
Each item must have exactly these fields:
- repoId: number (the id field)
- relevanceScore: number 1-10 (how well it matches the search query)
- techStack: string[] (inferred from language + topics, max 5 items)
- summary: string (1 sentence: what this repo does and why it matches the query)
- productionReady: boolean (does it look like a real, usable project vs a tutorial?)

Repos to analyze:
${JSON.stringify(repoSummaries, null, 2)}

Return ONLY the JSON array, no explanations.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    const cleaned = raw.replace(/```json|```/g, "").trim();

    let analyses;
    try {
      analyses = JSON.parse(cleaned);
    } catch {
      analyses = [];
    }

    return NextResponse.json({ analyses });
  } catch (err) {
    console.error("Groq analyze error:", err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
