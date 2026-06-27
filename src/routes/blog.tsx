import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { fetchArticles } from "@/lib/content";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "Blog — Project Faraz" }, { name: "description", content: "News, interviews and career insights." }] }),
  component: Page,
});

function Page() {
  const { data = [], isLoading } = useQuery({ queryKey: ["articles"], queryFn: fetchArticles });
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">Career insights, news and interviews.</p>
        {isLoading ? <p className="mt-12 text-muted-foreground">Loading…</p> : data.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No articles yet.</p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((a) => (
              <a key={a.id} href={a.url || "#"} target={a.url ? "_blank" : undefined} rel="noreferrer"
                className="overflow-hidden rounded-3xl border bg-card shadow-card transition hover:-translate-y-1">
                {a.image_url && <img src={a.image_url} alt={a.title} className="aspect-[4/3] w-full object-cover" />}
                <div className="p-5">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{a.category}</span>
                  <h3 className="mt-3 font-display text-lg font-bold">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {a.read_minutes} min read · {new Date(a.published_at).toLocaleDateString()}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
