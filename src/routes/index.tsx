import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import hero from "@/assets/hero-bengaluru.jpg";
import { api } from "@/lib/api";
import { areas } from "@/lib/mock-data";
import { ListingCard } from "@/components/ListingCard";

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
  component: Home,
});

const categories = [
  { name: "Homestay" as const, label: "Homestays", blurb: "Heritage homes & farmstays" },
  { name: "Local Guides" as const, label: "Local Guides", blurb: "Licensed heritage walks" },
  { name: "Cultural Workshops" as const, label: "Cultural Workshops", blurb: "Native artisan classes" },
];

const steps = [
  ["1. Discover", "Browse verified homestays, walks and workshops hosted by Bengaluru locals."],
  ["2. Book directly", "Pick your dates and guests. Your money goes straight to the host — 0% commission from artisans."],
  ["3. Experience", "Meet your host, show your booking slip, and live the city like a local."],
];

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { data: listings, isLoading, isError } = useQuery({ queryKey: ["listings", "home"], queryFn: () => api.listListings({ sort: "rating" }) });
  const { data: quotes } = useQuery({ queryKey: ["testimonials"], queryFn: api.listTestimonials });

  const featured = listings?.slice(0, 3) ?? [];
  const recommended = listings?.slice(3, 6) ?? [];

  return (
    <main>
      <section className="relative h-[440px] overflow-hidden">
        <img src={hero} alt="Vidhana Soudha, Bengaluru at golden hour" width={1600} height={768} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 text-primary-foreground">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Explore Authentic Bengaluru — By Locals, For Travelers</h1>
          <p className="mt-2 max-w-xl opacity-90">Book traditional homestays, licensed heritage walks, and native artisan workshops directly from the community.</p>
          <form
            className="mt-5 flex w-full max-w-md gap-2"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/experiences", search: { q } }); }}
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by place or experience…" className="w-full rounded-full bg-card px-5 py-3 text-foreground outline-none" />
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Search</button>
          </form>
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

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display text-2xl font-bold">Browse by category</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.name} to="/experiences" search={{ category: c.name }} className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="font-display text-lg font-semibold text-primary">{c.label}</p>
              <p className="text-sm text-muted-foreground">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="font-display text-2xl font-bold">Popular neighborhoods</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {areas.map((a) => (
            <Link key={a} to="/experiences" search={{ area: a }} className="rounded-full bg-muted px-4 py-1.5 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-secondary-foreground">
              {a}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold">Featured experiences</h2>
          <Link to="/experiences" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
        </div>
        {isLoading && <p className="mt-6 text-muted-foreground">Loading experiences…</p>}
        {isError && <p className="mt-6 text-destructive">Could not load experiences. Please refresh.</p>}
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display text-2xl font-bold">How NammaVibe works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {steps.map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-muted p-5">
                <p className="font-display text-lg font-semibold text-primary">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display text-2xl font-bold">Recommended for you</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display text-2xl font-bold">Travelers love NammaVibe</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {(quotes ?? []).map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-accent">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</p>
                <blockquote className="mt-2 text-sm">“{t.text}”</blockquote>
                <figcaption className="mt-3 text-sm font-semibold">{t.name} <span className="font-normal text-muted-foreground">· {t.location}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
