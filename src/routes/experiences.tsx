import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { areas } from "@/lib/mock-data";
import type { Category, ListingFilters } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";

type Search = {
  category?: Category | undefined;
  area?: string | undefined;
  q?: string | undefined;
  maxPrice?: number | undefined;
  minRating?: number | undefined;
  sort?: ListingFilters["sort"];
};

export const Route = createFileRoute("/experiences")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s["category"] === "string" ? (s["category"] as Category) : undefined,
    area: typeof s["area"] === "string" ? s["area"] : undefined,
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    maxPrice: typeof s["maxPrice"] === "number" ? s["maxPrice"] : undefined,
    minRating: typeof s["minRating"] === "number" ? s["minRating"] : undefined,
    sort: typeof s["sort"] === "string" ? (s["sort"] as ListingFilters["sort"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Experiences — NammaVibe Bengaluru" },
      { name: "description", content: "Browse and filter Bengaluru homestays, heritage walks and artisan workshops by price, rating and neighborhood." },
      { property: "og:title", content: "Experiences — NammaVibe Bengaluru" },
      { property: "og:description", content: "Find your Bengaluru experience: homestays, local guides and cultural workshops." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Experiences,
});

const field = "rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Experiences() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const set = (patch: Partial<Search>) => navigate({ search: (prev: Search) => ({ ...prev, ...patch }), replace: true });

  const filters: ListingFilters = {
    category: search.category ?? "All",
    area: search.area ?? "All",
    query: search.q,
    maxPrice: search.maxPrice,
    minRating: search.minRating,
    sort: search.sort ?? "recommended",
  };
  const { data: listings, isLoading, isError } = useQuery({ queryKey: ["listings", filters], queryFn: () => api.listListings(filters) });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Experiences in Bengaluru</h1>
      <p className="mt-1 text-sm text-muted-foreground">Homestays, local guides and cultural workshops — booked directly from the community.</p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-3 lg:grid-cols-6">
        <input value={search.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Search…" className={field} />
        <select value={search.category ?? "All"} onChange={(e) => set({ category: e.target.value === "All" ? undefined : (e.target.value as Category) })} className={field}>
          <option value="All">All categories</option>
          <option value="Homestay">Homestays</option>
          <option value="Local Guides">Local Guides</option>
          <option value="Cultural Workshops">Cultural Workshops</option>
        </select>
        <select value={search.area ?? "All"} onChange={(e) => set({ area: e.target.value === "All" ? undefined : e.target.value })} className={field}>
          <option value="All">All areas</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          Max {search.maxPrice ? `₹${search.maxPrice}` : "₹3200"}
          <input type="range" min={500} max={3200} step={50} value={search.maxPrice ?? 3200} onChange={(e) => set({ maxPrice: +e.target.value >= 3200 ? undefined : +e.target.value })} className="w-full accent-primary" />
        </label>
        <select value={search.minRating ?? 0} onChange={(e) => set({ minRating: +e.target.value || undefined })} className={field}>
          <option value={0}>Any rating</option>
          <option value={4.5}>4.5 ★ & up</option>
          <option value={4.8}>4.8 ★ & up</option>
        </select>
        <select value={search.sort ?? "recommended"} onChange={(e) => set({ sort: e.target.value as ListingFilters["sort"] })} className={field}>
          <option value="recommended">Recommended</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      {isLoading && <p className="mt-10 text-muted-foreground">Loading experiences…</p>}
      {isError && <p className="mt-10 text-destructive">Could not load experiences. Please refresh.</p>}
      {listings && (
        <>
          <p className="mt-6 text-sm text-muted-foreground">{listings.length} experience(s) found</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          {!listings.length && (
            <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No experiences match these filters. Try widening the price range or clearing the area.
            </div>
          )}
        </>
      )}
    </main>
  );
}
