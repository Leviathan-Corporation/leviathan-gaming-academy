-- LEVIATHAN recorded Vimeo lessons: run after the original schema.sql
create table if not exists public.course_parts (
 id uuid primary key default gen_random_uuid(),
 course_id uuid not null references public.courses(id) on delete cascade,
 title text not null,
 description text,
 sort_order integer not null default 0,
 created_at timestamptz not null default now()
);
create table if not exists public.course_videos (
 id uuid primary key default gen_random_uuid(),
 course_id uuid not null references public.courses(id) on delete cascade,
 part_id uuid references public.course_parts(id) on delete set null,
 title text not null,
 description text,
 vimeo_url text not null,
 sort_order integer not null default 0,
 duration_minutes integer,
 is_published boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.course_parts enable row level security;
alter table public.course_videos enable row level security;
drop policy if exists "course parts visible for published courses" on public.course_parts;
create policy "course parts visible for published courses" on public.course_parts for select to authenticated
using (exists(select 1 from public.courses c where c.id=course_parts.course_id and c.is_published=true));
drop policy if exists "course parts admin manage" on public.course_parts;
create policy "course parts admin manage" on public.course_parts for all to authenticated
using (public.current_user_role()='admin') with check (public.current_user_role()='admin');
drop policy if exists "published videos visible to enrolled students" on public.course_videos;
create policy "published videos visible to enrolled students" on public.course_videos for select to authenticated
using (is_published and exists(select 1 from public.enrollments e where e.course_id=course_videos.course_id and e.student_id=auth.uid() and e.status='active'));
drop policy if exists "course videos admin manage" on public.course_videos;
create policy "course videos admin manage" on public.course_videos for all to authenticated
using (public.current_user_role()='admin') with check (public.current_user_role()='admin');
