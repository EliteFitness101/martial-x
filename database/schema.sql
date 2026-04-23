create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  role text default 'user',
  subscription_tier text default 'free',
  xp int default 0,
  level int default 1,
  created_at timestamp default now()
);

create table memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  input text,
  output text,
  created_at timestamp default now()
);

create table xp_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  xp int,
  action text,
  created_at timestamp default now()
);
