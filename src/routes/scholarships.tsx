import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { fetchScholarships } from "@/lib/content";
import { Calendar, GraduationCap, MapPin, Star } from "lucide-react";


export const Route = createFileRoute("/scholarships")({
  head: () => ({ meta: [{ title: "Scholarships — Project Faraz" }, { name: "description", content: "Browse scholarships you can apply for." }] }),
  component: Page,
});

function Page() {
  const { data = [], isLoading } = useQuery({ queryKey: ["scholarships"], queryFn: fetchScholarships });
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Scholarships</h1>
        <p className="mt-3 text-muted-foreground">Fund your education with hand-picked opportunities.</p>

        {isLoading ? <p className="mt-12 text-muted-foreground">Loading…</p> : data.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No scholarships yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((s) => (
              <div key={s.id} className="rounded-3xl border bg-gradient-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-accent"><GraduationCap className="h-5 w-5" /></div>
                  <div className="font-semibold">{s.organization}</div>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <Row icon={MapPin} text={s.country || "Worldwide"} />
                  <Row icon={GraduationCap} text={s.level} />
                  {s.amount && <Row icon={Star} text={s.amount} />}
                  {s.deadline && <Row icon={Calendar} text={new Date(s.deadline).toLocaleDateString()} />}
                </div>
                <a href={s.apply_url || "#"} target={s.apply_url ? "_blank" : undefined} rel="noreferrer"
                  className="mt-5 block rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground">
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
