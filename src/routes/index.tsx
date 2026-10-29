import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import hero from "@/assets/hero-bengaluru.jpg";
import imgVilla from "@/assets/malleshwaram-villa.jpg";
import imgNandi from "@/assets/nandi-farmstay.jpg";
import imgMarket from "@/assets/kr-market.jpg";
import imgCubbon from "@/assets/cubbon-park.jpg";
import imgChannapatna from "@/assets/channapatna.jpg";
import imgKaapi from "@/assets/filter-kaapi.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NammaVibe — Bengaluru Heritage & Stays" },
      { name: "description", content: "Book traditional homestays, licensed heritage walks, and native artisan workshops directly from Bengaluru's local community." },
      { property: "og:title", content: "NammaVibe — Bengaluru Heritage & Stays" },
      { property: "og:description", content: "Explore authentic Bengaluru — homestays, heritage walks and artisan workshops, by locals, for travelers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  component: Index,
});

type Category = "Homestay" | "Local Guides" | "Cultural Workshops";
type Listing = {
  id: number;
  title: string;
  category: Category;
  location: string;
  area: string;
  price: number;
  host: string;
  hostRole: string;
  rating: number;
  reviews: number;
  highlights: string[];
  unit: string;
  image: string;
  verified: boolean;
};
type Booking = { id: string; listingId: number; title: string; guest: string; from: string; to: string; guests: number; amount: number; status: "Confirmed" | "Pending" };

const GREEN_FUND = 50;

const seed: Listing[] = [
  {
    id: 1, title: "The Courtyard Heritage Villa, Malleshwaram", category: "Homestay", location: "Malleshwaram, Bengaluru", area: "Malleshwaram",
    price: 2400, host: "Lakshmi Hegde", hostRole: "Local Artisan & Host", rating: 4.9, reviews: 128, unit: "night", image: imgVilla, verified: true,
    highlights: ["Filter coffee on arrival", "Traditional breakfast", "Quiet green neighborhood"],
  },
  {
    id: 2, title: "Nandi Foothills Eco-Farmstay", category: "Homestay", location: "Nandi Hills Road, Bengaluru Rural", area: "Nandi Hills",
    price: 3200, host: "Ramesh Gowda", hostRole: "Organic Farmer", rating: 4.8, reviews: 94, unit: "night", image: imgNandi, verified: true,
    highlights: ["Organic farm tour", "Bonfire", "Stargazing deck"],
  },
  {
    id: 3, title: "Old Petes & KR Flower Market Heritage Walk", category: "Local Guides", location: "KR Market & Bangalore Fort, Bengaluru", area: "KR Market",
    price: 750, host: "Shivanna K.", hostRole: "Certified Historian & Walking Guide", rating: 4.9, reviews: 210, unit: "person", image: imgMarket, verified: true,
    highlights: ["2.5-hour morning walking tour", "Filter coffee & masala dosa stop", "Historical trivia"],
  },
  {
    id: 4, title: "Colonial Cantonment & Cubbon Park Tree Trail", category: "Local Guides", location: "Cubbon Park / MG Road, Bengaluru", area: "Cubbon Park",
    price: 650, host: "Dr. Priya Rao", hostRole: "Urban Botanist", rating: 4.8, reviews: 85, unit: "person", image: imgCubbon, verified: true,
    highlights: ["Guided walk through 100-year-old flora", "State Central Library architecture"],
  },
  {
    id: 5, title: "Channapatna Wooden Toy Lacquer Craft Workshop", category: "Cultural Workshops", location: "Ramanagara–Bengaluru Outskirts", area: "Ramanagara",
    price: 1100, host: "Master Craftsman Venkatesh", hostRole: "GI-Tagged Craft Artisan", rating: 4.9, reviews: 140, unit: "session", image: imgChannapatna, verified: true,
    highlights: ["Hands-on lathe woodwork", "Non-toxic vegetable dyes", "Take-home handcrafted souvenir"],
  },
  {
    id: 6, title: "Traditional Filter Kaapi Brewing & South Indian Culinary Class", category: "Cultural Workshops", location: "Basavanagudi (near Gandhi Bazaar), Bengaluru", area: "Basavanagudi",
    price: 850, host: "Ananya & Family", hostRole: "Heritage Home Cooks", rating: 5.0, reviews: 172, unit: "session", image: imgKaapi, verified: true,
    highlights: ["Authentic decoction brewing", "Making benne dosa", "Heritage family kitchen"],
  },
];

