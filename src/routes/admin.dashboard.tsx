import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, LogOut, Trash2, Check, X, RotateCcw, MessageCircle, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  listRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  checkIsAdmin,
} from "@/lib/admin.functions";
import { SERVER_CONFIG, whatsappLink } from "@/lib/server-config";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

type Reg = {
  id: string;
  real_name: string;
  gamertag: string;
  whatsapp: string;
  age: number;
  reason: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [ready, setReady] = useState(false);

  const fetchList = useServerFn(listRegistrations);
  const fetchAdmin = useServerFn(checkIsAdmin);
  const updateFn = useServerFn(updateRegistrationStatus);
  const deleteFn = useServerFn(deleteRegistration);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) { navigate({ to: "/admin/login", replace: true }); return; }
      try {
        const res = await fetchAdmin();
        if (!res.isAdmin) {
          await supabase.auth.signOut();
          toast.error("Akun ini bukan admin. Silakan login dengan akun admin.");
          navigate({ to: "/admin/login", replace: true });
          return;
        }
        if (mounted) setReady(true);
      } catch {
        await supabase.auth.signOut();
        toast.error("Gagal memverifikasi admin. Silakan login ulang.");
        navigate({ to: "/admin/login", replace: true });
      }
    })();
    return () => { mounted = false; };
  }, [navigate, fetchAdmin]);

  const { data, isLoading, refetch } = useQuery<Reg[]>({
    queryKey: ["registrations"],
    queryFn: () => fetchList() as any,
    enabled: ready,
  });

  const [detail, setDetail] = useState<Reg | null>(null);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  async function setStatus(id: string, status: Reg["status"]) {
    try {
      await updateFn({ data: { id, status } });
      toast.success("Status diperbarui");
      qc.invalidateQueries({ queryKey: ["registrations"] });
    } catch (e: any) { toast.error(e.message); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus pendaftaran ini?")) return;
    try {
      await deleteFn({ data: { id } });
      toast.success("Data dihapus");
      qc.invalidateQueries({ queryKey: ["registrations"] });
    } catch (e: any) { toast.error(e.message); }
  }

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  const list = data ?? [];
  const counts = {
    pending: list.filter(r => r.status === "pending").length,
    accepted: list.filter(r => r.status === "accepted").length,
    rejected: list.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-grass border-b-4 border-foreground">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-pixel text-xs sm:text-sm text-white">⚒ ADMIN — {SERVER_CONFIG.serverName}</div>
          <div className="flex gap-2">
            <Link to="/" className="pixel-btn bg-wood">Beranda</Link>
            <button onClick={handleLogout} className="pixel-btn bg-pokered"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Pending" value={counts.pending} color="bg-pokeyellow" />
          <StatCard label="Diterima" value={counts.accepted} color="bg-grass" />
          <StatCard label="Ditolak" value={counts.rejected} color="bg-pokered" />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-pixel text-base">Daftar Pendaftar</h2>
          <button onClick={() => refetch()} className="pixel-btn bg-wood"><RotateCcw className="w-4 h-4" /> Refresh</button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : list.length === 0 ? (
          <div className="pixel-border bg-card p-10 text-center text-muted-foreground">Belum ada pendaftar.</div>
        ) : (
          <div className="pixel-border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left font-pixel text-[10px] uppercase">
                  <th className="p-3">Nama</th>
                  <th className="p-3">Gamertag</th>
                  <th className="p-3 hidden md:table-cell">WA</th>
                  <th className="p-3 hidden sm:table-cell">Umur</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className="border-t-2 border-foreground/20 hover:bg-muted/50">
                    <td className="p-3 font-medium">{r.real_name}</td>
                    <td className="p-3">{r.gamertag}</td>
                    <td className="p-3 hidden md:table-cell">{r.whatsapp}</td>
                    <td className="p-3 hidden sm:table-cell">{r.age}</td>
                    <td className="p-3"><StatusBadge status={r.status} /></td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-end flex-wrap">
                        <button onClick={() => setDetail(r)} title="Detail" className="pixel-btn bg-wood !px-2 !py-2"><Eye className="w-3 h-3" /></button>
                        <button onClick={() => setStatus(r.id, "accepted")} title="Terima" className="pixel-btn bg-grass !px-2 !py-2"><Check className="w-3 h-3" /></button>
                        <button onClick={() => setStatus(r.id, "rejected")} title="Tolak" className="pixel-btn bg-pokered !px-2 !py-2"><X className="w-3 h-3" /></button>
                        <button onClick={() => handleDelete(r.id)} title="Hapus" className="pixel-btn bg-destructive !px-2 !py-2"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {detail && <DetailModal reg={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`pixel-border p-4 ${color}`}>
      <div className="font-pixel text-[10px] uppercase">{label}</div>
      <div className="font-pixel text-2xl mt-2">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Reg["status"] }) {
  const map = {
    pending: "bg-pokeyellow",
    accepted: "bg-grass",
    rejected: "bg-pokered",
  } as const;
  return <span className={`pixel-border px-2 py-1 font-pixel text-[9px] uppercase ${map[status]}`}>{status}</span>;
}

function DetailModal({ reg, onClose }: { reg: Reg; onClose: () => void }) {
  const url = whatsappLink(reg.whatsapp, `Halo ${reg.real_name}, terkait pendaftaran kamu di ${SERVER_CONFIG.serverName}...`);
  return (
    <div className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4 animate-pop" onClick={onClose}>
      <div className="pixel-border-lg bg-card p-6 max-w-lg w-full space-y-3" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-pixel text-sm">Detail Pendaftar</h3>
        <Row label="Nama Asli" value={reg.real_name} />
        <Row label="Gamertag" value={reg.gamertag} />
        <Row label="WhatsApp" value={reg.whatsapp} />
        <Row label="Umur" value={String(reg.age)} />
        <Row label="Status" value={reg.status} />
        <Row label="Tanggal" value={new Date(reg.created_at).toLocaleString("id-ID")} />
        <div>
          <div className="font-pixel text-[10px] uppercase mb-1">Alasan</div>
          <div className="pixel-border p-3 bg-input whitespace-pre-wrap">{reg.reason}</div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <a href={url} target="_blank" rel="noreferrer" className="pixel-btn bg-grass"><MessageCircle className="w-4 h-4" /> Chat WA</a>
          <button onClick={onClose} className="pixel-btn bg-wood">Tutup</button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm border-b border-foreground/10 pb-1">
      <span className="font-pixel text-[10px] uppercase opacity-70">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
