import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";
import type { Scholarship } from "@/lib/content";
import {
  ArrowLeft, Calendar, CheckCircle2, Gift, GraduationCap, MapPin,
  Phone, Sparkles, Star, UserCheck,
} from "lucide-react";
import { HelpCard } from "./jobs.$id";

async function fetchOne(id: string): Promise<Scholarship> {
  const { data, error } = await supabase.from("scholarships").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw notFound();
  return data as Scholarship;
}

export const Route = createFileRoute("/scholarships/$id")({
  head: () => ({ meta: [{ title: "Scholarship details — Project Faraz" }] }),
  component: Detail,
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-muted-foreground">Couldn't load this scholarship.</p>
        <p className="mt-1 text-xs text-muted-foreground/70">{error.message}</p>
        <Link to="/scholarships" className="mt-4 inline-block text-sm font-semibold text-accent">← Back</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Scholarship not found</h1>
        <Link to="/scholarships" className="mt-4 inline-block text-sm font-semibold text-accent">← Back</Link>
      </div>
    </div>
  ),
});

function Detail() {
  const { id } = Route.useParams();
  const { data: s, isLoading } = useQuery({ queryKey: ["scholarship", id], queryFn: () => fetchOne(id) });

  if (isLoading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!s) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/scholarships" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to scholarships
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-hero p-1 shadow-pop">
          <div className="rounded-[22px] bg-card p-6 sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {s.logo_url ? (
                <img src={s.logo_url} alt={s.organization} className="h-20 w-20 rounded-2xl object-cover shadow-card" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white text-accent shadow-card">
                  <GraduationCap className="h-10 w-10" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                  <GraduationCap className="h-4 w-4" /> {s.organization}
                </div>
                <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{s.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Pill icon={MapPin} text={s.country || "Worldwide"} />
                  <Pill icon={GraduationCap} text={s.level} />
                  {s.amount && <Pill icon={Star} text={s.amount} />}
                  {s.deadline && <Pill icon={Calendar} text={`Apply by ${new Date(s.deadline).toLocaleDateString()}`} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Section icon={GraduationCap} title="About this scholarship">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </Section>

            {s.who_can_apply && (
              <Section icon={UserCheck} title="Who can apply">
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{s.who_can_apply}</p>
              </Section>
            )}

            {s.requirements && (
              <Section icon={CheckCircle2} title="Requirements">
                <BulletText text={s.requirements} />
              </Section>
            )}

            {s.benefits && (
              <Section icon={Gift} title="What it covers">
                <BulletText text={s.benefits} />
              </Section>
            )}

            {s.how_to_apply && (
              <Section icon={Sparkles} title="How to apply" highlight>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{s.how_to_apply}</p>
              </Section>
            )}

            {s.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{t}</span>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border bg-card p-6 shadow-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ready to apply?</div>
              <p className="mt-2 text-sm text-muted-foreground">
                {s.apply_url
                  ? "Open the official application portal."
                  : "Contact our team and we'll help you apply."}
              </p>
              {s.apply_url ? (
                <a
                  href={s.apply_url}
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

function Pill({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-medium text-foreground">
      <Icon className="h-3.5 w-3.5" />{text}
    </span>
  );
}
