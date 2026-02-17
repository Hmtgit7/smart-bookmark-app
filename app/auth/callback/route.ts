import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const error = requestUrl.searchParams.get("error");
    const error_description = requestUrl.searchParams.get("error_description");
    const origin = requestUrl.origin;

    // Handle OAuth errors
    if (error) {
        console.error("OAuth error:", error, error_description);
        return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent(error_description || "Authentication failed")}`
        );
    }

    if (code) {
        const supabase = await createClient();

        try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
                console.error("Session exchange error:", exchangeError);
                return NextResponse.redirect(`${origin}/login?error=Authentication failed`);
            }

            if (data.session) {
                console.log("✅ User authenticated:", data.user?.email);
                return NextResponse.redirect(`${origin}/dashboard`);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            return NextResponse.redirect(`${origin}/login?error=Authentication failed`);
        }
    }

    // No code and no error - redirect to login
    return NextResponse.redirect(`${origin}/login`);
}
