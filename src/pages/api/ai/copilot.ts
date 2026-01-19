import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const {
    apiKey,
    model = "gemini-2.5-flash",
    prompt,
    system,
  } = await request.json();

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing Google API key." }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const google = createGoogleGenerativeAI({
      apiKey,
    });

    const result = await generateText({
      abortSignal: request.signal,
      maxOutputTokens: 50,
      model: google(model) as any,
      prompt,
      system,
      temperature: 0.7,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return new Response(null, { status: 408 });
    }

    return new Response(
      JSON.stringify({ error: "Failed to process AI request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
