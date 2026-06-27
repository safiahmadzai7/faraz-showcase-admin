import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";
import type { Scholarship } from "@/lib/content";
import { ArrowLeft, Calendar, GraduationCap, MapPin, Star } from "lucide-react";

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
            <div className="flex items-center gap-3 text-sm font-semibold text-accent">
              <GraduationCap className="h-5 w-5" /> {s.organization}
            </div>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{s.title}</h1>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Pill icon={MapPin} text={s.country || "Worldwide"} />
              <Pill icon={GraduationCap} text={s.level} />
              {s.amount && <Pill icon={Star} text={s.amount} />}
              {s.deadline && <Pill icon={Calendar} text={`Apply by ${new Date(s.deadline).toLocaleDateString()}`} />}
            </div>

            <div className="mt-8 rounded-2xl border bg-gradient-soft p-6">
              <h2 className="font-display text-lg font-bold">About this scholarship</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>

            {s.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{t}</span>
                ))}
              </div>
            )}

            <a
              href={s.apply_url || "#"}
              target={s.apply_url ? "_blank" : undefined}
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
