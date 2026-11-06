import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Admin() {
  let supabase;
  try { supabase = await createClient(); } catch { redirect("/login"); }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles").select("role").eq("id", user.id).maybeSingle();

  // Do not silently send legitimate admins away. Explain how to repair role setup.
  if (profile?.role !== "admin") {
    return (
      <main className="container page">
        <div className="eyebrow">RESTRICTED AREA · ADMIN</div>
        <h1 className="page-title">ADMIN ACCESS NOT ENABLED</h1>
        <div className="panel" style={{ maxWidth: 760 }}>
          <p className="muted">
            You are signed in as <strong>{user.email}</strong>, but this account’s
            profile role is <strong>{profile?.role ?? "missing"}</strong>.
            The Admin Centre is restricted to accounts with the <code>admin</code> role.
          </p>
          <h2 style={{ fontSize: 22, marginTop: 24 }}>Enable your admin account</h2>
          <p className="muted">Open Supabase → SQL Editor, run this query, then refresh this page:</p>
          <pre style={{ overflowX: "auto", padding: 16, background: "#111", borderRadius: 8 }}>
{`update public.profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = '${user.email ?? "YOUR_SIGNUP_EMAIL"}'
);`}
          </pre>
          {profileError && <p className="muted">Profile lookup detail: {profileError.message}</p>}
          <p className="muted">If the query says “0 rows”, confirm you signed up with this exact email and that your profile exists.</p>
          <Link href="/dashboard" className="btn secondary">Back to dashboard</Link>
        </div>
      </main>
    );
  }

  const [{ count: students }, { count: courses }, { count: enrollments }, { data: courseRows }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("enrollments").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("id,title,game,is_published,created_at").order("created_at", { ascending: false }).limit(8)
  ]);

  return <main className="container page">
    <div className="eyebrow">RESTRICTED AREA · ADMIN</div>
    <h1 className="page-title">COMMAND CENTRE</h1>
    <p className="muted">Manage the academy. Only accounts assigned the admin role can access this page.</p>
    <div className="kpi-grid">
      <div className="kpi"><strong>{students ?? 0}</strong><span>STUDENTS</span></div>
      <div className="kpi"><strong>{courses ?? 0}</strong><span>COURSES</span></div>
      <div className="kpi"><strong>{enrollments ?? 0}</strong><span>ENROLLMENTS</span></div>
    </div>
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 15, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 28 }}>COURSE CATALOGUE</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin/courses" className="btn secondary">Manage all courses</Link>
          <Link href="/admin/courses/new" className="btn">Add course +</Link>
        </div>
      </div>
      <table className="table" style={{ marginTop: 18 }}>
        <thead><tr><th>COURSE</th><th>GAME</th><th>VISIBILITY</th><th>CONTENT</th></tr></thead>
        <tbody>{courseRows?.map(c => <tr key={c.id}><td>{c.title}</td><td>{c.game}</td><td>{c.is_published ? "Published" : "Draft"}</td><td><Link className="btn secondary" href={`/admin/courses/${c.id}/videos`}>Manage videos →</Link></td></tr>)}</tbody>
      </table>
      {!courseRows?.length && <div className="empty">No courses created yet.</div>}
    </div>
  </main>;
}
