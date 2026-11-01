import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { inr } from "@/components/ListingCard";

export const Route = createFileRoute("/bookings/$id")({
  head: () => ({
    meta: [
      { title: "Booking Confirmation — NammaVibe" },
      { name: "description", content: "Your NammaVibe booking slip and status." },
      { property: "og:title", content: "Booking Confirmation — NammaVibe" },
      { property: "og:description", content: "Your NammaVibe booking slip and status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { id } = Route.useParams();
  const { data: booking, isLoading } = useQuery({ queryKey: ["booking", id], queryFn: () => api.getBooking(id) });

  if (isLoading) return <main className="mx-auto max-w-2xl px-4 py-16 text-muted-foreground">Loading booking…</main>;
  if (!booking) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Booking not found</h1>
        <Link to="/experiences" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse experiences</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-secondary/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-display text-xl font-bold text-primary">NammaVibe Booking Slip</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${booking.status === "Confirmed" ? "bg-primary text-primary-foreground" : booking.status === "Cancelled" ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"}`}>
            {booking.status.toUpperCase()}
          </span>
        </div>

        <div className="mt-5 flex gap-5">
          <div className="grid h-24 w-24 shrink-0 grid-cols-8 gap-0.5 rounded bg-card p-1.5" aria-label="Decorative QR-style code (demo)">
            {Array.from({ length: 64 }).map((_, i) => <span key={i} className={(i * 5 + i % 4) % 3 ? "bg-foreground" : ""} />)}
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{booking.title}</p>
            <p className="text-muted-foreground">{booking.guestName} · {booking.guests} guest(s)</p>
            <p className="text-muted-foreground">{booking.from}{booking.to !== booking.from && ` → ${booking.to}`}</p>
            <p className="text-muted-foreground">Booking ID: <b className="text-foreground">{booking.id}</b></p>
          </div>
        </div>

        <div className="mt-5 space-y-1.5 border-t border-primary/20 pt-3 text-sm">
          <div className="flex justify-between"><span>Experience subtotal</span><span>{inr(booking.subtotal)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Bengaluru Green Heritage Fund</span><span>{inr(booking.greenFund)}</span></div>
          <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary">{inr(booking.total)}</span></div>
        </div>

        <div className="mt-4 rounded-lg border border-accent bg-card px-3 py-2 text-xs text-muted-foreground">
          <b className="text-foreground">Payment status:</b> {booking.paymentStatus}. This is a demo marketplace — no real transaction has taken place and no money will be collected. Show this slip to your host on arrival.
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link to="/account" className="flex-1 rounded-lg bg-primary py-2.5 text-center font-semibold text-primary-foreground">Go to My Bookings</Link>
        <Link to="/experiences" className="flex-1 rounded-lg border border-border bg-card py-2.5 text-center font-semibold">Keep exploring</Link>
      </div>
    </main>
  );
}
