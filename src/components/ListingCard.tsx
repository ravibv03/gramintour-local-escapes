import { Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import type { Listing } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function ListingCard({ listing }: { listing: Listing }) {
  const queryClient = useQueryClient();
  const { data: wishlist } = useQuery({ queryKey: ["wishlist"], queryFn: api.getWishlist });
  const wishMutation = useMutation({
    mutationFn: () => api.toggleWishlist(listing.id),
    onSuccess: (ids) => {
      queryClient.setQueryData(["wishlist"], ids);
      toast.success(ids.includes(listing.id) ? "Saved to your wishlist" : "Removed from your wishlist");
    },
  });
  const wished = wishlist?.includes(listing.id) ?? false;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44">
        <img src={listing.images[0]} alt={listing.title} width={1024} height={768} loading="lazy" className="h-full w-full object-cover" />
        {listing.verified && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">✓ Verified</span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold">★ {listing.rating} ({listing.reviewsCount})</span>
        <button
          onClick={() => wishMutation.mutate()}
          aria-label="Toggle wishlist"
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/95 text-sm shadow"
        >
          {wished ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{listing.category}</span>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug">{listing.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{listing.location}</p>
        <p className="text-sm text-muted-foreground">Hosted by <span className="font-semibold text-foreground">{listing.hostName}</span> · {listing.hostRole}</p>
        <ul className="mt-3 flex-1 space-y-1 text-sm">
          {listing.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2"><span className="mt-0.5 text-primary">•</span>{h}</li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-bold text-primary">{inr(listing.price)}<span className="text-xs font-normal text-muted-foreground"> / {listing.unit}</span></span>
          <Link to="/experiences/$id" params={{ id: String(listing.id) }} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            View & Book
          </Link>
        </div>
      </div>
    </article>
  );
}
