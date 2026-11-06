-- LEVIATHAN initial Supabase schema
-- Run this entire file in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'student' check (role in ('student','coach','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete set null,
  display_name text not null,
  bio text,
  games text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  game text not null check (game in ('Free Fire','BGMI','PUBG','Minecraft')),
  level text default 'All levels',
  price numeric(10,2) check (price is null or price >= 0),
  coach_id uuid references public.coaches(id) on delete set null,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','active','completed','cancelled')),
  created_at timestamptz not null default now(),
  unique(student_id, course_id)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  coach_id uuid references public.coaches(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  starts_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes between 15 and 240),
  status text not null default 'requested' check (status in ('requested','confirmed','completed','cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_title text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Create a profile automatically whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Role helper: security-definer avoids recursive profile RLS checks.
create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = ''
as $$ select role from public.profiles where id = (select auth.uid()) $$;

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.coaches enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.bookings enable row level security;
alter table public.progress enable row level security;

-- Profiles: users can read/update their own profile; admins can read all.
create policy "profiles read own or admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.current_user_role() = 'admin');
create policy "profiles update own" on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()) and role = (select public.current_user_role()));
create policy "profiles admin manage" on public.profiles for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "games public read" on public.games for select to anon, authenticated using (true);
create policy "games admin manage" on public.games for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "coaches public active read" on public.coaches for select to anon, authenticated using (is_active or public.current_user_role() = 'admin');
create policy "coaches admin manage" on public.coaches for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "courses published read" on public.courses for select to anon, authenticated
using (is_published or public.current_user_role() in ('admin','coach'));
create policy "courses admin manage" on public.courses for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "enrollments student or admin read" on public.enrollments for select to authenticated
using (student_id = (select auth.uid()) or public.current_user_role() = 'admin');
create policy "students request own enrollment" on public.enrollments for insert to authenticated
with check (student_id = (select auth.uid()) and status = 'pending');
create policy "enrollments admin manage" on public.enrollments for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "bookings student or admin read" on public.bookings for select to authenticated
using (student_id = (select auth.uid()) or public.current_user_role() = 'admin');
create policy "students create own booking" on public.bookings for insert to authenticated
with check (student_id = (select auth.uid()) and status = 'requested');
create policy "bookings admin manage" on public.bookings for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "progress student or admin read" on public.progress for select to authenticated
using (student_id = (select auth.uid()) or public.current_user_role() = 'admin');
create policy "progress admin manage" on public.progress for all to authenticated
using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

insert into public.games(name,slug,description) values
('Free Fire','free-fire','Aim, movement and ranked strategy'),
('BGMI','bgmi','Battle royale mechanics and squad tactics'),
('PUBG','pubg','Battle royale mechanics and squad tactics'),
('Minecraft','minecraft','Survival, building, PvP and redstone')
on conflict (slug) do nothing;

-- IMPORTANT: after signing up with your own account, promote it to admin
-- from the SQL Editor by replacing the email below:
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');
