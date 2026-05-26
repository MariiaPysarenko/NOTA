create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  avatar_url text,
  selected_instrument text default 'Alto Saxophone',
  created_at timestamptz default now()
);

create table if not exists uploaded_sheets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  storage_path text,
  digitized_notes jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  sheet_id uuid references uploaded_sheets(id) on delete set null,
  instrument text not null,
  duration_seconds int not null default 0,
  accuracy int not null default 0,
  notes_played int not null default 0,
  mistakes int not null default 0,
  longest_pause_ms int not null default 0,
  rhythm_issues int not null default 0,
  created_at timestamptz default now()
);

create table if not exists practice_errors (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references practice_sessions(id) on delete cascade,
  note_expected text,
  note_detected text,
  error_type text not null,
  measure int,
  beat int,
  created_at timestamptz default now()
);

create table if not exists annotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  sheet_id uuid references uploaded_sheets(id) on delete cascade,
  type text not null,
  color text not null,
  size int not null default 2,
  points jsonb not null default '[]'::jsonb,
  linked_note_id text,
  linked_measure int,
  created_at timestamptz default now()
);

create table if not exists streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  total_practice_days int not null default 0,
  last_practice_date date
);
