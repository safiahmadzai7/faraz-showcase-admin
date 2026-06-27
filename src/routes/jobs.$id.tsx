import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/lib/content";
import { ArrowLeft, Bookmark, Briefcase, Building2, Clock, MapPin, Sparkles, Star } from "lucide-react";

async function fetchJob(id: string): Promise<Job> {
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw notFound();
  return data as Job;
}

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({ meta: [{ title: "Job details — Project Faraz" }] }),
  component: JobDetail,
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-muted-foreground">Couldn't load this job.</p>
        <p className="mt-1 text-xs text-muted-foreground/70">{error.message}</p>
        <Link to="/jobs" className="mt-4 inline-block text-sm font-semibold text-accent">← Back to jobs</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Job not found</h1>
        <Link to="/jobs" className="mt-4 inline-block text-sm font-semibold text-accent">← Back to jobs</Link>
      </div>
    </div>
  ),
});

function JobDetail() {
  const { id } = Route.useParams();
  const { data: j, isLoading } = useQuery({ queryKey: ["job", id], queryFn: () => fetchJob(id) });

  if (isLoading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!j) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-hero p-1 shadow-pop">
          <div className="rounded-[22px] bg-card p-6 sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {j.logo_url ? (
                <img src={j.logo_url} alt={j.company} className="h-20 w-20 rounded-2xl object-cover shadow-card" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-hero text-3xl font-bold text-white">{j.company[0]}</div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                  <Building2 className="h-4 w-4" /> {j.company}
                </div>
                <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{j.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Pill icon={MapPin} text={j.location || "Remote"} />
                  <Pill icon={Clock} text={j.job_type} />
                  <Pill icon={Briefcase} text={j.industry || j.category} />
                  {j.salary && <Pill icon={Star} text={j.salary} />}
                  {j.featured && <Pill icon={Sparkles} text="Featured" />}
                </div>
              </div>
              <button className="hidden rounded-full border p-3 sm:block" aria-label="Save"><Bookmark className="h-4 w-4" /></button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Info label="Category" value={j.category} />
              <Info label="Industry" value={j.industry ?? "—"} />
              <Info label="Posted" value={new Date(j.created_at).toLocaleDateString()} />
            </div>

            <div className="mt-8 rounded-2xl border bg-gradient-soft p-6">
              <h2 className="font-display text-lg font-bold">About this role</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {j.company} is hiring a {j.title} ({j.job_type}) based in {j.location || "a remote location"}.
                {j.salary ? ` Compensation: ${j.salary}.` : ""} Click apply below to submit your application directly with the employer.
              </p>
            </div>

            <a
              href={j.apply_url || "#"}
              target={j.apply_url ? "_blank" : undefined}
              rel="noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground sm:w-auto"
            >
              Apply now
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Pill({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-medium text-foreground">
      <Icon className="h-3.5 w-3.5" />{text}
    </span>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
