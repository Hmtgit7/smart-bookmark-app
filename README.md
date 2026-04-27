# 🔖 Smart Bookmarks

A modern, AI-powered bookmark manager built with **Next.js 16** and **Supabase**. Organize, search, and chat with your favorite links using natural language.

🔗 **Live Demo:** [smart-bookmark-app-lilac-phi.vercel.app](https://smart-bookmark-app-lilac-phi.vercel.app)

---

## ✨ Features

### Core Features

- 🔐 **Google OAuth + Email Password Authentication** — Sign in with Google or a password
- ⚙️ **Account Settings** — Set a password or permanently delete your account
- ⚡ **Real-time Sync** — Changes appear instantly across all open tabs
- 🔍 **Smart Search** — Quickly find bookmarks by title or URL
- 🏷️ **Categories** — Organize bookmarks with predefined or custom categories
- 📦 **Archive System** — Archive old bookmarks without deleting them
- 📝 **Description Field** — Add a short description to each bookmark
- 🚫 **Duplicate Prevention** — Real-time warning when a duplicate title is detected
- 📄 **Pagination** — Clean pagination for large bookmark collections
- 🎨 **Dark / Light Mode** — Toggle between themes
- 📱 **Fully Responsive** — Works seamlessly on all devices

### View Options

- 📊 **Grid View** — Card-based layout with pagination (9 per page)
- 📋 **List View** — Compact row layout with infinite scroll

### AI Assistant 🤖

- 💬 **Natural Language Chat** — Ask questions about your bookmarks in plain English
- 🎯 **Smart Search** — _"Find my React tutorials from last month"_
- 📅 **Time-based Queries** — _"Show bookmarks I saved yesterday"_
- 🗂️ **Category Filtering** — _"What's in my Learning category?"_
- ⚡ **Powered by Groq AI** — Lightning-fast responses with Llama 3.3 70B

---

## 🛠️ Tech Stack

### Frontend

| Technology              | Role             |
| ----------------------- | ---------------- |
| Next.js 16 (App Router) | Framework        |
| TypeScript              | Language         |
| Tailwind CSS            | Styling          |
| Shadcn/ui, Radix UI     | UI Components    |
| Zustand                 | State Management |
| Lucide React            | Icons            |

### Backend

| Technology            | Role                          |
| --------------------- | ----------------------------- |
| Supabase (PostgreSQL) | Database                      |
| Supabase Auth         | Google OAuth + email/password |
| Supabase Realtime     | Live sync                     |
| Row Level Security    | Data protection               |

### AI & ML

| Technology              | Role        |
| ----------------------- | ----------- |
| Groq                    | AI Provider |
| Llama 3.3 70B Versatile | Model       |

### Deployment

| Technology              | Role                 |
| ----------------------- | -------------------- |
| Vercel                  | Hosting              |
| Supabase Edge Functions | Serverless functions |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm
- [Supabase](https://supabase.com) account
- Google OAuth credentials
- [Groq API key](https://console.groq.com) (free — no credit card required)

### 1. Clone the Repository

```bash
git clone https://github.com/Hmtgit7/smart-bookmark-app.git
cd smart-bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Groq AI (for chatbot)
GROQ_API_KEY=your_groq_api_key
```

### 4. Set Up the Database

Run the following SQL in your **Supabase SQL Editor**:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'Uncategorized',
  archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- Performance indexes
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_archived ON bookmarks(user_id, archived);
CREATE INDEX idx_bookmarks_category ON bookmarks(user_id, category);
```

### 5. Configure Authentication Providers

1. In your Supabase dashboard, go to **Authentication → Providers**
2. Enable **Google** and add your **Google Client ID** and **Client Secret**
3. Make sure **Email** sign-in is enabled if you want password login
4. Add the authorized redirect URI:
    ```
    http://localhost:3000/auth/callback
    ```

### 6. Get a Groq API Key

1. Sign up at [console.groq.com](https://console.groq.com) — no credit card required
2. Create a new API key
3. Add it to your `.env.local` file

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

```bash
npm run build
npm start
```

---

## 🎯 Key Features Explained

### AI Chatbot

The AI assistant uses Groq's **Llama 3.3 70B** model to understand natural language queries about your bookmarks. Example queries:

- _"Find my React tutorial from last month"_
- _"Show all bookmarks in the Development category"_
- _"What did I save yesterday?"_
- _"Find that GitHub repository I bookmarked"_

### Real-time Sync

Using Supabase Realtime, any changes — add, edit, delete, or archive — are instantly reflected across all open tabs without a page refresh.

### Archive System

Instead of permanently deleting bookmarks, archive them to keep your collection clean while preserving history. Archived bookmarks display their archive date.

### Duplicate Prevention

The app prevents duplicate bookmark titles with a real-time warning as you type, before you even hit save.

---

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── actions/          # Server actions
│   │   ├── bookmarks.ts  # Bookmark CRUD operations
│   │   └── chat.ts       # AI chatbot logic
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main dashboard
│   └── page.tsx          # Landing page
├── components/
│   ├── bookmarks/        # Bookmark-related components
│   ├── chat/             # AI chatbot component
│   ├── layout/           # Layout components
│   └── ui/               # Shadcn UI components
├── lib/
│   ├── stores/           # Zustand stores
│   └── supabase/         # Supabase client config
└── public/               # Static assets
```

---

## 🔧 Technology Decisions

**Why Groq over Gemini?**
Groq requires no credit card on the free tier, delivers 3–5× faster responses, offers higher rate limits (30+ RPM vs. 15 RPM), and has a more stable API for production use.

**Why Zustand?**
At just 1.2KB, Zustand has a minimal footprint, a simple API, zero boilerplate, and handles real-time state updates cleanly.

**Why Supabase?**
Supabase bundles a PostgreSQL database, built-in authentication, real-time subscriptions, and row-level security into a single platform that's easy to scale.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📝 License

This project is licensed under the **MIT License** — free to use for personal or commercial purposes.

---

## 👨‍💻 Author

**Hemant Gehlod**

- GitHub: [@Hmtgit7](https://github.com/Hmtgit7)
- LinkedIn: [hemant-gehlod](https://www.linkedin.com/in/hemant-gehlod/)

---

## 🙏 Acknowledgments

[Next.js](https://nextjs.org) · [Supabase](https://supabase.com) · [Groq](https://groq.com) · [Shadcn/ui](https://ui.shadcn.com) · [Vercel](https://vercel.com)

---

<div align="center">Made with ❤️ using Next.js, Supabase, and Groq AI</div>
