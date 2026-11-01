import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { GREEN_FUND } from "@/lib/mock-data";
import type { Listing } from "@/lib/types";
import { inr } from "./ListingCard";

const today = new Date().toISOString().slice(0, 10);
const nights = (a: string, b: string) => Math.max(1, Math.round((+new Date(b) - +new Date(a)) / 86400000));
const field = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function BookingDialog({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const navigate = useNavigate();
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");

  const multi = listing.category === "Homestay";
  const units = multi ? nights(from, to) : 1;
  const subtotal = listing.price * units * (multi ? 1 : guests);
  const total = subtotal + GREEN_FUND;

  const bookMutation = useMutation({
    mutationFn: () => api.createBooking({ listingId: listing.id, guestName: name, from, to, guests }),
    onSuccess: (booking) => {
      toast.success("Booking request placed — no payment charged (demo)");
      onClose();
      navigate({ to: "/bookings/$id", params: { id: booking.id } });
    },
    onError: () => toast.error("Could not place the booking. Please try again."),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold leading-snug">{listing.title}</h2>
            <p className="text-sm text-muted-foreground">{listing.location}</p>
          </div>
          <button onClick={onClose} className="text-xl text-muted-foreground" aria-label="Close">×</button>
        </div>

        <img src={listing.images[0]} alt={listing.title} width={1024} height={768} className="mt-4 h-40 w-full rounded-xl object-cover" />

        <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); bookMutation.mutate(); }}>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold">{multi ? "Check-in" : "Date"}
              <input type="date" required min={today} value={from} onChange={(e) => { setFrom(e.target.value); if (e.target.value > to) setTo(e.target.value); }} className={field} />
            </label>
            {multi && (
              <label className="text-sm font-semibold">Check-out
                <input type="date" required min={from} value={to} onChange={(e) => setTo(e.target.value)} className={field} />
              </label>
            )}
            <label className="text-sm font-semibold">Guests
              <input type="number" min={1} max={listing.capacity} value={guests} onChange={(e) => setGuests(+e.target.value)} className={field} />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">Up to {listing.capacity} guests · {listing.availableNote}</p>
          <label className="block text-sm font-semibold">Your name
            <input required value={name} onChange={(e) => setName(e.target.value)} className={field} />
          </label>
          <div className="space-y-1.5 rounded-lg bg-muted p-3 text-sm">
            <div className="flex justify-between">
              <span>{inr(listing.price)} × {multi ? `${units} night(s)` : `${guests} guest(s)`}</span>
              <span>{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Bengaluru Green Heritage Fund</span>
              <span>{inr(GREEN_FUND)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1.5 font-bold">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>
          </div>
          <p className="rounded-lg border border-accent bg-secondary/60 px-3 py-2 text-xs text-secondary-foreground">
            Demo checkout: placing this request does not charge any money. Payment will be handled by the NammaVibe API in a future release.
          </p>
          <button disabled={bookMutation.isPending} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-50">
            {bookMutation.isPending ? "Placing request…" : "Request booking (demo)"}
          </button>
        </form>
      </div>
    </div>
  );
}
