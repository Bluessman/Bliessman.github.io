import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Pokeball } from "@/components/pixel-art";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in, go to dashboard
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/dashboard", replace: true });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/admin/dashboard", replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "login"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin/dashboard" } });
    const { error } = await fn;
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(mode === "login" ? "Login berhasil" : "Akun dibuat. Pendaftar pertama otomatis jadi admin.");
  }

  return (
    <div className="min-h-screen mc-scene flex items-center justify-center p-4">
      <div className="pixel-border-lg bg-card p-6 sm:p-8 w-full max-w-md space-y-5 animate-pop">
        <div className="flex items-center gap-3">
          <Pokeball />
          <div>
            <h1 className="font-pixel text-base">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Hanya untuk admin server.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="font-pixel text-[10px] block mb-2 uppercase">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                   className="w-full pixel-border bg-input p-3 outline-none focus:ring-4 focus:ring-grass/40" />
          </label>
          <label className="block">
            <span className="font-pixel text-[10px] block mb-2 uppercase">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                   className="w-full pixel-border bg-input p-3 outline-none focus:ring-4 focus:ring-grass/40" />
          </label>
          <button disabled={loading} className="pixel-btn bg-grass w-full">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                     : <><Shield className="w-4 h-4" /> {mode === "login" ? "Masuk" : "Daftar Admin"}</>}
          </button>
        </form>

        <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-sm underline w-full text-center">
          {mode === "login" ? "Belum punya akun admin? Daftar (pendaftar pertama otomatis jadi admin)" : "Sudah punya akun? Login"}
        </button>

        <a href="/" className="block text-center text-xs text-muted-foreground hover:underline">← Kembali ke beranda</a>
      </div>
    </div>
  );
}
