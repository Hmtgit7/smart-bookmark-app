"use server";

// import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";

// export async function signInWithGoogleAction() {
//     const supabase = await createClient();

//     // Get the origin from environment or use localhost
//     const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

//     const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//             redirectTo: `${origin}/auth/callback`,
//             queryParams: {
//                 access_type: "offline",
//                 prompt: "select_account", // Changed from "consent" to allow account selection
//             },
//         },
//     });

//     if (error) {
//         console.error("Google OAuth error:", error);
//         redirect("/login?error=Could not authenticate with Google");
//     }

//     if (data.url) {
//         redirect(data.url);
//     }
// }

// export async function signUpAction(formData: FormData) {
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     const supabase = await createClient();

//     const { error } = await supabase.auth.signUp({
//         email,
//         password,
//     });

//     if (error) {
//         console.error("Sign up error:", error);
//         redirect("/signup?error=Could not create account");
//     }

//     redirect("/dashboard");
// }

// export async function signInAction(formData: FormData) {
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     const supabase = await createClient();

//     const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//     });

//     if (error) {
//         console.error("Sign in error:", error);
//         redirect("/login?error=Invalid credentials");
//     }

//     redirect("/dashboard");
// }

// export async function signOutAction() {
//     const supabase = await createClient();
//     await supabase.auth.signOut();
//     redirect("/");
// }

"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogleAction() {
    const supabase = await createClient();

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
                access_type: "offline",
                prompt: "select_account",
            },
        },
    });

    if (error) {
        console.error("Google OAuth error:", error);
        redirect("/login?error=Could not authenticate with Google");
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signOutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}
