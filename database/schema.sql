create table users (
  id uuid primary key,
  email text,
  xp int default 0,
  level int default 1
);

create table messages (
  id uuid primary key,
  user_id uuid,
  message text,
  created_at timestamp default now()
);
