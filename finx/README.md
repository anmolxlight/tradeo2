# Finx

AI-driven stock & crypto explorer.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Ensure `.env.local` contains your keys (already created).

3. Create Supabase tables:

```sql
create table if not exists public.searches (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  query text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text,
  created_at timestamp with time zone default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.threads(id) on delete cascade,
  role text check (role in ('user','assistant')),
  content text,
  created_at timestamp with time zone default now()
);
```

4. Run dev server:

```bash
npm run dev
```

## Notes
- Unauthenticated users: history is not stored; the summary last line is blurred with a sign-in CTA.
- Signed-in users: left sidebar shows recent searches and chat persists.
- Perplexity models used: `sonar-pro` via chat for structured and conversational answers.