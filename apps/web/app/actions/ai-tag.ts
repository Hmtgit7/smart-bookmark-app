'use server';

import Groq from 'groq-sdk';

export async function getAISuggestionsAction(url: string, title: string) {
    if (!process.env.GROQ_API_KEY) {
        return { error: 'Groq API key is not configured' };
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `Analyze this bookmark and return ONLY a valid JSON object (no markdown, no explanation):

URL: ${url}
Title: ${title}

Return this exact JSON format:
{
  "tags": ["tag1", "tag2", "tag3"],
  "category": "one of: Work, Personal, Learning, Shopping, Entertainment, News, Social Media, Development, Design, Other, Uncategorized",
  "description": "one concise sentence describing what this link is about"
}

Rules:
- tags: 2-5 lowercase single-word or hyphenated tags (e.g. react, machine-learning, tutorial)
- category: must be exactly one from the list above
- description: max 100 characters, plain text only`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 200,
        });

        const raw = completion.choices[0]?.message?.content || '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { error: 'Could not parse AI response' };

        const parsed = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
            category: parsed.category || 'Uncategorized',
            description: parsed.description || '',
        };
    } catch {
        return { error: 'AI suggestion failed. Please try again.' };
    }
}
