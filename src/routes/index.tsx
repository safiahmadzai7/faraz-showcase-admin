import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search, MapPin, Briefcase, Bookmark, GraduationCap,
  Calendar, ArrowRight, Star, Clock, TrendingUp,
  MousePointerClick, FileSearch, Send, Phone, Mail, HeartHandshake,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { useI18n } from "@/lib/i18n";
import {
  fetchJobs, fetchCompanies, fetchScholarships,
  fetchArticles, fetchTestimonials,
  type Job, type Company, type Scholarship, type Article, type Testimonial,
} from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Faraz — Modernizing the Job Search Experience" },
      { name: "description", content: "Find jobs, scholarships and top companies. Project Faraz connects you with career opportunities tailored to you." },
      { property: "og:title", content: "Project Faraz" },
      { property: "og:description", content: "Discover jobs, scholarships and top companies." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <HowItWorks />
      <MissionSection />
      <CompaniesSection />
      <JobsSection />
      <ScholarshipsSection />
      <HelpCard />
      <TestimonialsSection />
      <BlogSection />
      <SiteFooter />
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mt-6 max-w-7xl rounded-[2rem] bg-gradient-hero p-6 shadow-pop sm:p-12 lg:p-20">
        <div className="relative">
          {/* Floating cards — only on very wide screens, positioned outside the hero copy */}
          <FloatCard className="-left-4 -top-4 hidden 2xl:flex" delay={0.1}>
            <div className="h-9 w-9 rounded-full bg-gradient-hero" />
            <div>
              <div className="text-[10px] text-muted-foreground">Product Designer</div>
              <div className="text-xs font-bold">Spotify · $152K</div>
            </div>
          </FloatCard>
          <FloatCard className="-right-4 -top-8 hidden 2xl:flex" delay={0.2}>
            <TrendingUp className="h-5 w-5 text-accent" />
            <div>
              <div className="text-[10px] text-muted-foreground">Top Categories</div>
              <div className="text-xs font-bold">UI · Design · Sales</div>
            </div>
          </FloatCard>
          <FloatCard className="-bottom-10 -left-6 hidden 2xl:flex" delay={0.3}>
            <Briefcase className="h-5 w-5 text-accent" />
            <div>
              <div className="text-[10px] text-muted-foreground">Design Engineer</div>
              <div className="text-xs font-bold">Remote · Full-time</div>
            </div>
          </FloatCard>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 mx-auto max-w-3xl text-center"
          >
            <HeroCopy />
            <HeroSearch />

          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute z-10 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

function HeroCopy() {
  const { t } = useI18n();
  return (
    <>
      <span className="inline-block rounded-full bg-white/60 px-4 py-1 text-xs font-semibold text-accent">
        {t("hero.tag")}
      </span>
      <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl md:text-6xl">
        {t("hero.title.1")} <br className="hidden sm:block" />
        {t("hero.title.2")}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-foreground/70">
        {t("hero.subtitle")}
      </p>
    </>
  );
}

function HeroSearch() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/jobs", search: { q: q || undefined, loc: loc || undefined } });
      }}
      className="mx-auto mt-8 grid w-full max-w-2xl gap-2 rounded-2xl bg-white p-2 shadow-card sm:grid-cols-[1fr_1fr_auto] sm:rounded-full"
    >
      <label className="flex items-center gap-2 rounded-full px-4 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          placeholder={t("hero.search.q")}
        />
      </label>
      <label className="flex items-center gap-2 rounded-full border-t px-4 py-2.5 sm:border-l sm:border-t-0">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <input
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          placeholder={t("hero.search.loc")}
        />
      </label>
      <button className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
        {t("hero.search.btn")}
      </button>
    </form>
  );
}

/* ---------------- How It Works ---------------- */
function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { icon: MousePointerClick, title: t("how.s1.title"), body: t("how.s1.body") },
    { icon: FileSearch, title: t("how.s2.title"), body: t("how.s2.body") },
    { icon: Send, title: t("how.s3.title"), body: t("how.s3.body") },
  ];
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-accent">{t("how.tag")}</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">{t("how.title")}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl border bg-card p-6 shadow-card"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-white shadow-pop">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mission ---------------- */
function MissionSection() {
  const { t } = useI18n();
  return (
    <section className="bg-gradient-soft px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="text-sm font-semibold uppercase tracking-wider text-accent">{t("mission.tag")}</div>
        <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">{t("mission.title")}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70">{t("mission.body")}</p>
      </div>
    </section>
  );
}

