import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { BookingDialog } from "@/components/BookingDialog";
import { inr } from "@/components/ListingCard";

export const Route = createFileRoute("/experiences/$id")({
  head: () => ({
    meta: [
      { title: "Experience Details — NammaVibe Bengaluru" },
      { name: "description", content: "Photos, host details, reviews and booking for this Bengaluru experience." },
      { property: "og:title", content: "Experience Details — NammaVibe Bengaluru" },
      { property: "og:description", content: "Book this authentic Bengaluru experience directly from a local host." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExperienceDetails,
});

function ExperienceDetails() {
  const { id } = Route.useParams();
  const listingId = Number(id);
  const [imgIndex, setImgIndex] = useState(0);
  const [booking, setBooking] = useState(false);

  const { data: listing, isLoading, isError } = useQuery({ queryKey: ["listing", listingId], queryFn: () => api.getListing(listingId) });
  const { data: reviews } = useQuery({ queryKey: ["reviews", listingId], queryFn: () => api.listReviews(listingId), enabled: !!listing });

  if (isLoading) return <main className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">Loading experience…</main>;
  if (isError || !listing) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Experience not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed or the link is wrong.</p>
        <Link to="/experiences" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse experiences</Link>
      </main>
    );
  }

  const currentImg = listing.images[imgIndex] ?? listing.images[0]!;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/experiences" className="text-sm font-semibold text-primary hover:underline">← All experiences</Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <img src={currentImg} alt={listing.title} width={1024} height={768} className="h-80 w-full rounded-2xl object-cover" />
          <div className="mt-3 flex gap-3">
            {listing.images.map((src, i) => (
              <button key={src + i} onClick={() => setImgIndex(i)} className={`overflow-hidden rounded-xl border-2 ${i === imgIndex ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt={`${listing.title} photo ${i + 1}`} width={1024} height={768} loading="lazy" className="h-16 w-24 object-cover" />
              </button>
            ))}
          </div>

          <h1 className="mt-6 font-display text-3xl font-bold">{listing.title}</h1>
          <p className="mt-1 text-muted-foreground">{listing.location} · ★ {listing.rating} ({listing.reviewsCount} reviews)</p>
          {listing.verified && <span className="mt-2 inline-block rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">✓ Verified by NammaVibe</span>}

          <p className="mt-5 leading-relaxed">{listing.description}</p>

          <h2 className="mt-6 font-display text-xl font-semibold">Highlights</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {listing.highlights.map((h) => <li key={h} className="flex items-start gap-2"><span className="mt-0.5 text-primary">•</span>{h}</li>)}
          </ul>

          <h2 className="mt-6 font-display text-xl font-semibold">Location</h2>
          <div className="mt-2 flex h-40 items-center justify-center rounded-2xl border border-border bg-muted text-sm text-muted-foreground">
            Map of {listing.area}, Bengaluru — interactive map arrives with the API release
          </div>

          <h2 className="mt-6 font-display text-xl font-semibold">Reviews</h2>
          <div className="mt-3 space-y-3">
            {(reviews ?? []).map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4 text-sm">
                <div className="flex items-center justify-between">
                  <b>{r.author}</b>
                  <span className="text-accent">{"★".repeat(r.rating)}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{r.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.date}</p>
              </div>
            ))}
            {reviews && !reviews.length && <p className="text-sm text-muted-foreground">No written reviews yet — be the first after your visit.</p>}
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-3xl font-bold text-primary">{inr(listing.price)}<span className="text-sm font-normal text-muted-foreground"> / {listing.unit}</span></p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Duration</dt><dd className="font-semibold">{listing.duration}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Guest capacity</dt><dd className="font-semibold">Up to {listing.capacity}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Availability</dt><dd className="font-semibold">{listing.availableNote}</dd></div>
              </dl>
              <button onClick={() => setBooking(true)} className="mt-5 w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:opacity-90">
                Book Now
              </button>
              <p className="mt-2 text-center text-xs text-muted-foreground">Demo checkout — you won't be charged.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Hosted by</p>
              <p className="mt-1 font-display text-lg font-semibold">{listing.hostName}</p>
              <p className="text-sm text-muted-foreground">{listing.hostRole}</p>
              <p className="mt-3 text-xs text-muted-foreground">Hosts on NammaVibe are verified community members. 0% commission is taken from traditional artisans.</p>
            </div>
          </div>
        </aside>
      </div>

      {booking && <BookingDialog listing={listing} onClose={() => setBooking(false)} />}
    </main>
  );
}
