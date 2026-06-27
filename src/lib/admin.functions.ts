import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type GateSession = { unlocked?: boolean };

function getSessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password) throw new Error("ADMIN_SESSION_SECRET is not set");
  return {
    password,
    name: "faraz-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function passwordMatches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<GateSession>(getSessionConfig());
  if (!session.data.unlocked) throw new Error("Forbidden");
}

type Table = "jobs" | "companies" | "scholarships" | "articles" | "testimonials";
const TABLES: Table[] = ["jobs", "companies", "scholarships", "articles", "testimonials"];

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD is not set");
    if (!passwordMatches(data.password, expected)) {
      return { ok: false as const };
    }
    const session = await useSession<GateSession>(getSessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(getSessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(getSessionConfig());
  return { unlocked: !!session.data.unlocked };
});

export const adminUpsert = createServerFn({ method: "POST" })
  .inputValidator((data: { table: Table; row: Record<string, unknown> }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!TABLES.includes(data.table)) throw new Error("Invalid table");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...rest } = data.row as { id?: string } & Record<string, unknown>;
    const query = id
      ? supabaseAdmin.from(data.table).update(rest as never).eq("id", id).select().single()
      : supabaseAdmin.from(data.table).insert(rest as never).select().single();
    const { data: result, error } = await query;
    if (error) throw new Error(error.message);
    return result;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .inputValidator((data: { table: Table; id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!TABLES.includes(data.table)) throw new Error("Invalid table");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
