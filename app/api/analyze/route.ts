import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const getGroqClient = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.trim() === "" || key.includes("placeholder")) return null;
  try {
    return new Groq({ apiKey: key });
  } catch {
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const { repos, query } = await req.json();

    if (!repos || !Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json({ analyses: [] });
    }

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json({ analyses: [] });
    }

    const repoSummaries = repos.map((r: any) => ({
      id: r.id,
      name: r.full_name ?? "unknown/unknown",
      description: r.description ?? "No description",
      language: r.language ?? "unknown",
      stars: r.stargazers_count ?? 0,
      topics: (Array.isArray(r.topics) ? r.topics : []).slice(0, 8).join(", ") || "none",
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

CRITICAL: Your entire response must be ONLY a valid JSON array.
Start with [ and end with ]. No markdown, no backticks, no explanation.`;

    let analyses = [];
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 2000,
      });

      const raw = completion.choices[0]?.message?.content ?? "[]";
      console.log("Raw Groq response:", raw);
      
      const cleaned = raw.replace(/```json|```/g, "").trim();
      try {
        analyses = JSON.parse(cleaned);
      } catch (parseErr) {
        console.error("JSON parse failed. Error:", parseErr, "Raw string was:", raw);
        return NextResponse.json({ analyses: [] });
      }
    } catch (err) {
      console.error("Groq call failed, returning empty analyses:", err);
      return NextResponse.json({ analyses: [] });
    }

    return NextResponse.json({ analyses });
  } catch (err) {
    console.error("Groq analyze route error:", err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
