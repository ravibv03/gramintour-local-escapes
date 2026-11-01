import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { inr } from "@/components/ListingCard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — NammaVibe" },
      { name: "description", content: "NammaVibe platform administration: users, hosts, listings, bookings and analytics." },
      { property: "og:title", content: "Admin Dashboard — NammaVibe" },
      { property: "og:description", content: "NammaVibe platform administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: api.listUsers });
  const { data: listings } = useQuery({ queryKey: ["listings", "admin"], queryFn: api.listAllListings });
  const { data: bookings } = useQuery({ queryKey: ["bookings"], queryFn: api.listBookings });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => api.verifyHost(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }); toast.success("Host verified"); },
  });
  const approveMutation = useMutation({
    mutationFn: (id: number) => api.approveListing(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["listings"] }); toast.success("Experience approved and live"); },
  });

  const hosts = users?.filter((u) => u.role === "host") ?? [];
  const tourists = users?.filter((u) => u.role === "tourist") ?? [];
  const pendingListings = listings?.filter((l) => l.status === "pending") ?? [];
  const totalVolume = bookings?.reduce((s, b) => (b.status !== "Cancelled" ? s + b.total : s), 0) ?? 0;
  const greenFundTotal = bookings?.reduce((s, b) => (b.status !== "Cancelled" ? s + b.greenFund : s), 0) ?? 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform health, verification and approvals</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Booking volume", inr(totalVolume)],
          ["Green Heritage Fund", inr(greenFundTotal)],
          ["Hosts", String(hosts.length)],
          ["Tourists", String(tourists.length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="font-display text-2xl font-bold text-primary">{v}</p>
          </div>
        ))}
      </div>
      <p className="rounded-lg border border-accent bg-secondary/60 px-3 py-2 text-xs text-secondary-foreground">
        Payment monitoring: all bookings are demo transactions — no real money moves on this build. Live payment metrics appear here once the API launches.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-xl font-semibold">Host verification</h2>
          <div className="space-y-2 text-sm">
            {hosts.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-xl bg-muted px-4 py-2.5">
                <div>
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-xs text-muted-foreground">Joined {h.joinedAt}</p>
                </div>
                {h.verified ? (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Verified</span>
                ) : (
                  <button onClick={() => verifyMutation.mutate(h.id)} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Verify</button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-xl font-semibold">Experience approvals</h2>
          <div className="space-y-2 text-sm">
            {pendingListings.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-xl bg-muted px-4 py-2.5">
                <div>
                  <p className="font-semibold">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.category} · {l.location} · {inr(l.price)}/{l.unit}</p>
                </div>
                <button onClick={() => approveMutation.mutate(l.id)} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Approve</button>
              </div>
            ))}
            {!pendingListings.length && <p className="text-muted-foreground">Nothing waiting for approval. New host submissions appear here.</p>}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-display text-xl font-semibold">User management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Role</th><th className="py-2 pr-4">Joined</th><th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => (
                <tr key={u.id} className="border-b border-border/60">
                  <td className="py-2 pr-4 font-semibold">{u.name}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{u.email}</td>
                  <td className="py-2 pr-4 capitalize">{u.role}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{u.joinedAt}</td>
                  <td className="py-2">{u.verified ? <span className="text-primary">✓ Verified</span> : <span className="text-muted-foreground">Unverified</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-display text-xl font-semibold">All bookings</h2>
        <div className="space-y-2 text-sm">
          {(bookings ?? []).map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted px-4 py-2.5">
              <span><b>{b.id}</b> · {b.title} · {b.guestName}</span>
              <span className="flex items-center gap-3">
                <b>{inr(b.total)}</b>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${b.status === "Confirmed" ? "bg-primary text-primary-foreground" : b.status === "Cancelled" ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"}`}>{b.status}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
