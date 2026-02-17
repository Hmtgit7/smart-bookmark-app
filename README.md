# 🔖 Smart Bookmarks

A modern, full-stack bookmark manager built with **Next.js** and **Supabase**. Organize, search, and manage your favorite links with real-time synchronization across all your devices.

🔗 **Live Demo:** [smart-bookmark-app-lilac-phi.vercel.app](https://smart-bookmark-app-lilac-phi.vercel.app)

---

## ✨ Features

- 🔐 **Google OAuth Authentication** — Secure, one-click sign-in with your Google account
- ⚡ **Real-time Sync** — Changes appear instantly across all open tabs and devices
- 🔍 **Smart Search** — Quickly find bookmarks by title or URL
- 🏷️ **Categories** — Organize bookmarks with predefined or custom categories
- 📦 **Archive System** — Archive old bookmarks without permanently deleting them
- 🚫 **Duplicate Prevention** — Stops you from adding bookmarks with duplicate titles
- 📄 **Pagination** — Clean, efficient pagination for large bookmark collections
- 🎨 **Dark / Light Mode** — Toggle between themes to suit your preference
- 📱 **Fully Responsive** — Works seamlessly on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS |
| UI Components | Shadcn/ui, Radix UI |
| Backend & Auth | Supabase (PostgreSQL, Auth, Realtime) |
| State Management | Zustand |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm
- A [Supabase](https://supabase.com/) account
- Google OAuth credentials ([how to create them](https://console.cloud.google.com/))

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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Set Up the Database

Run the following SQL in your **Supabase SQL Editor** to create the bookmarks table and configure Row Level Security:

```sql
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

-- Enable real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

### 5. Configure Google OAuth

1. In your Supabase dashboard, go to **Authentication → Providers → Google**
2. Enter your **Google Client ID** and **Client Secret**
3. Add the following authorized redirect URI:
   ```
   http://localhost:3000/auth/callback
   ```

### 6. Run the Development Server

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

## 📝 License

This project is licensed under the **MIT License** — free to use for personal or commercial purposes.

---

## 👨‍💻 Author

**Hemant Gehlod**

- GitHub: [@Hmtgit7](https://github.com/Hmtgit7)

---

<div align="center">Made with ❤️ using Next.js and Supabase</div>