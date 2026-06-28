import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/lib/content";
import {
  ArrowLeft, Bookmark, Briefcase, Building2, CheckCircle2, Clock,
  Gift, Mail, MapPin, Phone, Sparkles, Star, UserCheck,
} from "lucide-react";

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

        {/* Hero */}
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
          </div>
        </div>

        {/* Content sections */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Section icon={Briefcase} title="About this role">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {j.description ||
                  `${j.company} is hiring a ${j.title} (${j.job_type}) based in ${j.location || "a remote location"}.${j.salary ? ` Compensation: ${j.salary}.` : ""}`}
              </p>
            </Section>

            {j.who_can_apply && (
              <Section icon={UserCheck} title="Who can apply">
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{j.who_can_apply}</p>
              </Section>
            )}

            {j.requirements && (
              <Section icon={CheckCircle2} title="Requirements">
                <BulletText text={j.requirements} />
              </Section>
            )}

            {j.benefits && (
              <Section icon={Gift} title="Benefits & perks">
                <BulletText text={j.benefits} />
              </Section>
            )}

            {j.how_to_apply && (
              <Section icon={Sparkles} title="How to apply" highlight>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{j.how_to_apply}</p>
              </Section>
            )}
          </div>

          {/* Sticky apply panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border bg-card p-6 shadow-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ready to apply?</div>
              <p className="mt-2 text-sm text-muted-foreground">
                {j.apply_url
                  ? "Submit your application directly with the employer."
                  : "Reach out to us and we'll connect you to the employer."}
              </p>
              {j.apply_url ? (
                <a
                  href={j.apply_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Apply now
                </a>
              ) : (
                <a
                  href="tel:0789350280"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <Phone className="h-4 w-4" /> Call to apply
                </a>
              )}
            </div>
            <HelpCard />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ icon: Icon, title, children, highlight = false }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <section className={`rounded-3xl border p-6 sm:p-8 shadow-card ${highlight ? "bg-gradient-card border-accent/30" : "bg-card"}`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${highlight ? "bg-accent text-accent-foreground" : "bg-secondary text-accent"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl font-bold">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletText({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
  if (lines.length <= 1) return <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{text}</p>;
  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      {lines.map((l, i) => (
        <li key={i} className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>{l}</span>
        </li>
      ))}
    </ul>
  );
}

export function HelpCard() {
  return (
    <div className="mt-4 overflow-hidden rounded-3xl bg-gradient-hero p-1 shadow-pop">
      <div className="rounded-[22px] bg-card p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
          <Sparkles className="h-4 w-4" /> Free help
        </div>
        <h3 className="mt-2 font-display text-lg font-bold leading-tight">
          Can't apply yourself? <span className="text-accent">We'll apply for you — free.</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Reach out and our team will handle your application from start to finish, completely free of charge.
        </p>
        <div className="mt-4 grid gap-2">
          <a href="tel:0789350280" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            <Phone className="h-4 w-4" /> 0789350280
          </a>
          <a href="mailto:contact@projectfaraz.com" className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold">
            <Mail className="h-4 w-4" /> Email us
          </a>
        </div>
      </div>
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
