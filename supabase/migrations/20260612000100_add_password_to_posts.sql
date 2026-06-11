-- Add password column to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS password TEXT DEFAULT '';
