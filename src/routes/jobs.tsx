import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { fetchJobs } from "@/lib/content";
import { Bookmark, Briefcase, Clock, MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Find a Job — Project Faraz" }, { name: "description", content: "Browse all open jobs on Project Faraz." }] }),
  component: JobsPage,
});

function JobsPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ["jobs"], queryFn: fetchJobs });
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Open Jobs</h1>
        <p className="mt-3 text-muted-foreground">All current opportunities posted on Project Faraz.</p>

        {isLoading ? (
          <p className="mt-12 text-muted-foreground">Loading…</p>
        ) : data.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No jobs yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((j) => (
              <div key={j.id} className="rounded-3xl border bg-card p-6 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {j.logo_url ? (
                      <img src={j.logo_url} alt={j.company} className="h-10 w-10 rounded-xl object-contain" />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero font-bold text-white">{j.company[0]}</div>
                    )}
                    <div className="font-semibold">{j.company}</div>
                  </div>
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{j.title}</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <Row icon={MapPin} text={j.location || "Remote"} />
                  <Row icon={Clock} text={j.job_type} />
                  <Row icon={Briefcase} text={j.industry || j.category} />
                  {j.salary && <Row icon={Star} text={j.salary} />}
                </div>
                <a
                  href={j.apply_url || "#"}
                  target={j.apply_url ? "_blank" : undefined}
                  rel="noreferrer"
                  className="mt-5 block rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground"
                >
                  Apply
                </a>
              </div>
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
