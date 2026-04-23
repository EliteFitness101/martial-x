CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user',
  subscription TEXT DEFAULT 'free',
  paystack_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