/* ---------------- Help / Contact card ---------------- */
function HelpCard() {
  const { t } = useI18n();
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-8 shadow-pop md:p-14"
        >
          <div className="grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/80 text-accent shadow-card">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">{t("help.tag")}</div>
              <h3 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
                {t("help.title")}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/70">{t("help.body")}</p>
            </div>
            <div className="flex flex-col gap-2 md:min-w-[200px]">
              <a
                href="tel:0789350280"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-90"
              >
                <Phone className="h-4 w-4" /> {t("help.call")} · 0789350280
              </a>
              <a
                href="mailto:info@projectfaraz.com"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/60 bg-white/40 px-5 py-3 text-sm font-semibold text-foreground hover:bg-white"
              >
                <Mail className="h-4 w-4" /> {t("help.email")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ---------------- Section helpers ---------------- */
function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <div className="text-sm font-semibold uppercase tracking-wider text-accent">{tag}</div>
      <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">{title}</h2>
    </div>
  );
}

/* ---------------- Companies ---------------- */
function CompaniesSection() {
  const { data = [] } = useQuery({ queryKey: ["companies"], queryFn: fetchCompanies });
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader tag="Top Companies" title="Best Companies for Employees" />
        {data.length === 0 ? (
          <EmptyState label="No companies added yet." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.slice(0, 6).map((c, i) => <CompanyCard key={c.id} c={c} highlight={i === 1} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function CompanyCard({ c, highlight }: { c: Company; highlight: boolean }) {
  return (
    <Link to="/companies/$id" params={{ id: c.id }} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        className={`rounded-3xl border bg-card p-6 transition ${highlight ? "bg-gradient-card shadow-pop" : "shadow-card"}`}
      >
        <div className="flex items-center gap-3">
          {c.logo_url ? (
            <img src={c.logo_url} alt={c.name} className="h-12 w-12 rounded-2xl object-contain" />
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero font-display text-lg font-bold text-white">
              {c.name[0]}
            </div>
          )}
          <div className="font-display text-xl font-bold">{c.name}</div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground line-clamp-3">{c.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {c.tags.slice(0, 5).map((t) => (
            <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{t}</span>
          ))}
        </div>
        <span className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
          View details
        </span>
      </motion.div>
    </Link>
  );
}

/* ---------------- Jobs ---------------- */
function JobsSection() {
  const { data = [] } = useQuery({ queryKey: ["jobs"], queryFn: fetchJobs });
  return (
    <section className="bg-gradient-soft px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader tag="Realize your Career Dreams" title="Search and Discover your Jobs Here" />
        {data.length === 0 ? (
          <EmptyState label="No jobs posted yet." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.slice(0, 6).map((j) => <JobCard key={j.id} j={j} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function JobCard({ j }: { j: Job }) {
  return (
    <Link to="/jobs/$id" params={{ id: j.id }} className="block">
      <motion.div whileHover={{ y: -4 }} className="rounded-3xl border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {j.logo_url ? (
              <img src={j.logo_url} alt={j.company} className="h-10 w-10 rounded-xl object-contain" />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero font-bold text-white">
                {j.company[0]}
              </div>
            )}
            <div className="font-semibold">{j.company}</div>
          </div>
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold">{j.title}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <Meta icon={MapPin} label={j.location || "Remote"} />
          <Meta icon={Clock} label={j.job_type} />
          <Meta icon={Briefcase} label={j.industry || j.category} />
          {j.salary && <Meta icon={Star} label={j.salary} />}
        </div>
        <span className="mt-5 block rounded-full border border-dashed border-accent/50 bg-accent/5 py-2.5 text-center text-sm font-semibold text-accent">
          Tap to see how to apply →
        </span>

      </motion.div>
    </Link>
  );
}

function Meta({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate">{label}</span>
    </div>
  );
}

/* ---------------- Scholarships ---------------- */
function ScholarshipsSection() {
  const { data = [] } = useQuery({ queryKey: ["scholarships"], queryFn: fetchScholarships });
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader tag="Fund your Education" title="Scholarships you can Apply for" />
        {data.length === 0 ? (
          <EmptyState label="No scholarships added yet." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.slice(0, 6).map((s) => <ScholarshipCard key={s.id} s={s} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function ScholarshipCard({ s }: { s: Scholarship }) {
  return (
    <Link to="/scholarships/$id" params={{ id: s.id }} className="block">
      <motion.div whileHover={{ y: -4 }} className="rounded-3xl border bg-gradient-card p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-accent">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="font-semibold">{s.organization}</div>
        </div>
        <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <Meta icon={MapPin} label={s.country || "Worldwide"} />
          <Meta icon={GraduationCap} label={s.level} />
          {s.amount && <Meta icon={Star} label={s.amount} />}
          {s.deadline && <Meta icon={Calendar} label={new Date(s.deadline).toLocaleDateString()} />}
        </div>
        <span className="mt-5 block rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground">
          View details
        </span>
      </motion.div>
    </Link>
  );
}

/* ---------------- Testimonials ---------------- */
function TestimonialsSection() {
  const { data = [] } = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials });
  if (data.length === 0) return null;
  return (
    <section className="bg-gradient-soft px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader tag="Success Experience" title="Insights from Faraz Users" />
        <div className="grid gap-6 md:grid-cols-3">
          {data.slice(0, 3).map((t, i) => <TestimonialCard key={t.id} t={t} highlight={i === 1} />)}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, highlight }: { t: Testimonial; highlight: boolean }) {
  return (
    <div className={`rounded-3xl border p-6 shadow-card ${highlight ? "bg-gradient-card shadow-pop" : "bg-card"}`}>
      <p className="text-sm leading-relaxed text-foreground/80">"{t.quote}"</p>
      <div className="mt-6 flex items-center gap-1 text-accent">
        {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {t.avatar_url ? (
          <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-hero font-bold text-white">
            {t.name[0]}
          </div>
        )}
        <div>
          <div className="font-semibold">{t.name}</div>
          <div className="text-xs text-muted-foreground">{t.role}{t.company ? ` at ${t.company}` : ""}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Blog ---------------- */
function BlogSection() {
  const { data = [] } = useQuery({ queryKey: ["articles"], queryFn: fetchArticles });
  if (data.length === 0) return null;
  const [feature, ...rest] = data;
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-accent">Insights</div>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Latest from the Blog</h2>
          </div>
          <button className="hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold md:inline-flex">
            All News <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <FeatureArticle a={feature} />
          <div className="flex flex-col gap-6">
            {rest.slice(0, 3).map((a) => <RowArticle key={a.id} a={a} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureArticle({ a }: { a: Article }) {
  return (
    <article className="overflow-hidden rounded-3xl border bg-card shadow-card">
      {a.image_url && (
        <img src={a.image_url} alt={a.title} className="aspect-[4/3] w-full object-cover" />
      )}
      <div className="p-6">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{a.category}</span>
        <h3 className="mt-4 font-display text-2xl font-extrabold">{a.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
        <a
          href={a.url || "#"}
          target={a.url ? "_blank" : undefined}
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Learn More
        </a>
      </div>
    </article>
  );
}

function RowArticle({ a }: { a: Article }) {
  return (
    <article className="grid grid-cols-[120px_1fr] gap-4">
      {a.image_url ? (
        <img src={a.image_url} alt={a.title} className="aspect-square h-full w-full rounded-2xl object-cover" />
      ) : (
        <div className="aspect-square rounded-2xl bg-gradient-card" />
      )}
      <div>
        <h4 className="font-display text-base font-bold leading-snug">{a.title}</h4>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.read_minutes} min read</span>
          <span>{new Date(a.published_at).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed bg-card/50 p-10 text-center text-sm text-muted-foreground">
      {label} Add some from the <a href="/admin" className="font-semibold text-accent underline">admin panel</a>.
    </div>
  );
}
