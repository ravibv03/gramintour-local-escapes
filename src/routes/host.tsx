import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { inr } from "@/components/ListingCard";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      { title: "Host Dashboard — NammaVibe" },
      { name: "description", content: "Manage your Bengaluru experiences, bookings, revenue and payouts." },
      { property: "og:title", content: "Host Dashboard — NammaVibe" },
      { property: "og:description", content: "Manage your Bengaluru experiences, bookings, revenue and payouts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HostDashboard,
});

const field = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function HostDashboard() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({ queryKey: ["bookings"], queryFn: api.listBookings });
  const { data: listings } = useQuery({ queryKey: ["listings", "host"], queryFn: api.listAllListings });
  const { data: payouts } = useQuery({ queryKey: ["payouts"], queryFn: api.listPayouts });

  const [form, setForm] = useState({ title: "", category: "Homestay", location: "", price: "", desc: "" });
  const [photoName, setPhotoName] = useState<string | null>(null);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Confirmed" | "Cancelled" }) => api.setBookingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const addMutation = useMutation({
    mutationFn: () =>
      api.addListing({
        title: form.title,
        category: form.category as "Homestay" | "Local Guides" | "Cultural Workshops",
        location: form.location,
        price: +form.price,
        highlights: form.desc.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3),
        description: form.desc,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      setForm({ title: "", category: "Homestay", location: "", price: "", desc: "" });
      setPhotoName(null);
      toast.success("Experience submitted — it goes live after admin approval");
    },
  });

  const confirmed = bookings?.filter((b) => b.status === "Confirmed") ?? [];
  const requested = bookings?.filter((b) => b.status === "Requested") ?? [];
  const revenue = confirmed.reduce((s, b) => s + b.total, 0);
  const pendingValue = requested.reduce((s, b) => s + b.total, 0);

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoName(file.name);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addMutation.mutate();
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Host Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your Bengaluru experiences at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Total revenue", inr(revenue)],
          ["Pending requests", inr(pendingValue)],
          ["Confirmed bookings", String(confirmed.length)],
          ["Active listings", String(listings?.filter((l) => l.status === "approved").length ?? 0)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="font-display text-2xl font-bold text-primary">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-3">
          <h2 className="mb-4 font-display text-xl font-semibold">Reservations</h2>
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          <div className="space-y-3">
            {(bookings ?? []).map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted p-3 text-sm">
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-muted-foreground">{b.id} · {b.guestName} · {b.guests} guest(s) · {b.from}{b.to !== b.from && ` → ${b.to}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <b>{inr(b.total)}</b>
                  {b.status === "Requested" ? (
                    <>
                      <button onClick={() => statusMutation.mutate({ id: b.id, status: "Confirmed" })} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Accept</button>
                      <button onClick={() => statusMutation.mutate({ id: b.id, status: "Cancelled" })} className="rounded-full border border-destructive/40 px-3 py-1 text-xs font-semibold text-destructive">Decline</button>
                    </>
                  ) : (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${b.status === "Confirmed" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>{b.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">Add New Bangalore Experience</h2>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field}>
            <option value="Homestay">Homestay</option><option value="Local Guides">Local Guide</option><option value="Cultural Workshops">Cultural Workshop</option>
          </select>
          <input required placeholder="Neighborhood, Bengaluru" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} />
          <input required type="number" min={1} placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={field} />
          <textarea required rows={3} placeholder="Highlights, separated by commas" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className={field} />
          <label className="block cursor-pointer rounded-lg border border-dashed border-input p-4 text-center text-sm text-muted-foreground hover:bg-muted">
            <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            {photoName ? `📷 ${photoName} (preview only — uploads arrive with the API)` : "Upload experience photo (preview only)"}
          </label>
          <button disabled={addMutation.isPending} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-50">
            {addMutation.isPending ? "Submitting…" : "Submit for approval"}
          </button>
        </form>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-display text-xl font-semibold">Payout history</h2>
        <div className="space-y-2 text-sm">
          {(payouts ?? []).map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-muted px-4 py-2.5">
              <span>{p.month}</span>
              <div className="flex items-center gap-3">
                <b>{inr(p.amount)}</b>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.status === "Paid" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Demo figures — payouts are processed by the NammaVibe API in the production release.</p>
      </section>
    </main>
  );
}
