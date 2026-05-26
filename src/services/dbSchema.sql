-- NOTA PostgreSQL schema (Supabase)
-- Run in Supabase SQL editor. Enable RLS policies per table for user_id = auth.uid().

create extension if not exists "uuid-ossp";

-- Extended profile (auth.users holds email)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  instrument text default 'Alto Saxophone',
  teacher_mode boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.uploaded_sheets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subtitle text,
  file_name text,
  preview_url text,
  notes_json jsonb not null default '[]',
  created_at timestamptz default now()
);

create table if not exists public.annotations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sheet_id uuid references public.uploaded_sheets(id) on delete cascade,
  note_id text,
  measure int,
  x numeric,
  y numeric,
  text text,
  color text default '#ff7a00',
  created_at timestamptz default now()
);

create table if not exists public.practice_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sheet_id uuid references public.uploaded_sheets(id) on delete set null,
  piece_title text,
  instrument text,
  accuracy int default 0,
  duration_seconds int default 0,
  xp_earned int default 0,
  completed_piece boolean default false,
  summary_json jsonb,
  date date default current_date,
  created_at timestamptz default now()
);

create table if not exists public.practice_errors (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.practice_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  note_name text,
  measure int,
  error_type text, -- missed | wrong | rhythm | unstable | pause
  detail text,
  created_at timestamptz default now()
);

create table if not exists public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_practice_date date,
  total_practice_seconds bigint default 0,
  updated_at timestamptz default now()
);

create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text,
  icon text
);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id),
  unlocked_at timestamptz default now(),
  primary key (user_id, achievement_id)
);

-- Seed achievements
insert into public.achievements (id, title, description, icon) values
  ('streak_7', '7 Day Streak', 'Practice 7 days in a row', '🔥'),
  ('accuracy_90', 'Pitch Master', 'Reach 90% accuracy', '🎯'),
  ('first_piece', 'First Piece', 'Complete your first piece', '🎵')
on conflict (id) do nothing;

-- RLS (example — enable and tailor in Supabase dashboard)
-- alter table public.profiles enable row level security;
-- create policy "profiles_own" on public.profiles for all using (auth.uid() = id);
