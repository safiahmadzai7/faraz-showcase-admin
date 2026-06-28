// Public read helpers using the browser/anon supabase client.
// All content tables have a public SELECT policy.
import { supabase } from "@/integrations/supabase/client";

export type Job = {
  id: string;
  title: string;
  company: string;
  logo_url: string | null;
  location: string;
  job_type: string;
  category: string;
  industry: string | null;
  salary: string | null;
  apply_url: string | null;
  featured: boolean;
  description: string | null;
  how_to_apply: string | null;
  who_can_apply: string | null;
  requirements: string | null;
  benefits: string | null;
  created_at: string;
};


export type Company = {
  id: string;
  name: string;
  logo_url: string | null;
  description: string;
  tags: string[];
  accent: string;
  created_at: string;
};

export type Scholarship = {
  id: string;
  title: string;
  organization: string;
  country: string;
  amount: string | null;
  deadline: string | null;
  level: string;
  description: string;
  tags: string[];
  apply_url: string | null;
  logo_url: string | null;
  how_to_apply: string | null;
  who_can_apply: string | null;
  requirements: string | null;
  benefits: string | null;
  created_at: string;
};


export type Article = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string | null;
  category: string;
  read_minutes: number;
  url: string | null;
  published_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar_url: string | null;
  rating: number;
  created_at: string;
};

export async function fetchJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Job[];
}

export async function fetchCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Company[];
}

export async function fetchScholarships() {
  const { data, error } = await supabase
    .from("scholarships")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Scholarship[];
}

export async function fetchArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function fetchTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}
