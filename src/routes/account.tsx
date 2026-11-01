import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { inr, ListingCard } from "@/components/ListingCard";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — NammaVibe" },
      { name: "description", content: "Your NammaVibe profile, bookings, wishlist and reviews." },
      { property: "og:title", content: "My Account — NammaVibe" },
      { property: "og:description", content: "Your NammaVibe profile, bookings, wishlist and reviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Account,
});

const statusStyle: Record<string, string> = {
  Confirmed: "bg-primary text-primary-foreground",
  Requested: "bg-accent text-accent-foreground",
  Cancelled: "bg-destructive text-destructive-foreground",
};

function Account() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({ queryKey: ["bookings"], queryFn: api.listBookings });
  const { data: wishlist } = useQuery({ queryKey: ["wishlist"], queryFn: api.getWishlist });
  const { data: listings } = useQuery({ queryKey: ["listings", "wishlist"], queryFn: () => api.listListings({}) });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.setBookingStatus(id, "Cancelled"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Cancellation requested — the host has been notified (demo)");
    },
  });

  const mine = bookings?.filter((b) => b.guestName === "Demo Tourist") ?? [];
  const wished = listings?.filter((l) => wishlist?.includes(l.id)) ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Namaste, Demo Tourist</h1>
          <p className="text-sm text-muted-foreground">tourist@nammavibe.demo · Member since June 2026</p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">Demo profile — sign-in arrives with the API release</span>
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold">My bookings</h2>
        {isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading bookings…</p>}
        <div className="mt-3 space-y-3">
          {mine.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="text-muted-foreground">{b.id} · {b.guests} guest(s) · {b.from}{b.to !== b.from && ` → ${b.to}`}</p>
                <p className="text-xs text-muted-foreground">{b.paymentStatus}</p>
              </div>
              <div className="flex items-center gap-3">
                <b>{inr(b.total)}</b>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[b.status]}`}>{b.status}</span>
                <Link to="/bookings/$id" params={{ id: b.id }} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">Slip</Link>
                {b.status !== "Cancelled" && (
                  <button onClick={() => cancelMutation.mutate(b.id)} className="rounded-full border border-destructive/40 px-3 py-1 text-xs font-semibold text-destructive hover:bg-destructive/10">
                    Request cancellation
                  </button>
                )}
              </div>
            </div>
          ))}
          {!isLoading && !mine.length && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No bookings yet. <Link to="/experiences" className="font-semibold text-primary hover:underline">Find an experience →</Link>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">My wishlist</h2>
        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wished.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
        {!wished.length && <p className="mt-3 text-sm text-muted-foreground">Tap the heart on any experience to save it here.</p>}
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">My reviews</h2>
        <div className="mt-3 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
          You haven't written a review yet. After your next experience, share how it went — reviews help hosts and fellow travelers.
        </div>
      </section>
    </main>
  );
}
