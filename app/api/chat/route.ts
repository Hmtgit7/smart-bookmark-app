import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key is not configured. Please add GROQ_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { message } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's bookmarks
    const { data: bookmarks, error: fetchError } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch bookmarks" },
        { status: 500 }
      );
    }

    if (!bookmarks || bookmarks.length === 0) {
      return NextResponse.json({
        response: "You don't have any bookmarks yet. Start adding some to use the AI assistant! 📚"
      });
    }

    // Create context from bookmarks
    const bookmarksContext = bookmarks.map((b, i) =>
      `${i + 1}. "${b.title}" - ${b.url} (Category: ${b.category}, Added: ${new Date(b.created_at).toLocaleDateString()})`
    ).join("\n");

    // Create system prompt
    const systemPrompt = `You are a helpful AI assistant that helps users find and manage their bookmarks.

Here are the user's bookmarks:
${bookmarksContext}

Instructions:
- If the user is asking about a specific bookmark, provide the title and URL
- If searching by time (e.g., "last month", "yesterday"), consider the creation dates carefully
- If searching by category, filter by the category field
- Be conversational and helpful
- If no bookmark matches, suggest similar ones or say you couldn't find it
- Keep responses concise and clear (3-5 sentences max)
- You can use emojis to make responses friendly
- Always provide the URL when mentioning a specific bookmark

Respond in a friendly, conversational tone.`;

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile", // Fast and smart
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("Chat API Error:", error);

    // Check for specific API errors
    if (error?.message?.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid Groq API key. Please check your .env.local file." },
        { status: 500 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
