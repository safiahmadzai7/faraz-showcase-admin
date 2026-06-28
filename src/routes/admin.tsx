import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  adminLogin, adminLogout, adminStatus, adminUpsert, adminDelete, adminUploadImage,
} from "@/lib/admin.functions";
import {
  fetchJobs, fetchCompanies, fetchScholarships, fetchArticles, fetchTestimonials,
} from "@/lib/content";
import { LogOut, Plus, Trash2, Pencil, ArrowLeft, Upload, ImageIcon, X } from "lucide-react";
import { BrandMark } from "@/components/site-chrome";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Project Faraz" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

/* ---------- Field definitions per table ---------- */
type FieldType = "text" | "textarea" | "number" | "date" | "checkbox" | "tags" | "image" | "url";
type FieldDef = { key: string; label: string; type?: FieldType; required?: boolean; placeholder?: string };
type TableKey = "jobs" | "companies" | "scholarships" | "articles" | "testimonials";

const SCHEMAS: Record<TableKey, { label: string; fetch: () => Promise<any[]>; fields: FieldDef[]; primary: string; secondary?: string; thumb?: string }> = {
  jobs: {
    label: "Jobs",
    fetch: fetchJobs,
    primary: "title",
    secondary: "company",
    thumb: "logo_url",
    fields: [
      { key: "title", label: "Job Title", required: true, placeholder: "Senior Product Designer" },
      { key: "company", label: "Company", required: true, placeholder: "Spotify" },
      { key: "logo_url", label: "Company Logo / Photo", type: "image" },
      { key: "location", label: "Location", required: true, placeholder: "Remote · Lahore, PK" },
      { key: "job_type", label: "Job Type", required: true, placeholder: "Full-time, Part-time, Contract" },
      { key: "category", label: "Category", required: true, placeholder: "UI/UX, Sales, Engineering" },
      { key: "industry", label: "Industry", placeholder: "Technology" },
      { key: "salary", label: "Salary", placeholder: "$400/monthly" },
      { key: "apply_url", label: "Apply URL (optional)", type: "url", placeholder: "https://…" },
      { key: "description", label: "Job Description (optional)", type: "textarea", placeholder: "What is the role about?" },
      { key: "who_can_apply", label: "Who can apply (optional)", type: "textarea", placeholder: "Eligibility / who this role is for" },
      { key: "requirements", label: "Requirements (optional)", type: "textarea", placeholder: "Skills, experience, qualifications" },
      { key: "benefits", label: "Benefits / Perks (optional)", type: "textarea" },
      { key: "how_to_apply", label: "How to apply (optional)", type: "textarea", placeholder: "Steps to apply, documents needed, email…" },
      { key: "featured", label: "Featured on homepage", type: "checkbox" },
    ],
  },
  companies: {
    label: "Top Companies",
    fetch: fetchCompanies,
    primary: "name",
    thumb: "logo_url",
    fields: [
      { key: "name", label: "Company Name", required: true },
      { key: "logo_url", label: "Logo / Cover Photo", type: "image" },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "tags", label: "Tags (comma separated)", type: "tags" },
    ],
  },
  scholarships: {
    label: "Scholarships",
    fetch: fetchScholarships,
    primary: "title",
    secondary: "organization",
    thumb: "logo_url",
    fields: [
      { key: "title", label: "Scholarship Title", required: true },
      { key: "organization", label: "Organization", required: true, placeholder: "Chevening / UK Government" },
      { key: "logo_url", label: "Photo / Cover", type: "image" },
      { key: "country", label: "Country", required: true, placeholder: "United Kingdom" },
      { key: "amount", label: "Amount / Value", placeholder: "Fully funded" },
      { key: "level", label: "Level", required: true, placeholder: "Undergraduate, Masters, PhD" },
      { key: "deadline", label: "Deadline", type: "date" },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "tags", label: "Tags (comma separated)", type: "tags" },
      { key: "apply_url", label: "Apply URL (shown as Apply now button)", type: "url", placeholder: "https://…" },
      { key: "who_can_apply", label: "Who can apply (optional)", type: "textarea", placeholder: "Eligibility criteria" },
      { key: "requirements", label: "Requirements (optional)", type: "textarea", placeholder: "Documents, grades, language tests…" },
      { key: "benefits", label: "Benefits (optional)", type: "textarea", placeholder: "What does it cover?" },
      { key: "how_to_apply", label: "How to apply (optional)", type: "textarea", placeholder: "Step-by-step instructions" },
    ],
  },

  articles: {
    label: "Blog Articles",
    fetch: fetchArticles,
    primary: "title",
    secondary: "category",
    thumb: "image_url",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { key: "image_url", label: "Cover Image", type: "image" },
      { key: "category", label: "Category", required: true, placeholder: "News, Interview, Guide" },
      { key: "read_minutes", label: "Read minutes", type: "number" },
      { key: "url", label: "Article URL", type: "url" },
    ],
  },
  testimonials: {
    label: "Testimonials",
    fetch: fetchTestimonials,
    primary: "name",
    secondary: "company",
    thumb: "avatar_url",
    fields: [
      { key: "name", label: "Person Name", required: true },
      { key: "role", label: "Role / Title", required: true },
      { key: "company", label: "Company", required: true },
      { key: "avatar_url", label: "Photo", type: "image" },
      { key: "quote", label: "Quote", type: "textarea", required: true },
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
        <div className="mt-4">
          <BrandMark size={56} />
          <p className="mt-3 text-xs text-muted-foreground">Enter admin password to continue</p>
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
          <Link to="/" className="flex items-center gap-3">
            <BrandMark size={40} />
            <span className="hidden text-sm text-muted-foreground sm:inline">/ Admin</span>
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
        <p className="mt-1 text-muted-foreground">Add, edit, upload photos and delete content shown on the site.</p>

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
    // Validate required
    for (const f of schema.fields) {
      if (f.required) {
        const v = row[f.key];
        if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
          toast.error(`${f.label} is required`);
          return;
        }
      }
    }
    const cleaned: Record<string, any> = {};
    Object.entries(row).forEach(([k, v]) => {
      // Skip image_url-style key when table doesn't have it (scholarships)
      if (table === "scholarships" && k === "logo_url") return;
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

  // Filter fields - hide logo_url for scholarships since table doesn't have that column
  const visibleFields = useMemo(() => {
    if (table === "scholarships") return schema.fields.filter((f) => f.key !== "logo_url");
    return schema.fields;
  }, [table, schema]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_440px]">
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
                <div className="flex min-w-0 items-center gap-3">
                  {schema.thumb && (
                    row[schema.thumb] ? (
                      <img src={row[schema.thumb]} alt="" className="h-10 w-10 rounded-xl object-cover" />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{row[schema.primary]}</div>
                    {schema.secondary && (
                      <div className="truncate text-xs text-muted-foreground">{row[schema.secondary]}</div>
                    )}
                  </div>
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

      <div className="rounded-3xl border bg-card p-6 shadow-card lg:sticky lg:top-24 lg:self-start">
        <h3 className="font-display text-lg font-bold">{editing?.id ? "Edit" : "New"} {schema.label.replace(/s$/, "")}</h3>
        {!editing ? (
          <p className="mt-3 text-sm text-muted-foreground">Pick an item to edit, or click New to add one.</p>
        ) : (
          <Form fields={visibleFields} value={editing} onChange={setEditing} onSubmit={save} onCancel={() => setEditing(null)} />
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
      className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1"
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
  const labelEl = (
    <span className="mb-1 block font-medium">
      {f.label}{f.required && <span className="ml-1 text-destructive">*</span>}
    </span>
  );

  if (f.type === "image") {
    return (
      <div className="block text-sm">
        {labelEl}
        <ImageField value={v} onChange={onChange} />
      </div>
    );
  }
  if (f.type === "textarea") {
    return (
      <label className="block text-sm">
        {labelEl}
        <textarea rows={4} required={f.required} placeholder={f.placeholder} className={base} value={v ?? ""} onChange={(e) => onChange(e.target.value)} />
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
        {labelEl}
        <input className={base} value={text} placeholder="e.g. UI/UX, Sales, Marketing"
          onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
      </label>
    );
  }
  return (
    <label className="block text-sm">
      {labelEl}
      <input
        className={base}
        type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
        required={f.required}
        placeholder={f.placeholder}
        value={v ?? ""}
        onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </label>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const upload = useServerFn(adminUploadImage);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      // Convert to base64
      let binary = "";
      const bytes = new Uint8Array(buf);
      const CHUNK = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
      }
      const base64 = btoa(binary);
      const r = await upload({ data: { name: file.name, contentType: file.type || "image/png", base64 } });
      onChange(r.url);
      toast.success("Photo uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <img src={value} alt="" className="h-36 w-full rounded-xl border object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/90 shadow"
            aria-label="Remove photo"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-gradient-soft text-muted-foreground transition hover:border-accent hover:text-accent disabled:opacity-60"
        >
          <Upload className="h-5 w-5" />
          <span className="text-xs font-semibold">{busy ? "Uploading…" : "Click to upload photo"}</span>
          <span className="text-[10px]">PNG, JPG up to 5MB</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-semibold text-accent"
        >
          Replace photo
        </button>
      )}
    </div>
  );
}
