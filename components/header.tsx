import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  let user = null;
  try { const supabase = await createClient(); const { data } = await supabase.auth.getUser(); user = data.user; } catch {}
  return <header className="container nav">
    <Link href="/" className="brand"><span className="brand-mark"><span>Λ</span></span> LEVIATHAN</Link>
    <nav className="navlinks"><Link href="/games">Games</Link><Link href="/courses">Coaching</Link><Link href="/#features">Why Leviathan</Link></nav>
    <Link className="btn" href={user ? "/dashboard" : "/login"}>{user ? "My dashboard" : "Join the academy"}</Link>
  </header>;
}