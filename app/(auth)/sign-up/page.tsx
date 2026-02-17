// // app/(auth)/signup/page.tsx
// import { Suspense } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Bookmark, ArrowLeft, Loader2 } from "lucide-react";
// import { signUpAction, signInWithGoogleAction } from "@/app/actions/auth";
// import { GoogleIcon } from "@/components/icons/GoogleIcon";
// import { Separator } from "@/components/ui/separator";

// function SignupForm() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Back to Home */}
//         <Button variant="ghost" asChild className="mb-4 sm:mb-6">
//           <Link href="/">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Home
//           </Link>
//         </Button>

//         {/* Logo */}
//         <div className="flex items-center justify-center space-x-2 mb-6 sm:mb-8">
//           <Bookmark className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
//           <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
//             Smart Bookmarks
//           </span>
//         </div>

//         <Card className="border-2">
//           <CardHeader className="space-y-1 p-4 sm:p-6">
//             <CardTitle className="text-xl sm:text-2xl font-bold text-center">Create an account</CardTitle>
//             <CardDescription className="text-center text-sm sm:text-base">
//               Get started with Smart Bookmarks today
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="p-4 sm:p-6 pt-0">
//             {/* Google OAuth Button */}
//             <form action={signInWithGoogleAction} className="mb-4">
//               <Button
//                 type="submit"
//                 variant="outline"
//                 className="w-full h-11 sm:h-12"
//                 size="lg"
//               >
//                 <GoogleIcon className="mr-2 h-5 w-5" />
//                 Continue with Google
//               </Button>
//             </form>

//             <div className="relative my-4">
//               <Separator />
//               <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
//                 OR
//               </span>
//             </div>

//             {/* Email/Password Signup */}
//             <form action={signUpAction} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   required
//                   className="h-10 sm:h-11"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   placeholder="••••••••"
//                   required
//                   minLength={6}
//                   className="h-10 sm:h-11"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Must be at least 6 characters
//                 </p>
//               </div>
//               <Button type="submit" className="w-full h-10 sm:h-11" size="lg">
//                 Create Account
//               </Button>
//             </form>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4 p-4 sm:p-6 pt-0">
//             <div className="text-xs sm:text-sm text-center text-muted-foreground">
//               Already have an account?{" "}
//               <Link href="/login" className="text-primary font-semibold hover:underline">
//                 Sign in
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>

//         <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
//           By continuing, you agree to our Terms of Service and Privacy Policy
//         </p>
//       </div>
//     </div>
//   );
// }

// function SignupLoading() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
//       <Loader2 className="h-8 w-8 animate-spin text-primary" />
//     </div>
//   );
// }

// export default function SignupPage() {
//   return (
//     <Suspense fallback={<SignupLoading />}>
//       <SignupForm />
//     </Suspense>
//   );
// }

// app/(auth)/signup/page.tsx
import { redirect } from "next/navigation";

export default function SignupPage() {
  redirect("/login");
}
