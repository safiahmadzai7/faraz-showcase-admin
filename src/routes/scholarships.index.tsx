import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { fetchScholarships } from "@/lib/content";
import { Calendar, GraduationCap, MapPin, Star } from "lucide-react";


export const Route = createFileRoute("/scholarships/")({
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
              <Link
                key={s.id}
                to="/scholarships/$id"
                params={{ id: s.id }}
                className="group flex flex-col rounded-3xl border bg-gradient-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-pop"
              >
                <div className="flex items-center gap-3">
                  {s.logo_url ? (
                    <img src={s.logo_url} alt={s.organization} className="h-12 w-12 rounded-xl object-cover shadow-card" />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-accent shadow-card"><GraduationCap className="h-6 w-6" /></div>
                  )}
                  <div className="font-semibold">{s.organization}</div>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold group-hover:text-accent">{s.title}</h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <Row icon={MapPin} text={s.country || "Worldwide"} />
                  <Row icon={GraduationCap} text={s.level} />
                  {s.amount && <Row icon={Star} text={s.amount} />}
                  {s.deadline && <Row icon={Calendar} text={new Date(s.deadline).toLocaleDateString()} />}
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

function Row({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return <div className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /><span className="truncate">{text}</span></div>;
}
