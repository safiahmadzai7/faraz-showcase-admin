import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";
import type { Company } from "@/lib/content";
import { ArrowLeft, Building2 } from "lucide-react";

async function fetchOne(id: string): Promise<Company> {
  const { data, error } = await supabase.from("companies").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw notFound();
  return data as Company;
}

export const Route = createFileRoute("/companies/$id")({
  head: () => ({ meta: [{ title: "Company — Project Faraz" }] }),
  component: Detail,
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-muted-foreground">Couldn't load this company.</p>
        <p className="mt-1 text-xs text-muted-foreground/70">{error.message}</p>
        <Link to="/companies" className="mt-4 inline-block text-sm font-semibold text-accent">← Back</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Company not found</h1>
        <Link to="/companies" className="mt-4 inline-block text-sm font-semibold text-accent">← Back</Link>
      </div>
    </div>
  ),
});

function Detail() {
  const { id } = Route.useParams();
  const { data: c, isLoading } = useQuery({ queryKey: ["company", id], queryFn: () => fetchOne(id) });

  if (isLoading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!c) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to companies
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-hero p-1 shadow-pop">
          <div className="rounded-[22px] bg-card p-6 sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {c.logo_url ? (
                <img src={c.logo_url} alt={c.name} className="h-20 w-20 rounded-2xl object-contain shadow-card" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-hero text-3xl font-bold text-white">{c.name[0]}</div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                  <Building2 className="h-4 w-4" /> Featured Company
                </div>
                <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{c.name}</h1>
                {c.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border bg-gradient-soft p-6">
              <h2 className="font-display text-lg font-bold">About {c.name}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            </div>

            <Link
              to="/jobs"
              search={{ q: c.name }}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground sm:w-auto"
            >
              View jobs at {c.name}
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
