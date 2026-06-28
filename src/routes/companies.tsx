import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { fetchCompanies } from "@/lib/content";

export const Route = createFileRoute("/companies")({
  head: () => ({ meta: [{ title: "Top Companies — Project Faraz" }, { name: "description", content: "Best companies for employees." }] }),
  component: Page,
});

function Page() {
  const { data = [], isLoading } = useQuery({ queryKey: ["companies"], queryFn: fetchCompanies });
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Top Companies</h1>
        <p className="mt-3 text-muted-foreground">Explore the best places to work, curated by Project Faraz.</p>
        {isLoading ? <p className="mt-12 text-muted-foreground">Loading…</p> : data.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No companies yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((c) => (
              <Link
                key={c.id}
                to="/companies/$id"
                params={{ id: c.id }}
                className="group flex flex-col rounded-3xl border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-pop"
              >
                <div className="flex items-center gap-3">
                  {c.logo_url ? <img src={c.logo_url} alt={c.name} className="h-12 w-12 rounded-2xl object-contain" /> : (
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero font-display text-lg font-bold text-white">{c.name[0]}</div>
                  )}
                  <div className="font-display text-xl font-bold group-hover:text-accent">{c.name}</div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground line-clamp-4">{c.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.tags.map((t) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{t}</span>)}
                </div>
                <span className="mt-5 inline-flex items-center justify-center rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
                  View details
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
