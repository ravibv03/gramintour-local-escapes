// Centralized API service layer for NammaVibe.
//
// Today every function serves mock data with a small simulated latency.
// To connect the Python FastAPI backend later, replace each function body
// with a fetch against `${import.meta.env.VITE_API_URL}/...` — pages and
// components only ever call this layer, so nothing else needs to change.

import { GREEN_FUND, bookings, listings, payouts, reviews, testimonials, users, wishlist } from "./mock-data";
import type { Booking, CreateBookingInput, Listing, ListingFilters, NewListingInput, Review, Testimonial, User, Payout } from "./types";

const LATENCY_MS = 200;
const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), LATENCY_MS));

export const api = {
  // ---- Listings ----
  async listListings(filters: ListingFilters = {}): Promise<Listing[]> {
    let out = listings.filter((l) => l.status === "approved");
    if (filters.category && filters.category !== "All") out = out.filter((l) => l.category === filters.category);
    if (filters.area && filters.area !== "All") out = out.filter((l) => l.area === filters.area);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      out = out.filter((l) => (l.title + l.location + l.description).toLowerCase().includes(q));
    }
    if (filters.maxPrice != null) out = out.filter((l) => l.price <= filters.maxPrice!);
    if (filters.minRating != null) out = out.filter((l) => l.rating >= filters.minRating!);
    switch (filters.sort) {
      case "price-asc": out = [...out].sort((a, b) => a.price - b.price); break;
      case "price-desc": out = [...out].sort((a, b) => b.price - a.price); break;
      case "rating": out = [...out].sort((a, b) => b.rating - a.rating); break;
      default: out = [...out].sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount);
    }
    return delay(out);
  },

  async getListing(id: number): Promise<Listing | undefined> {
    return delay(listings.find((l) => l.id === id));
  },

  async listAllListings(): Promise<Listing[]> {
    return delay(listings);
  },

  async addListing(input: NewListingInput): Promise<Listing> {
    const created: Listing = {
      id: Date.now(),
      title: input.title,
      category: input.category,
      location: input.location,
      area: input.location.split(",")[0]?.trim() || input.location,
      price: input.price,
      unit: input.category === "Homestay" ? "night" : input.category === "Local Guides" ? "person" : "session",
      hostId: "h1",
      hostName: "You",
      hostRole: "NammaVibe Host",
      rating: 0,
      reviewsCount: 0,
      highlights: input.highlights,
      description: input.description,
      duration: "Flexible",
      capacity: 4,
      availableNote: "Availability to be announced",
      images: [listings[0]!.images[0]!],
      verified: false,
      status: "pending",
    };
    listings.unshift(created);
    return delay(created);
  },

  async approveListing(id: number): Promise<void> {
    const l = listings.find((x) => x.id === id);
    if (l) l.status = "approved";
    return delay(undefined);
  },

  // ---- Reviews & testimonials ----
  async listReviews(listingId: number): Promise<Review[]> {
    return delay(reviews.filter((r) => r.listingId === listingId));
  },

  async listTestimonials(): Promise<Testimonial[]> {
    return delay(testimonials);
  },

  // ---- Bookings ----
  async listBookings(): Promise<Booking[]> {
    return delay(bookings);
  },

  async getBooking(id: string): Promise<Booking | undefined> {
    return delay(bookings.find((b) => b.id === id));
  },

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const listing = listings.find((l) => l.id === input.listingId);
    if (!listing) throw new Error("Listing not found");
    const multi = listing.category === "Homestay";
    const units = multi ? Math.max(1, Math.round((+new Date(input.to) - +new Date(input.from)) / 86400000)) : 1;
    const subtotal = listing.price * units * (multi ? 1 : input.guests);
    const booking: Booking = {
      id: "NV" + Math.floor(1000 + Math.random() * 9000),
      listingId: listing.id,
      title: listing.title,
      guestName: input.guestName,
      from: input.from,
      to: multi ? input.to : input.from,
      guests: input.guests,
      subtotal,
      greenFund: GREEN_FUND,
      total: subtotal + GREEN_FUND,
      status: "Requested",
      paymentStatus: "Not charged — demo booking",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    bookings.unshift(booking);
    return delay(booking);
  },

  async setBookingStatus(id: string, status: Booking["status"]): Promise<void> {
    const b = bookings.find((x) => x.id === id);
    if (b) b.status = status;
    return delay(undefined);
  },

  // ---- Wishlist (demo tourist) ----
  async getWishlist(): Promise<number[]> {
    return delay([...wishlist]);
  },

  async toggleWishlist(listingId: number): Promise<number[]> {
    const i = wishlist.indexOf(listingId);
    if (i >= 0) wishlist.splice(i, 1);
    else wishlist.push(listingId);
    return delay([...wishlist]);
  },

  // ---- Users / admin ----
  async listUsers(): Promise<User[]> {
    return delay(users);
  },

  async verifyHost(id: string): Promise<void> {
    const u = users.find((x) => x.id === id);
    if (u) u.verified = true;
    return delay(undefined);
  },

  // ---- Payouts ----
  async listPayouts(): Promise<Payout[]> {
    return delay(payouts);
  },
};
