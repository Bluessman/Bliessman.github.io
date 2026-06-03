import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MessageCircle, Sparkles, Shield, Swords, Users, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SERVER_CONFIG, whatsappLink } from "@/lib/server-config";
import { Pokeball, Cloud, Creeper, PixelPikachu } from "@/components/pixel-art";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SERVER_CONFIG.serverName} — Daftar Server Minecraft Bertema Pokémon` },
      { name: "description", content: `Daftar member ${SERVER_CONFIG.serverName}, server Minecraft survival bertema Pokémon dengan komunitas seru dan event tiap minggu.` },
      { property: "og:title", content: `${SERVER_CONFIG.serverName} — Server Minecraft x Pokémon` },
      { property: "og:description", content: SERVER_CONFIG.tagline },
      { property: "og:url", content: "https://megatrush.lovable.app/" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/681cad9b-0ba8-49aa-8630-a8b606af20e5/id-preview-d87322b6--808db9de-4a5a-4959-a93d-08cdce3ee352.lovable.app-1780082328771.png" },
    ],
    links: [
      { rel: "canonical", href: "https://megatrush.lovable.app/" },
    ],
  }),
  component: LandingPage,
});

const schema = z.object({
  real_name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  gamertag: z.string().trim().min(2, "Gamertag minimal 2 karakter").max(32),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/, "Nomor WhatsApp harus berupa angka (8-15 digit)"),
  age: z.coerce.number().int().min(8, "Umur minimal 8 tahun").max(99),
  reason: z.string().trim().min(10, "Tulis minimal 10 karakter").max(500),
});

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <RegisterSection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-grass border-b-4 border-foreground">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Creeper className="w-8 h-8" />
          <div>
            <div className="font-pixel text-xs sm:text-sm text-white">{SERVER_CONFIG.serverName}</div>
            <div className="text-xs text-white/80 hidden sm:block">IP: {SERVER_CONFIG.ip}</div>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <a href="#fitur" className="hidden sm:inline-block pixel-btn bg-wood">Fitur</a>
          <a href="#daftar" className="pixel-btn bg-pokered">Daftar</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden mc-scene">
      {/* Drifting clouds */}
      <div className="absolute top-6 left-0 w-32 opacity-90 animate-cloud"><Cloud className="w-32" /></div>
      <div className="absolute top-20 left-0 w-24 opacity-80 animate-cloud" style={{ animationDelay: "-20s", animationDuration: "55s" }}>
        <Cloud className="w-24" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-28 grid md:grid-cols-2 gap-10 items-center relative">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 pixel-border bg-pokeyellow px-3 py-1 font-pixel text-[10px]">
            <Sparkles className="w-3 h-3" /> SEASON BARU DIBUKA
          </span>
          <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl leading-snug text-white drop-shadow-[3px_3px_0_var(--color-border)]">
            PokéCraft Realm — Server Minecraft Survival Pokémon
          </h1>
          <p className="font-pixel text-xs text-white/90">Tangkap. Bangun. Bertualang.</p>
          <p className="text-xl text-white/95 max-w-md drop-shadow-[2px_2px_0_var(--color-border)]">
            Selamat datang di <b>{SERVER_CONFIG.serverName}</b> — {SERVER_CONFIG.tagline}.
            Tangkap monster, bangun base, dan jadi champion!
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#daftar" className="pixel-btn bg-pokered">Daftar Sekarang</a>
            <a href="#fitur" className="pixel-btn bg-wood">Lihat Fitur</a>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="pokeball animate-float" style={{ width: 120, height: 120 }} />
          <div className="absolute -bottom-4 -left-2 animate-wobble">
            <PixelPikachu className="w-20 h-20" />
          </div>
          <div className="absolute -top-2 right-2 animate-float" style={{ animationDelay: "-1.5s" }}>
            <Creeper className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Grass + dirt strip */}
      <div className="h-6 mc-grass-strip border-y-4 border-foreground" />
      <div className="h-8 mc-dirt-strip" />
    </section>
  );
}

function Features() {
  const items = [
    { icon: Swords, title: "PvP & Boss Raid", desc: "Lawan boss legendaris dan duel pemain lain di arena khusus." },
    { icon: Sparkles, title: "Tangkap Monster", desc: "Sistem pokémon-style dengan ratusan monster unik untuk ditangkap." },
    { icon: Shield, title: "Anti Grief", desc: "Land claim & sistem proteksi base aktif 24/7." },
    { icon: Users, title: "Komunitas Aktif", desc: "Discord seru, event mingguan, dan staff responsif." },
  ];
  return (
    <section id="fitur" className="bg-background py-16 border-b-4 border-foreground">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-pixel text-xl sm:text-2xl text-center mb-10">Fitur Server</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((f) => (
            <div key={f.title} className="pixel-border bg-card p-5 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-grass pixel-border flex items-center justify-center mb-3">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-pixel text-[11px] mb-2">{f.title}</div>
              <p className="text-base text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegisterSection() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      real_name: form.get("real_name"),
      gamertag: form.get("gamertag"),
      whatsapp: form.get("whatsapp"),
      age: form.get("age"),
      reason: form.get("reason"),
    });
    if (!parsed.success) {
      const fieldErrs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrs[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrs);
      toast.error("Mohon perbaiki isian formulir");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("registrations").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error("Gagal mengirim: " + error.message);
      return;
    }
    setSuccess(true);
    toast.success("Pendaftaran berhasil dikirim!");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section id="daftar" className="py-16 bg-sky-block border-b-4 border-foreground">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-pixel text-xl sm:text-2xl mb-2">Formulir Pendaftaran</h2>
          <p className="text-lg">Isi semua field di bawah lalu konfirmasi ke admin via WhatsApp.</p>
        </div>

        {success ? (
          <SuccessPanel onReset={() => setSuccess(false)} />
        ) : (
          <form onSubmit={handleSubmit} className="pixel-border-lg bg-card p-6 sm:p-8 space-y-5 animate-pop">
            <Field label="Nama Asli" name="real_name" error={errors.real_name} />
            <Field label="Gamertag Minecraft" name="gamertag" error={errors.gamertag} />
            <Field
              label="Nomor WhatsApp (contoh: 6281234567890)"
              name="whatsapp"
              inputMode="numeric"
              pattern="\d*"
              error={errors.whatsapp}
            />
            <Field label="Umur" name="age" type="number" min={1} max={99} error={errors.age} />
            <Field label="Alasan Ingin Join Server" name="reason" textarea error={errors.reason} />

            <button
              type="submit"
              disabled={submitting}
              className="pixel-btn bg-grass w-full disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
              ) : (
                <><Send className="w-4 h-4" /> Kirim Pendaftaran</>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", textarea, error, ...rest
}: { label: string; name: string; type?: string; textarea?: boolean; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  return (
    <div className="block">
      <label htmlFor={fieldId} className="font-pixel text-[10px] block mb-2 uppercase">{label}</label>
      {textarea ? (
        <textarea
          id={fieldId}
          name={name}
          rows={4}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-full pixel-border bg-input p-3 outline-none focus:ring-4 focus:ring-grass/40"
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-full pixel-border bg-input p-3 outline-none focus:ring-4 focus:ring-grass/40"
          {...rest}
        />
      )}
      {error && <span id={errorId} className="text-destructive text-sm mt-1 block">⚠ {error}</span>}
    </div>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  const url = whatsappLink(SERVER_CONFIG.adminWhatsApp, SERVER_CONFIG.whatsappTemplate);
  return (
    <div className="pixel-border-lg bg-card p-6 sm:p-8 text-center space-y-5 animate-pop">
      <div className="flex justify-center"><Pokeball className="animate-wobble" /></div>
      <h3 className="font-pixel text-base sm:text-lg">Pendaftaran Berhasil!</h3>
      <p className="text-lg">
        Pendaftaran berhasil dikirim. Silakan hubungi admin untuk proses konfirmasi agar bisa masuk ke server.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={url} target="_blank" rel="noreferrer" className="pixel-btn bg-grass">
          <MessageCircle className="w-4 h-4" /> Konfirmasi ke Admin
        </a>
        <button onClick={onReset} className="pixel-btn bg-wood">Daftar Lagi</button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-wood text-white py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-6">
        <div>
          <div className="font-pixel text-xs mb-3">{SERVER_CONFIG.serverName}</div>
          <p className="text-sm opacity-90">{SERVER_CONFIG.tagline}</p>
        </div>
        <div>
          <div className="font-pixel text-[10px] mb-3 uppercase">Kontak Admin</div>
          <a href={whatsappLink(SERVER_CONFIG.adminWhatsApp, SERVER_CONFIG.whatsappTemplate)}
             target="_blank" rel="noreferrer"
             className="text-sm hover:underline flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> WhatsApp {SERVER_CONFIG.adminWhatsAppDisplay}
          </a>
        </div>
        <div>
          <div className="font-pixel text-[10px] mb-3 uppercase">Sosial Media</div>
          <ul className="space-y-1 text-sm">
            <li><a href={SERVER_CONFIG.socials.discord} className="hover:underline">Discord</a></li>
            <li><a href={SERVER_CONFIG.socials.instagram} className="hover:underline">Instagram</a></li>
            <li><a href={SERVER_CONFIG.socials.youtube} className="hover:underline">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs opacity-70 mt-8">
        © {new Date().getFullYear()} {SERVER_CONFIG.serverName}. <a href="/admin/login" className="underline">Admin</a>
      </div>
    </footer>
  );
}
