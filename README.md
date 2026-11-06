# LEVIATHAN — Gaming Coaching Platform

A dark esports academy starter built with Next.js App Router, TypeScript and Supabase.

## Included
- Responsive LEVIATHAN landing page and game pages (Free Fire, BGMI/PUBG, Minecraft)
- Supabase email/password sign-up and sign-in
- Automatic profile creation on signup
- Protected student dashboard
- Admin-only dashboard and create-course form
- Supabase PostgreSQL schema with RLS policies
- Course catalogue backed by Supabase\n- Recorded Vimeo lessons: optional course parts/modules, standalone videos, multiple videos per course\n- Admin video management and enrolled-student Vimeo player

## 1. Requirements
- Node.js 20.9+
- A Supabase project

## 2. Install
```bash
npm install
cp .env.example .env.local
```
On Windows PowerShell:
```powershell
Copy-Item .env.example .env.local
```

## 3. Configure Supabase
In Supabase Dashboard → Project Settings → API, copy:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon/public key (or publishable key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Put both in `.env.local`. Never put a `service_role` key in browser-exposed variables.

## 4. Create database
Open Supabase Dashboard → SQL Editor → New query.
Paste and run `supabase/schema.sql`.

## 5. Create your admin account
1. Start the site and sign up using your own email.
2. Confirm your email if email confirmation is enabled.
3. In Supabase SQL Editor, run this query after replacing the email:
```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```
4. Sign out and sign in again. Visit `/admin`.

Do not allow public signup to select their own role. The trigger intentionally assigns `student`.

## 6. Add recorded Vimeo lessons\n1. Run the original `supabase/schema.sql` first.\n2. In Supabase SQL Editor, run `supabase/recorded-vimeo-classes.sql`.\n3. In Admin → Courses, open **Manage videos** for a course. Create optional parts, add Vimeo URLs, and publish each lesson.\n4. In Vimeo, configure embedding privacy to allow your LEVIATHAN domain. Students with an active enrollment can watch published lessons from their dashboard.\n\n## 7. Run locally
```bash
npm run dev
```
Open http://localhost:3000.

## 7. Deploy
Push the project to GitHub, import it into Vercel, and add the two environment variables from `.env.local` in Vercel Project Settings → Environment Variables. Deploy.

## Routes
- `/` landing page
- `/games` game paths
- `/courses` published coaching programs
- `/login` and `/signup`
- `/dashboard` authenticated player dashboard
- `/admin` admin-only overview
- `/admin/courses/new` admin-only course creation

## Important next steps before accepting payments or real students
- Add a booking workflow and coach/student messaging.
- Add admin screens for managing coaches, bookings and enrollments.
- Add payment provider integration and verify payment server-side before activating paid enrollments.
- Add rate limiting, abuse protection, email templates and privacy/terms pages.
- Review RLS policies and test with separate student, coach and admin accounts.
- Configure Supabase Auth redirect URLs for local and production domains.

This project is a functional starter, not a fully audited production service. No payment collection is enabled.


## Game card artwork
The home page game cards use optimized local WebP artwork in `public/images/` for Free Fire, BGMI/PUBG, and Minecraft. Images are loaded lazily and do not require a remote image service.