const seedBookings: Booking[] = [
  { id: "NV2081", listingId: 1, title: "The Courtyard Heritage Villa, Malleshwaram", guest: "Meera S.", from: "2026-11-06", to: "2026-11-09", guests: 2, amount: 7250, status: "Confirmed" },
  { id: "NV2082", listingId: 3, title: "Old Petes & KR Flower Market Heritage Walk", guest: "Daniel K.", from: "2026-11-14", to: "2026-11-14", guests: 4, amount: 3050, status: "Pending" },
];

const chips = ["All", "Malleshwaram", "Basavanagudi", "Nandi Hills", "KR Market", "Cubbon Park"] as const;

const today = new Date().toISOString().slice(0, 10);
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const nights = (a: string, b: string) => Math.max(1, Math.round((+new Date(b) - +new Date(a)) / 86400000));
const field = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Index() {
  const [tab, setTab] = useState<"discover" | "host">("discover");
  const [listings, setListings] = useState(seed);
  const [bookings, setBookings] = useState(seedBookings);
  const [filter, setFilter] = useState<Category | "All">("All");
  const [chip, setChip] = useState<(typeof chips)[number]>("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Listing | null>(null);

  const shown = listings.filter(
    (l) =>
      (filter === "All" || l.category === filter) &&
      (chip === "All" || l.area === chip) &&
      (l.title + l.location).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <span className="font-display text-2xl font-bold text-primary">NammaVibe</span>
            <span className="ml-2 hidden text-xs font-semibold tracking-wide text-muted-foreground sm:inline">BENGALURU HERITAGE & STAYS</span>
          </div>
          <nav className="flex gap-1 rounded-full bg-muted p-1 text-sm font-semibold">
            {(["discover", "host"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 transition ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {t === "discover" ? "Discover" : "Host Dashboard"}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {tab === "discover" ? (
        <main>
          <section className="relative h-[420px] overflow-hidden">
            <img src={hero} alt="Vidhana Soudha, Bengaluru at golden hour" width={1600} height={768} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
            <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 text-primary-foreground">
              <h1 className="font-display text-4xl font-bold md:text-5xl">Explore Authentic Bengaluru — By Locals, For Travelers</h1>
              <p className="mt-2 max-w-xl opacity-90">Book traditional homestays, licensed heritage walks, and native artisan workshops directly from the community.</p>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by place or experience…" className="mt-5 w-full max-w-md rounded-full bg-card px-5 py-3 text-foreground outline-none" />
            </div>
          </section>

          <section className="border-b border-border bg-card">
            <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 text-center sm:grid-cols-3">
              {[
                ["₹18.4 Lakhs+", "Paid directly to Bangalore local hosts & guides"],
                ["0% Commission", "Taken from traditional artisans"],
                ["45+ Verified", "Neighborhood cultural guides"],
              ].map(([big, small]) => (
                <div key={big}>
                  <p className="font-display text-2xl font-bold text-primary">{big}</p>
                  <p className="text-sm text-muted-foreground">{small}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="mb-3 flex flex-wrap gap-2">
              {(["All", "Homestay", "Local Guides", "Cultural Workshops"] as const).map((c) => (
                <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"}`}>
                  {c === "All" ? "All Experiences" : c === "Homestay" ? "Homestays" : c}
                </button>
              ))}
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={c} onClick={() => setChip(c)} className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${chip === c ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
                  {c}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((l) => (
                <article key={l.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-44">
                    <img src={l.image} alt={l.title} width={1024} height={768} loading="lazy" className="h-full w-full object-cover" />
                    {l.verified && (
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">✓ Verified</span>
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold">★ {l.rating} ({l.reviews})</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="w-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{l.category}</span>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug">{l.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{l.location}</p>
                    <p className="text-sm text-muted-foreground">Hosted by <span className="font-semibold text-foreground">{l.host}</span> · {l.hostRole}</p>
                    <ul className="mt-3 flex-1 space-y-1 text-sm">
                      {l.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2"><span className="mt-0.5 text-primary">•</span>{h}</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <span className="font-bold text-primary">{inr(l.price)}<span className="text-xs font-normal text-muted-foreground"> / {l.unit}</span></span>
                      <button onClick={() => setActive(l)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Book Now</button>
                    </div>
                  </div>
                </article>
              ))}
              {!shown.length && <p className="text-muted-foreground">No experiences match your search.</p>}
            </div>
          </div>
        </main>
      ) : (
        <HostDashboard bookings={bookings} listings={listings} setBookings={setBookings} onAdd={(l) => setListings((p) => [...p, l])} />
      )}

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground">
          <span className="font-display text-lg font-bold text-primary">NammaVibe</span>
          <span>By locals, for travelers · Bengaluru, Karnataka</span>
        </div>
      </footer>

      {active && <BookingModal listing={active} onClose={() => setActive(null)} onBooked={(b) => setBookings((p) => [b, ...p])} />}
    </div>
  );
}

function BookingModal({ listing, onClose, onBooked }: { listing: Listing; onClose: () => void; onBooked: (b: Booking) => void }) {
  const [step, setStep] = useState<"details" | "pay" | "done">("details");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [upi, setUpi] = useState("");
  const [app, setApp] = useState<"PhonePe" | "Google Pay" | "BHIM">("PhonePe");
  const [processing, setProcessing] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [ref, setRef] = useState("");
  const multi = listing.category === "Homestay";
  const units = multi ? nights(from, to) : 1;
  const subtotal = listing.price * units * (multi ? 1 : guests);
  const total = subtotal + GREEN_FUND;

  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      const id = "NV" + Math.floor(1000 + Math.random() * 9000);
      setBookingId(id);
      setRef("UPI" + Date.now().toString().slice(-10));
      onBooked({ id, listingId: listing.id, title: listing.title, guest: name, from, to: multi ? to : from, guests, amount: total, status: "Confirmed" });
      setProcessing(false);
      setStep("done");
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold leading-snug">{listing.title}</h2>
            <p className="text-sm text-muted-foreground">{listing.location}</p>
          </div>
          <button onClick={onClose} className="text-xl text-muted-foreground">×</button>
        </div>

        <img src={listing.image} alt={listing.title} width={1024} height={768} className="mt-4 h-40 w-full rounded-xl object-cover" />

        {step === "details" && (
          <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); setStep("pay"); }}>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">{multi ? "Check-in" : "Date"}<input type="date" required min={today} value={from} onChange={(e) => { setFrom(e.target.value); if (e.target.value > to) setTo(e.target.value); }} className={field} /></label>
              {multi && <label className="text-sm font-semibold">Check-out<input type="date" required min={from} value={to} onChange={(e) => setTo(e.target.value)} className={field} /></label>}
              <label className="text-sm font-semibold">Guests<input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(+e.target.value)} className={field} /></label>
            </div>
            <label className="block text-sm font-semibold">Your name<input required value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
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
            <button className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">Continue to payment</button>
          </form>
        )}

        {step === "pay" && (
          <div className="mt-5 space-y-4">
            <div className="flex gap-2">
              {(["PhonePe", "Google Pay", "BHIM"] as const).map((a) => (
                <button key={a} onClick={() => setApp(a)} className={`flex-1 rounded-lg border px-2 py-2 text-sm font-semibold transition ${app === a ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
                  {a}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Pay to nammavibe@upi via {app}</p>
              <p className="font-display text-3xl font-bold text-primary">{inr(total)}</p>
              <div className="mx-auto mt-3 grid h-32 w-32 grid-cols-8 gap-0.5 rounded bg-muted p-2">
                {Array.from({ length: 64 }).map((_, i) => <span key={i} className={(i * 7 + i % 3) % 3 ? "bg-foreground" : ""} />)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Scan with {app} (demo QR)</p>
            </div>
            <label className="block text-sm font-semibold">Or enter UPI ID<input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@okbank" className={field} /></label>
            <button disabled={processing || !/^[\w.-]+@\w+$/.test(upi)} onClick={pay} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-50">
              {processing ? `Waiting for ${app} approval…` : `Pay ${inr(total)}`}
            </button>
            <button onClick={() => setStep("details")} className="w-full text-sm text-muted-foreground">← Back</button>
          </div>
        )}

        {step === "done" && (
          <div className="mt-5">
            <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-secondary/40 p-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-primary">NammaVibe E-Pass</span>
                <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">CONFIRMED</span>
              </div>
              <div className="mt-4 flex gap-4">
                <div className="grid h-24 w-24 shrink-0 grid-cols-8 gap-0.5 rounded bg-card p-1.5">
                  {Array.from({ length: 64 }).map((_, i) => <span key={i} className={(i * 5 + i % 4) % 3 ? "bg-foreground" : ""} />)}
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{listing.title}</p>
                  <p className="text-muted-foreground">{name} · {guests} guest(s)</p>
                  <p className="text-muted-foreground">{from}{multi && to !== from && ` → ${to}`}</p>
                  <p className="text-muted-foreground">Booking ID: <b className="text-foreground">{bookingId}</b></p>
                  <p className="text-muted-foreground">Txn ref: {ref}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-primary/20 pt-3 text-sm">
                <span>Paid via {app} ({upi})</span>
                <b className="text-primary">{inr(total)}</b>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Includes {inr(GREEN_FUND)} contribution to the Bengaluru Green Heritage Fund. Show this E-Pass to your host on arrival.</p>
            </div>
            <button onClick={onClose} className="mt-5 w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function HostDashboard({ bookings, listings, setBookings, onAdd }: { bookings: Booking[]; listings: Listing[]; setBookings: (f: (b: Booking[]) => Booking[]) => void; onAdd: (l: Listing) => void }) {
  const earned = bookings.filter((b) => b.status === "Confirmed").reduce((s, b) => s + b.amount, 0);
  const pending = bookings.filter((b) => b.status === "Pending").reduce((s, b) => s + b.amount, 0);
  const [form, setForm] = useState({ title: "", category: "Homestay" as Category, location: "", price: "", desc: "" });
  const [saved, setSaved] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now(), title: form.title, category: form.category, location: form.location, area: form.location.split(",")[0]?.trim() || form.location,
      price: +form.price, host: "You", hostRole: "NammaVibe Host", rating: 5, reviews: 0, highlights: form.desc.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3),
      unit: form.category === "Homestay" ? "night" : form.category === "Local Guides" ? "person" : "session",
      image: imgVilla, verified: false,
    });
    setForm({ title: "", category: "Homestay", location: "", price: "", desc: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Host Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your Bengaluru experiences at a glance</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Total revenue", inr(earned)], ["Pending payouts", inr(pending)], ["Active listings", String(listings.length)]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="font-display text-3xl font-bold text-primary">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-3">
          <h2 className="mb-4 font-display text-xl font-semibold">Incoming bookings</h2>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted p-3 text-sm">
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-muted-foreground">{b.id} · {b.guest} · {b.guests} guest(s) · {b.from}{b.to !== b.from && ` → ${b.to}`}</p>
                </div>
                <div className="flex items-center gap-3">
                  <b>{inr(b.amount)}</b>
                  {b.status === "Pending" ? (
                    <button onClick={() => setBookings((p) => p.map((x) => (x.id === b.id ? { ...x, status: "Confirmed" } : x)))} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Accept</button>
                  ) : (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">Add New Bangalore Experience</h2>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className={field}>
            <option value="Homestay">Homestay</option><option value="Local Guides">Local Guide</option><option value="Cultural Workshops">Cultural Workshop</option>
          </select>
          <input required placeholder="Neighborhood, Bengaluru" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} />
          <input required type="number" min={1} placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={field} />
          <textarea required rows={3} placeholder="Highlights, separated by commas" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className={field} />
          <button className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">Publish experience</button>
          {saved && <p className="text-center text-sm font-semibold text-primary">Experience published to Discover!</p>}
        </form>
      </div>
    </main>
  );
}
