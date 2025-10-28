-- Run this in Supabase SQL editor to create the tasks table
create extension if not exists "pgcrypto";

create table if not exists public.tasks (
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
