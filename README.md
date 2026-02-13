Smart Bookmark App

A full-stack Smart Bookmark Manager built using Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.

🚀 Live Demo

https://smart-bookmark-app-eight-black.vercel.app

✅ Features

Google OAuth login (Supabase Auth)

Add bookmark (URL + title)

Delete bookmarks

Bookmarks are private per user (Row Level Security)

Realtime updates across multiple tabs

Responsive UI

Deployed on Vercel

🛠 Tech Stack

Next.js (App Router)

Supabase (Authentication, PostgreSQL, Realtime)

Tailwind CSS

Vercel Deployment

🔐 Authentication

Google OAuth enabled via Supabase.

Only authenticated users can access the dashboard.

No email/password authentication implemented (as required).

🗄 Database & Security

Bookmarks table includes:

id

user_id

title

url

created_at

Row Level Security (RLS) enabled.

Policies ensure:

Users can only SELECT their own bookmarks

Users can only INSERT bookmarks with their own user_id

Users can only DELETE their own bookmarks

This guarantees privacy between users.

⚡ Realtime Implementation

Supabase Realtime subscription is enabled on the bookmarks table.

Subscription is filtered by user_id.

When a bookmark is added or deleted:

All open tabs update instantly without refresh.

🚧 Problems Faced & Solutions
1. OAuth Redirect Issues

Problem:
Google login was not redirecting correctly after deployment.

Solution:
Configured correct redirect URLs in Supabase:

Localhost for development

Vercel production URL for deployment

2. Row Level Security Blocking Queries

Problem:
Bookmarks were not inserting due to RLS restrictions.

Solution:
Created proper RLS policies using:
auth.uid() = user_id

This allowed users to access only their own data.

3. Realtime Not Triggering

Problem:
Realtime updates were not syncing across tabs.

Solution:
Enabled replication for the bookmarks table and implemented Supabase channel subscription filtered by user_id.

4. Environment Variables Not Working in Production

Problem:
Supabase keys were undefined after deployment.

Solution:
Added environment variables in Vercel:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Redeployed the project.

⚙️ Local Setup

Clone repository

git clone https://github.com/Preetham144/smart-bookmark-app.git
cd smart-bookmark-app


Install dependencies

npm install


Create .env.local

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key


Run development server

npm run dev

📦 Submission Links

Live URL:
https://smart-bookmark-app-eight-black.vercel.app

GitHub Repository:
https://github.com/Preetham144/smart-bookmark-app
