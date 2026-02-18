This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Smart Bookmark App

A full-stack bookmark manager built using Next.js (App Router) and Supabase.

## 🚀 Live Demo
https://smart-bookmark-ashen-iota.vercel.app/

## 🛠 Tech Stack
- Next.js (App Router)
- Supabase (Auth, Postgres, Realtime)
- Tailwind CSS
- Google OAuth
- Vercel (Deployment)

## ✨ Features
- Sign in with Google
- Add bookmarks
- Delete bookmarks
- Real-time updates (insert & delete)
- Secure per-user data access

## 🔐 Authentication & User Privacy

Authentication is handled using Supabase Auth with Google OAuth.

Each bookmark is linked to a `user_id` that references `auth.users.id`.

Row Level Security (RLS) is enabled on the `bookmarks` table to ensure:
- Users can only view their own bookmarks
- Users can only insert their own bookmarks
- Users can only delete their own bookmarks

This guarantees complete user data isolation.

## ⚡ Real-Time Implementation

Supabase Realtime is enabled for the `bookmarks` table.

The app subscribes to `postgres_changes` events using:

- INSERT
- DELETE

When a change occurs, the app automatically re-fetches bookmarks for the logged-in user, allowing instant updates across multiple tabs without refreshing.

## 🚧 Challenges Faced & Solutions

### 1. Google OAuth redirect_uri_mismatch
Problem:
Login failed due to incorrect redirect configuration.

Solution:
Added the correct Supabase callback URL in Google Cloud Console and added the Vercel domain in Supabase Auth URL Configuration.

---

### 2. Real-time delete not working
Problem:
Insert events worked, but delete events did not trigger real-time updates.

Solution:
Enabled DELETE events in Supabase → Database → Publications (`supabase_realtime`) and ensured replication was configured properly.

---

### 3. Production login showing "Not logged in"
Problem:
Authentication worked locally but failed after deployment.

Solution:
Added required environment variables in Vercel and redeployed the project.




