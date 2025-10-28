# Homework Tracker PWA (React + Vite + Supabase)

## Quick start

1. Unzip the project and open it in VS Code.
2. Create a file `.env.local` in the project root with these values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Install dependencies:
```
npm install
```

4. Run the dev server:
```
npm run dev
```

5. To enable PWA functionality you can register the service worker (already included). Build with `npm run build` and deploy the `dist` folder.

## Supabase table schema (SQL)

Run this SQL in your Supabase SQL editor to create the required `tasks` table:

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text,
  notes text,
  due_date date,
  student text,
  color text,
  completed boolean default false,
  created_at timestamptz default now()
);
```

## Seed data example (optional)

```sql
insert into public.tasks (title, subject, notes, due_date, student, color)
values
('Awami khitabat- Seerat Tayyba', 'Urdu', 'Read chapter and summarize', '2025-10-28', 'MAH', '#7c3aed'),
('Hist 22-25', 'General', '', '2025-10-29', 'MHM', '#16a34a'),
('Sci 3.4-3.6', 'General', '', '2025-10-30', 'MHM', '#16a34a'),
('Algebra', 'General', '', '2025-10-30', 'MAH', '#7c3aed');
```

## Notes

- Replace the VITE_SUPABASE_* values with your Supabase project's URL and anon key.
- This project is intentionally minimal to get you running quickly.
