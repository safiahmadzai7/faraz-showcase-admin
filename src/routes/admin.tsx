import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  adminLogin, adminLogout, adminStatus, adminUpsert, adminDelete,
} from "@/lib/admin.functions";
import {
  fetchJobs, fetchCompanies, fetchScholarships, fetchArticles, fetchTestimonials,
} from "@/lib/content";
import { Link } from "@tanstack/react-router";
import { LogOut, Plus, Trash2, Pencil, ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Project Faraz" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

/* ---------- Field definitions per table ---------- */
type FieldDef = { key: string; label: string; type?: "text" | "textarea" | "number" | "date" | "checkbox" | "tags" };
type TableKey = "jobs" | "companies" | "scholarships" | "articles" | "testimonials";

const SCHEMAS: Record<TableKey, { label: string; fetch: () => Promise<any[]>; fields: FieldDef[]; primary: string; secondary?: string }> = {
  jobs: {
    label: "Jobs",
    fetch: fetchJobs,
    primary: "title",
    secondary: "company",
    fields: [
      { key: "title", label: "Job Title" },
      { key: "company", label: "Company" },
      { key: "logo_url", label: "Company Logo URL" },
      { key: "location", label: "Location" },
      { key: "job_type", label: "Job Type (Full-time, Part-time…)" },
      { key: "category", label: "Category (UI/UX, Sales…)" },
      { key: "industry", label: "Industry" },
      { key: "salary", label: "Salary (e.g. $400/monthly)" },
      { key: "apply_url", label: "Apply URL" },
      { key: "featured", label: "Featured", type: "checkbox" },
    ],
  },
  companies: {
    label: "Top Companies",
    fetch: fetchCompanies,
    primary: "name",
    fields: [
      { key: "name", label: "Company Name" },
      { key: "logo_url", label: "Logo URL" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "tags", label: "Tags (comma separated)", type: "tags" },
    ],
  },
  scholarships: {
    label: "Scholarships",
    fetch: fetchScholarships,
    primary: "title",
    secondary: "organization",
    fields: [
      { key: "title", label: "Scholarship Title" },
      { key: "organization", label: "Organization" },
      { key: "country", label: "Country" },
      { key: "amount", label: "Amount / Value" },
      { key: "level", label: "Level (Undergraduate, Masters…)" },
      { key: "deadline", label: "Deadline", type: "date" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "tags", label: "Tags (comma separated)", type: "tags" },
      { key: "apply_url", label: "Apply URL" },
    ],
  },
  articles: {
    label: "Blog Articles",
    fetch: fetchArticles,
    primary: "title",
    secondary: "category",
    fields: [
      { key: "title", label: "Title" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "image_url", label: "Image URL" },
      { key: "category", label: "Category (News, Interview…)" },
      { key: "read_minutes", label: "Read minutes", type: "number" },
      { key: "url", label: "Article URL" },
    ],
  },
  testimonials: {
    label: "Testimonials",
    fetch: fetchTestimonials,
    primary: "name",
    secondary: "company",
    fields: [
      { key: "name", label: "Person Name" },
      { key: "role", label: "Role / Title" },
      { key: "company", label: "Company" },
      { key: "avatar_url", label: "Avatar URL" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "rating", label: "Rating (1-5)", type: "number" },
    ],
  },
};

const ORDER: TableKey[] = ["jobs", "companies", "scholarships", "articles", "testimonials"];

function AdminPage() {
  const status = useServerFn(adminStatus);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    status().then((s) => setUnlocked(s.unlocked)).catch(() => setUnlocked(false));
  }, [status]);

  if (unlocked === null) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!unlocked) return <Login onUnlocked={() => setUnlocked(true)} />;
  return <Dashboard onLock={() => setUnlocked(false)} />;
}

