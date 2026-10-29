import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GraminTour — Discover & Host Rural India" },
      { name: "description", content: "Book village homestays, local guides and cultural workshops. Hosts manage listings and earnings." },
      { property: "og:title", content: "GraminTour — Smart Local Tourism Portal" },
      { property: "og:description", content: "Book homestays, guides and workshops across rural India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Nunito+Sans:wght@400;600;700&display=swap" },
    ],
  }),
  component: Index,
});

type Category = "Homestay" | "Guide" | "Workshop";
type Listing = { id: number; title: string; category: Category; location: string; price: number; host: string; rating: number; desc: string; unit: string };
type Booking = { id: string; listingId: number; title: string; guest: string; from: string; to: string; guests: number; amount: number; status: "Confirmed" | "Pending" };

const seed: Listing[] = [
  { id: 1, title: "Mud House by the Mustard Fields", category: "Homestay", location: "Nabha, Punjab", price: 1800, host: "Gurpreet Kaur", rating: 4.8, desc: "Farm breakfast, bonfire nights and tractor rides.", unit: "night" },
  { id: 2, title: "Bamboo Cottage, Majuli", category: "Homestay", location: "Majuli, Assam", price: 1500, host: "Ranjit Doley", rating: 4.9, desc: "Stilted cottage on the world's largest river island.", unit: "night" },
  { id: 3, title: "Hampi Ruins Walk", category: "Guide", location: "Hampi, Karnataka", price: 900, host: "Shivanna", rating: 4.7, desc: "Sunrise trek through boulders and temples.", unit: "day" },
  { id: 4, title: "Spiti Village Trails", category: "Guide", location: "Kaza, Himachal", price: 1200, host: "Tenzin Norbu", rating: 4.9, desc: "High-altitude monasteries and fossil villages.", unit: "day" },
  { id: 5, title: "Blue Pottery Workshop", category: "Workshop", location: "Jaipur, Rajasthan", price: 750, host: "Kripal Singh", rating: 4.6, desc: "Hand-shape and glaze your own piece.", unit: "session" },
  { id: 6, title: "Madhubani Painting Class", category: "Workshop", location: "Madhubani, Bihar", price: 600, host: "Sita Devi", rating: 4.8, desc: "Natural pigments, bamboo nibs, folk stories.", unit: "session" },
];
const seedBookings: Booking[] = [
  { id: "GT1042", listingId: 1, title: "Mud House by the Mustard Fields", guest: "Ananya R.", from: "2026-11-05", to: "2026-11-08", guests: 2, amount: 5400, status: "Confirmed" },
  { id: "GT1043", listingId: 5, title: "Blue Pottery Workshop", guest: "Tom H.", from: "2026-11-12", to: "2026-11-12", guests: 3, amount: 2250, status: "Pending" },
];

