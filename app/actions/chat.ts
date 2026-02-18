"use server";

import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

export async function sendChatMessage(message: string) {
    try {
        if (!process.env.GROQ_API_KEY) {
            return { error: "Groq API key is not configured." };
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Unauthorized" };
        }

        // Fetch user's bookmarks
        const { data: bookmarks, error: fetchError } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (fetchError) {
            return { error: "Failed to fetch bookmarks" };
        }

        if (!bookmarks || bookmarks.length === 0) {
            return {
                response: "You don't have any bookmarks yet. Start adding some to use the AI assistant! 📚"
            };
        }

        // Create context from bookmarks
        const bookmarksContext = bookmarks.map((b, i) => {
            const parts = [
                `${i + 1}. "${b.title}"`,
                `URL: ${b.url}`,
                `Category: ${b.category}`,
            ];

            if (b.description) {
                parts.push(`Description: ${b.description}`);
            }

            parts.push(`Added: ${new Date(b.created_at).toLocaleDateString()}`);

            return parts.join(' | ');
        }).join("\n");

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
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 500,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        return { response: responseText };
    } catch (error: any) {
        if (error?.status === 429) {
            return { error: "Rate limit reached. Please wait a moment and try again." };
        }
        return { error: error?.message || "Failed to process your request." };
    }
}

