 "use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [name,setName]=useState("");
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage("");
    try {
      const supabase=createClient();
      if(mode==="signup"){
        const {error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name}}});
        if(error) throw error;
        setMessage("Account created. Check your email to confirm your address, then sign in.");
      } else {
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error) throw error;
        router.push("/dashboard");router.refresh();
      }
    } catch(err){setMessage(err instanceof Error?err.message:"Something went wrong.");}
    finally{setBusy(false);}
  }
  return <form className="form" onSubmit={submit}>
    {mode==="signup"&&<label className="field">Gamer name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your display name"/></label>}
    <label className="field">Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
    <label className="field">Password<input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/></label>
    {message&&<div className="notice">{message}</div>}
    <button className="btn" disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign in":"Create account"}</button>
  </form>;
}