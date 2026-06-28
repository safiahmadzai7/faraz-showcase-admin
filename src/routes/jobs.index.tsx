import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { fetchJobs } from "@/lib/content";
import { Briefcase, Clock, MapPin, Search, Star, X } from "lucide-react";


type JobsSearch = { q?: string; loc?: string };

export const Route = createFileRoute("/jobs/")({
  head: () => ({ meta: [{ title: "Find a Job — Project Faraz" }, { name: "description", content: "Browse all open jobs on Project Faraz." }] }),
  validateSearch: (s: Record<string, unknown>): JobsSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    loc: typeof s.loc === "string" ? s.loc : undefined,
  }),
  component: JobsPage,
});

function JobsPage() {
  const navigate = useNavigate({ from: "/jobs" });
  const { q = "", loc = "" } = Route.useSearch();
  const [qInput, setQInput] = useState(q);
  const [locInput, setLocInput] = useState(loc);
  const { data = [], isLoading } = useQuery({ queryKey: ["jobs"], queryFn: fetchJobs });

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    const ln = loc.trim().toLowerCase();
    return data.filter((j) => {
      const hayQ = `${j.title} ${j.company} ${j.category} ${j.industry ?? ""}`.toLowerCase();
      const hayL = `${j.location}`.toLowerCase();
      return (!qn || hayQ.includes(qn)) && (!ln || hayL.includes(ln));
    });
  }, [data, q, loc]);

  const hasFilters = q || loc;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: { q: qInput || undefined, loc: locInput || undefined } });
  }
  function clear() {
    setQInput(""); setLocInput("");
    navigate({ search: {} });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Open Jobs</h1>
        <p className="mt-3 text-muted-foreground">All current opportunities posted on Project Faraz.</p>

        <form
          onSubmit={submit}
          className="mt-8 grid w-full gap-2 rounded-2xl bg-white p-2 shadow-card sm:grid-cols-[1fr_1fr_auto] sm:rounded-full"
        >
          <label className="flex items-center gap-2 rounded-full px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Job title, keyword or company"
            />
          </label>
          <label className="flex items-center gap-2 rounded-full border-t px-4 py-2.5 sm:border-l sm:border-t-0">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <input
              value={locInput}
              onChange={(e) => setLocInput(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="City, state or remote"
            />
          </label>
          <button className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Search
          </button>
        </form>

        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
            {q && <span className="rounded-full bg-secondary px-3 py-1 text-xs">“{q}”</span>}
            {loc && <span className="rounded-full bg-secondary px-3 py-1 text-xs">{loc}</span>}
            <button onClick={clear} className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
              <X className="h-3 w-3" /> Clear
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="mt-12 text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No jobs match your search.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((j) => (
              <Link
                key={j.id}
                to="/jobs/$id"
                params={{ id: j.id }}
                className="group flex flex-col rounded-3xl border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-pop"
              >
                <div className="flex items-start gap-3">
                  {j.logo_url ? (
                    <img src={j.logo_url} alt={j.company} className="h-12 w-12 rounded-xl object-cover" />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-hero font-bold text-white">{j.company[0]}</div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{j.company}</div>
                    <div className="text-xs text-muted-foreground">{j.industry || j.category}</div>
                  </div>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold group-hover:text-accent">{j.title}</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <Row icon={MapPin} text={j.location || "Remote"} />
                  <Row icon={Clock} text={j.job_type} />
                  <Row icon={Briefcase} text={j.category} />
                  {j.salary && <Row icon={Star} text={j.salary} />}
                </div>
                <span className="mt-5 inline-flex items-center justify-center rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground">
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

function Row({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return <div className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /><span className="truncate">{text}</span></div>;
}
