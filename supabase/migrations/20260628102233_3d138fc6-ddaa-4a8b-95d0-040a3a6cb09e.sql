
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS how_to_apply text,
  ADD COLUMN IF NOT EXISTS who_can_apply text,
  ADD COLUMN IF NOT EXISTS requirements text,
  ADD COLUMN IF NOT EXISTS benefits text;

ALTER TABLE public.scholarships
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS how_to_apply text,
  ADD COLUMN IF NOT EXISTS who_can_apply text,
  ADD COLUMN IF NOT EXISTS requirements text,
  ADD COLUMN IF NOT EXISTS benefits text;
