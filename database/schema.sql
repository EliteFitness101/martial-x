-- USERS TABLE
create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  role text default 'user', -- user | admin
  subscription_tier text default 'free',
  xp int default 0,
  level int default 1,
  created_at timestamp default now()
);

-- SUBSCRIPTIONS
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  plan text, -- free | basic | elite
  status text, -- active | canceled | expired
  start_date timestamp default now(),
  end_date timestamp
);

-- CHAT MESSAGES (AI COACH MEMORY)
create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  role text, -- user | coach
  content text,
  created_at timestamp default now()
);

-- XP LOGS (GAMIFICATION TRACKING)
create table xp_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action text,
  xp int,
  created_at timestamp default now()
);

-- PAYMENTS (PAYSTACK)
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  email text,
  amount int,
  reference text,
  status text,
  created_at timestamp default now()
);
create table memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  input text,
  output text,
  created_at timestamp default now()
);
