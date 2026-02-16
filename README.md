# Smart Bookmark App

A modern, production-ready bookmark manager built with Next.js, TypeScript, Supabase, and Tailwind CSS. Features real-time sync, Google OAuth authentication, and a beautiful dark/light theme interface.

![Smart Bookmark App](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Smart+Bookmark+App)

## 🌟 Live Demo

[View Live Demo](https://your-deployment-url.vercel.app) _(Replace with your actual Vercel deployment URL)_

## ✨ Features

1. **Google OAuth Authentication** — Secure sign-in with Google using Supabase Auth
2. **Private Bookmarks** — Your bookmarks are private to you, enforced by Row Level Security (RLS)
3. **Real-time Updates** — Changes sync instantly across all devices without page refresh
4. **Add & Delete Bookmarks** — Easily manage your bookmark collection
5. **Light/Dark Theme** — Beautiful UI with seamless theme switching
6. **Responsive Design** — Works perfectly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Authentication:** Google OAuth via Supabase
- **State Management:** React Hooks
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Deployment:** Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A Google Cloud Console project for OAuth

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/smart-bookmark-app.git
cd smart-bookmark-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

Follow the [Supabase Setup Guide](#-supabase-setup) below to:
- Create a Supabase project
- Set up Google OAuth
- Run the database migration
- Enable Realtime

4. **Configure environment variables**

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 🔐 Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details and wait for it to be set up
4. Once ready, go to **Settings → API** to find your:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Step 2: Set Up Google OAuth

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth 2.0 Client ID**
   - Configure the OAuth consent screen if prompted
   - Set Application type to **Web application**
   - Add authorized redirect URIs:
     - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   - Save and copy the **Client ID** and **Client Secret**

2. **Configure in Supabase:**
   - In your Supabase dashboard, go to **Authentication → Providers**
   - Find **Google** and enable it
   - Paste your Google **Client ID** and **Client Secret**
   - Save changes

### Step 3: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the contents of `supabase/migrations/001_create_bookmarks.sql`
4. Paste and run the query

This will:
- Create the `bookmarks` table
- Set up Row Level Security policies
- Enable Realtime subscriptions
- Create performance indexes

### Step 4: Enable Realtime

1. Go to **Database → Replication** in your Supabase dashboard
2. Find the `bookmarks` table
3. Toggle Realtime to **ON**

### Step 5: Configure Redirect URLs

1. Go to **Authentication → URL Configuration**
2. Add your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-app.vercel.app/auth/callback` (production)

## 📁 Project Structure

```
smart-bookmark-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Main page (landing/dashboard)
│   │   ├── globals.css             # Global styles + Tailwind
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts        # Auth callback handler
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── providers/
│   │   │   └── theme-provider.tsx
│   │   ├── auth/
│   │   │   ├── login-button.tsx
│   │   │   └── user-menu.tsx
│   │   ├── bookmarks/
│   │   │   ├── bookmark-list.tsx
│   │   │   ├── bookmark-card.tsx
│   │   │   ├── add-bookmark-dialog.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── loading-skeleton.tsx
│   │   ├── layout/
│   │   │   └── navbar.tsx
│   │   ├── landing/
│   │   │   ├── hero-section.tsx
│   │   │   └── features-section.tsx
│   │   └── theme-toggle.tsx
│   ├── hooks/
│   │   ├── use-bookmarks.ts        # Bookmark CRUD + realtime
│   │   └── use-user.ts             # Auth state
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── middleware.ts       # Middleware helper
│   │   ├── utils.ts                # Utility functions
│   │   └── types.ts                # TypeScript types
│   └── middleware.ts               # Next.js middleware
├── supabase/
│   └── migrations/
│       └── 001_create_bookmarks.sql
├── .env.local.example
├── components.json
├── package.json
└── README.md
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and sign in

3. Click **New Project** and import your repository

4. Configure environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Deploy!

6. After deployment, update your Supabase redirect URLs with your Vercel domain:
   - `https://your-app.vercel.app/auth/callback`

## 🐛 Problems Faced & Solutions

### Problem 1: Tailwind CSS v4 Configuration
**Issue:** Next.js 16 uses Tailwind v4 which has a different configuration format (no `tailwind.config.ts`).

**Solution:** Configured Tailwind directly in `globals.css` using the new `@import` syntax and CSS variables for theming. This actually simplified the setup and worked seamlessly with shadcn/ui.

### Problem 2: Supabase Auth Session Management
**Issue:** User sessions were not persisting properly across page refreshes.

**Solution:** Implemented proper middleware using `@supabase/ssr` to refresh auth tokens on every request. Created separate client instances for browser and server contexts.

### Problem 3: Real-time Subscription Cleanup
**Issue:** Memory leaks from Realtime subscriptions not being properly cleaned up.

**Solution:** Used React's `useEffect` cleanup function to unsubscribe from Realtime channels when components unmount or userId changes.

### Problem 4: shadcn/ui Installation
**Issue:** Network request failed during automated shadcn initialization.

**Solution:** Manually created all necessary shadcn/ui components and configured them properly. This gave more control over the components used and reduced bundle size.

### Problem 5: URL Validation
**Issue:** Users could add invalid URLs causing errors.

**Solution:** Implemented URL validation using JavaScript's built-in `URL` constructor before saving bookmarks. Added user-friendly error messages via toast notifications.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

Made with ❤️ using Next.js and Supabase
