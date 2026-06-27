
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  accent TEXT NOT NULL DEFAULT 'pink',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.companies TO anon, authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  logo_url TEXT,
  location TEXT NOT NULL DEFAULT '',
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  category TEXT NOT NULL DEFAULT 'Other',
  industry TEXT,
  salary TEXT,
  apply_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true);

CREATE TABLE public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  amount TEXT,
  deadline DATE,
  level TEXT NOT NULL DEFAULT 'Undergraduate',
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  apply_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.scholarships TO anon, authenticated;
GRANT ALL ON public.scholarships TO service_role;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read scholarships" ON public.scholarships FOR SELECT USING (true);

CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'News',
  read_minutes INT NOT NULL DEFAULT 3,
  url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL,
  avatar_url TEXT,
  rating INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