/* ---------- Login ---------- */
function Login({ onUnlocked }: { onUnlocked: () => void }) {
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await login({ data: { password } });
      if (r.ok) { toast.success("Welcome, admin"); onUnlocked(); }
      else toast.error("Incorrect password");
    } catch { toast.error("Login failed"); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-soft px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-pop">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold">Project Faraz Admin</h1>
            <p className="text-xs text-muted-foreground">Enter admin password to continue</p>
          </div>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="mt-6 w-full rounded-full border px-4 py-3 text-sm outline-none focus:border-accent"
          autoFocus
        />
        <button
          disabled={busy || !password}
          className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard({ onLock }: { onLock: () => void }) {
  const logout = useServerFn(adminLogout);
  const [active, setActive] = useState<TableKey>("jobs");

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            Project Faraz <span className="text-muted-foreground">/ Admin</span>
          </Link>
          <button
            onClick={async () => { await logout(); toast.success("Locked"); onLock(); }}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
          >
            <LogOut className="h-4 w-4" /> Lock
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold">Content Manager</h1>
        <p className="mt-1 text-muted-foreground">Add, edit and delete content shown on the site.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {ORDER.map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === k ? "bg-primary text-primary-foreground" : "bg-card border"
              }`}
            >
              {SCHEMAS[k].label}
            </button>
          ))}
        </div>

        <ResourceManager key={active} table={active} />
      </div>
    </div>
  );
}

/* ---------- Resource manager (list + form per table) ---------- */
function ResourceManager({ table }: { table: TableKey }) {
  const schema = SCHEMAS[table];
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: [table], queryFn: schema.fetch });
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);

  const empty = useMemo(() => {
    const o: Record<string, any> = {};
    schema.fields.forEach((f) => { o[f.key] = f.type === "checkbox" ? false : f.type === "tags" ? [] : ""; });
    return o;
  }, [schema]);

  async function save(row: Record<string, any>) {
    // strip empty strings for nullable fields
    const cleaned: Record<string, any> = {};
    Object.entries(row).forEach(([k, v]) => {
      if (v === "" || v === null || (Array.isArray(v) && v.length === 0)) return;
      cleaned[k] = v;
    });
    if (row.id) cleaned.id = row.id;
    try {
      await upsert({ data: { table, row: cleaned } });
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: [table] });
    } catch (e: any) { toast.error(e.message ?? "Save failed"); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await del({ data: { table, id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [table] });
    } catch (e: any) { toast.error(e.message ?? "Delete failed"); }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="rounded-3xl border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{schema.label}</h2>
          <button
            onClick={() => setEditing({ ...empty })}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New
          </button>
        </div>

        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No entries yet — click New to add one.</p>
        ) : (
          <ul className="divide-y">
            {data.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{row[schema.primary]}</div>
                  {schema.secondary && (
                    <div className="truncate text-xs text-muted-foreground">{row[schema.secondary]}</div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => setEditing({ ...empty, ...row })} className="rounded-full border p-2"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(row.id)} className="rounded-full border p-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-card">
        <h3 className="font-display text-lg font-bold">{editing?.id ? "Edit" : "New"} {schema.label.replace(/s$/, "")}</h3>
        {!editing ? (
          <p className="mt-3 text-sm text-muted-foreground">Pick an item to edit, or click New to add one.</p>
        ) : (
          <Form fields={schema.fields} value={editing} onChange={setEditing} onSubmit={save} onCancel={() => setEditing(null)} />
        )}
      </div>
    </div>
  );
}

function Form({
  fields, value, onChange, onSubmit, onCancel,
}: {
  fields: FieldDef[];
  value: Record<string, any>;
  onChange: (v: Record<string, any>) => void;
  onSubmit: (v: Record<string, any>) => void | Promise<void>;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}
      className="mt-4 space-y-3"
    >
      {fields.map((f) => (
        <Field key={f.key} f={f} v={value[f.key]} onChange={(nv) => onChange({ ...value, [f.key]: nv })} />
      ))}
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Save</button>
        <button type="button" onClick={onCancel} className="rounded-full border px-4 py-2.5 text-sm font-semibold">Cancel</button>
      </div>
    </form>
  );
}

function Field({ f, v, onChange }: { f: FieldDef; v: any; onChange: (v: any) => void }) {
  const base = "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-accent";
  if (f.type === "textarea") {
    return (
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{f.label}</span>
        <textarea rows={4} className={base} value={v ?? ""} onChange={(e) => onChange(e.target.value)} />
      </label>
    );
  }
  if (f.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!v} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded" />
        <span>{f.label}</span>
      </label>
    );
  }
  if (f.type === "tags") {
    const text = Array.isArray(v) ? v.join(", ") : "";
    return (
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{f.label}</span>
        <input className={base} value={text} placeholder="e.g. UI/UX, Sales, Marketing"
          onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
      </label>
    );
  }
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{f.label}</span>
      <input
        className={base}
        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
        value={v ?? ""}
        onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </label>
  );
}
