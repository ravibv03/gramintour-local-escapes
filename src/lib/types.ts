// Shared TypeScript interfaces for the NammaVibe marketplace.
// These mirror the shapes the future Python FastAPI backend will return.

export type Category = "Homestay" | "Local Guides" | "Cultural Workshops";
export type Role = "tourist" | "host" | "admin";
export type BookingStatus = "Requested" | "Confirmed" | "Cancelled";
export type ListingStatus = "approved" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  verified: boolean;
  joinedAt: string;
}

export interface Listing {
  id: number;
  title: string;
  category: Category;
  location: string;
  area: string;
  price: number;
  unit: "night" | "person" | "session";
  hostId: string;
  hostName: string;
  hostRole: string;
  rating: number;
  reviewsCount: number;
  highlights: string[];
  description: string;
  duration: string;
  capacity: number;
  availableNote: string;
  images: string[];
  verified: boolean;
  status: ListingStatus;
}

export interface Review {
  id: string;
  listingId: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface Booking {
  id: string;
  listingId: number;
  title: string;
  guestName: string;
  from: string;
  to: string;
  guests: number;
  subtotal: number;
  greenFund: number;
  total: number;
  status: BookingStatus;
  /** Demo builds never charge money; this label must always say so. */
  paymentStatus: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  month: string;
  amount: number;
  status: "Paid" | "Scheduled";
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface ListingFilters {
  category?: Category | "All" | undefined;
  area?: string | undefined;
  query?: string | undefined;
  maxPrice?: number | undefined;
  minRating?: number | undefined;
  sort?: "recommended" | "price-asc" | "price-desc" | "rating" | undefined;
}

export interface CreateBookingInput {
  listingId: number;
  guestName: string;
  from: string;
  to: string;
  guests: number;
}

export interface NewListingInput {
  title: string;
  category: Category;
  location: string;
  price: number;
  highlights: string[];
  description: string;
}
