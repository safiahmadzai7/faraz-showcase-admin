import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/project-faraz-logo.png.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Find a Job" },
  { to: "/scholarships", label: "Scholarships" },
  { to: "/companies", label: "Companies" },
  { to: "/blog", label: "Blog" },
];

export function BrandMark({ size = 44, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={logoAsset.url}
        alt="Project Faraz"
        width={size}
        height={size}
        className="rounded-xl shadow-card"
        style={{ width: size, height: size, objectFit: "cover" }}
      />
      {withWordmark && (
        <span className="leading-tight">
          <span className="block font-display text-base font-extrabold tracking-tight text-accent">
            PROJECT FARAZ
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            The Standard for Growth
          </span>
        </span>
      )}
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/"><BrandMark size={40} /></Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/admin"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Admin
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-gradient-soft">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-hero p-8 shadow-pop md:p-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
                Transforming the Way you Find Opportunities
              </h2>
              <p className="mt-3 max-w-md text-foreground/70">
                Stop searching, start discovering. Let the right job or scholarship come to you.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-full bg-white p-2 shadow-card"
            >
              <input
                type="email"
                placeholder="Enter your mail"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
              />
              <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-4">
          <div>
            <BrandMark size={48} />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Connecting you with career opportunities, scholarships and trusted employers worldwide.
            </p>
            <a href="tel:0789350280" className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground">
              📞 0789350280
            </a>
          </div>
          <FooterCol title="Discover" items={["Find Jobs", "Browse Scholarships", "Top Companies", "Career Advice"]} />
          <FooterCol title="Employers" items={["Post Jobs", "Source Talent", "Advertising", "Hiring Events"]} />
          <FooterCol title="Contact" items={["📞 0789350280", "About Us", "Work at Faraz", "Contact Us"]} />
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Project Faraz. All rights reserved. · Call us: <a href="tel:0789350280" className="font-semibold text-foreground hover:text-accent">0789350280</a>
        </div>

      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-display text-base font-bold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