const today = new Date().toISOString().slice(0, 10);
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const nights = (a: string, b: string) => Math.max(1, Math.round((+new Date(b) - +new Date(a)) / 86400000));
const field = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Index() {
  const [tab, setTab] = useState<"discover" | "host">("discover");
  const [listings, setListings] = useState(seed);
  const [bookings, setBookings] = useState(seedBookings);
  const [filter, setFilter] = useState<Category | "All">("All");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Listing | null>(null);

  const shown = listings.filter((l) => (filter === "All" || l.category === filter) && (l.title + l.location).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-display text-2xl font-bold text-primary">GraminTour</span>
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
          <section className="relative h-[380px] overflow-hidden">
            <img src={hero} alt="Village homestay at sunset" width={1600} height={768} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
            <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 text-primary-foreground">
              <h1 className="font-display text-4xl font-bold md:text-5xl">Stay local. Travel deeper.</h1>
              <p className="mt-2 max-w-lg opacity-90">Homestays, village guides and craft workshops hosted by rural India.</p>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by place or experience…" className="mt-5 w-full max-w-md rounded-full bg-card px-5 py-3 text-foreground outline-none" />
            </div>
          </section>
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6 flex flex-wrap gap-2">
              {(["All", "Homestay", "Guide", "Workshop"] as const).map((c) => (
                <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${filter === c ? "border-secondary bg-secondary text-secondary-foreground" : "border-border bg-card"}`}>
                  {c === "All" ? "All" : c === "Guide" ? "Local Guides" : c === "Workshop" ? "Cultural Workshops" : "Homestays"}
                </button>
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((l) => (
                <article key={l.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">{l.category}</span>
                    <span>★ {l.rating}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold">{l.title}</h3>
                  <p className="text-sm text-muted-foreground">{l.location} · by {l.host}</p>
                  <p className="mt-2 flex-1 text-sm">{l.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-primary">{inr(l.price)}<span className="text-xs font-normal text-muted-foreground"> / {l.unit}</span></span>
                    <button onClick={() => setActive(l)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Book</button>
                  </div>
                </article>
              ))}
              {!shown.length && <p className="text-muted-foreground">No listings match.</p>}
            </div>
          </div>
        </main>
      ) : (
        <HostDashboard bookings={bookings} listings={listings} setBookings={setBookings} onAdd={(l) => setListings((p) => [...p, l])} />
      )}

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
  const [processing, setProcessing] = useState(false);
  const [ref, setRef] = useState("");
  const multi = listing.category === "Homestay";
  const units = multi ? nights(from, to) : 1;
  const total = listing.price * units * (multi ? 1 : guests);

  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      const id = "GT" + Math.floor(1000 + Math.random() * 9000);
      setRef("UPI" + Date.now().toString().slice(-10));
      onBooked({ id, listingId: listing.id, title: listing.title, guest: name, from, to: multi ? to : from, guests, amount: total, status: "Confirmed" });
      setProcessing(false);
      setStep("done");
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">{listing.title}</h2>
            <p className="text-sm text-muted-foreground">{listing.location}</p>
          </div>
          <button onClick={onClose} className="text-xl text-muted-foreground">×</button>
        </div>

        {step === "details" && (
          <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); setStep("pay"); }}>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">{multi ? "Check-in" : "Date"}<input type="date" required min={today} value={from} onChange={(e) => { setFrom(e.target.value); if (e.target.value > to) setTo(e.target.value); }} className={field} /></label>
              {multi && <label className="text-sm font-semibold">Check-out<input type="date" required min={from} value={to} onChange={(e) => setTo(e.target.value)} className={field} /></label>}
              <label className="text-sm font-semibold">Guests<input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(+e.target.value)} className={field} /></label>
            </div>
            <label className="block text-sm font-semibold">Your name<input required value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
            <div className="flex justify-between rounded-lg bg-muted p-3 text-sm">
              <span>{inr(listing.price)} × {multi ? `${units} night(s)` : `${guests} guest(s)`}</span>
              <b>{inr(total)}</b>
            </div>
            <button className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">Continue to payment</button>
          </form>
        )}

        {step === "pay" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Pay to gramintour@upi</p>
              <p className="font-display text-3xl font-bold text-primary">{inr(total)}</p>
              <div className="mx-auto mt-3 grid h-32 w-32 grid-cols-8 gap-0.5 rounded bg-muted p-2">
                {Array.from({ length: 64 }).map((_, i) => <span key={i} className={(i * 7 + i % 3) % 3 ? "bg-foreground" : ""} />)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Scan with any UPI app (demo)</p>
            </div>
            <label className="block text-sm font-semibold">Or enter UPI ID<input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@okbank" className={field} /></label>
            <button disabled={processing || !/^[\w.-]+@\w+$/.test(upi)} onClick={pay} className="w-full rounded-lg bg-secondary py-2.5 font-semibold text-secondary-foreground disabled:opacity-50">
              {processing ? "Waiting for UPI approval…" : `Pay ${inr(total)}`}
            </button>
            <button onClick={() => setStep("details")} className="w-full text-sm text-muted-foreground">← Back</button>
          </div>
        )}

        {step === "done" && (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl text-secondary-foreground">✓</div>
            <h3 className="mt-3 font-display text-2xl font-semibold">Payment successful</h3>
            <p className="text-sm text-muted-foreground">{inr(total)} paid via {upi}</p>
            <p className="mt-1 text-xs text-muted-foreground">Txn ref: {ref}</p>
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
    onAdd({ id: Date.now(), title: form.title, category: form.category, location: form.location, price: +form.price, desc: form.desc, host: "You", rating: 5, unit: form.category === "Homestay" ? "night" : form.category === "Guide" ? "day" : "session" });
    setForm({ title: "", category: "Homestay", location: "", price: "", desc: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Namaste, Host</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Total earnings", inr(earned)], ["Pending payouts", inr(pending)], ["Active listings", String(listings.length)]].map(([k, v]) => (
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
                  <p className="text-muted-foreground">{b.guest} · {b.guests} guest(s) · {b.from}{b.to !== b.from && ` → ${b.to}`}</p>
                </div>
                <div className="flex items-center gap-3">
                  <b>{inr(b.amount)}</b>
                  {b.status === "Pending" ? (
                    <button onClick={() => setBookings((p) => p.map((x) => (x.id === b.id ? { ...x, status: "Confirmed" } : x)))} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Accept</button>
                  ) : (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">Confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">Add new listing</h2>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className={field}>
            <option value="Homestay">Homestay</option><option value="Guide">Local Guide</option><option value="Workshop">Cultural Workshop</option>
          </select>
          <input required placeholder="Village, State" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} />
          <input required type="number" min={1} placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={field} />
          <textarea required rows={3} placeholder="Short description" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className={field} />
          <button className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">Publish listing</button>
          {saved && <p className="text-center text-sm font-semibold text-secondary">Listing published to Discover!</p>}
        </form>
      </div>
    </main>
  );
}
