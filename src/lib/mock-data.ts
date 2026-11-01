// Mock data store for NammaVibe. Kept separate from the API layer so the
// frontend can be switched to the FastAPI backend without touching pages.
import imgVilla from "@/assets/malleshwaram-villa.jpg";
import imgNandi from "@/assets/nandi-farmstay.jpg";
import imgMarket from "@/assets/kr-market.jpg";
import imgCubbon from "@/assets/cubbon-park.jpg";
import imgChannapatna from "@/assets/channapatna.jpg";
import imgKaapi from "@/assets/filter-kaapi.jpg";
import type { Booking, Listing, Payout, Review, Testimonial, User } from "./types";

export const GREEN_FUND = 50;

export const listings: Listing[] = [
  {
    id: 1, title: "The Courtyard Heritage Villa, Malleshwaram", category: "Homestay",
    location: "Malleshwaram, Bengaluru", area: "Malleshwaram", price: 2400, unit: "night",
    hostId: "h1", hostName: "Lakshmi Hegde", hostRole: "Local Artisan & Host", rating: 4.9, reviewsCount: 128,
    highlights: ["Filter coffee on arrival", "Traditional breakfast", "Quiet green neighborhood"],
    description: "A 90-year-old courtyard home with red oxide floors, teak pillars and a garden veranda. Wake up to filter kaapi and a traditional breakfast, then walk to Malleshwaram's temples, markets and legendary eateries.",
    duration: "Flexible stay", capacity: 4, availableNote: "Available most weekends and weekdays",
    images: [imgVilla, imgKaapi, imgCubbon], verified: true, status: "approved",
  },
  {
    id: 2, title: "Nandi Foothills Eco-Farmstay", category: "Homestay",
    location: "Nandi Hills Road, Bengaluru Rural", area: "Nandi Hills", price: 3200, unit: "night",
    hostId: "h2", hostName: "Ramesh Gowda", hostRole: "Organic Farmer", rating: 4.8, reviewsCount: 94,
    highlights: ["Organic farm tour", "Bonfire", "Stargazing deck"],
    description: "A terracotta-roof cottage inside a working organic orchard at the foot of Nandi Hills. Join the morning farm walk, eat from the garden, and end the day at the stargazing deck by the bonfire.",
    duration: "Flexible stay", capacity: 6, availableNote: "Weekends fill fast — book early",
    images: [imgNandi, imgVilla, imgMarket], verified: true, status: "approved",
  },
  {
    id: 3, title: "Old Petes & KR Flower Market Heritage Walk", category: "Local Guides",
    location: "KR Market & Bangalore Fort, Bengaluru", area: "KR Market", price: 750, unit: "person",
    hostId: "h3", hostName: "Shivanna K.", hostRole: "Certified Historian & Walking Guide", rating: 4.9, reviewsCount: 210,
    highlights: ["2.5-hour morning walking tour", "Filter coffee & masala dosa stop", "Historical trivia"],
    description: "Dawn in Asia's busiest flower market, then through the old petes — Chickpet, Avenue Road, Doddapete — to Bangalore Fort. Ends with filter coffee and masala dosa at a 100-year-old eatery.",
    duration: "2.5 hours · starts 6:30 AM", capacity: 12, availableNote: "Runs Tue–Sun, weather permitting",
    images: [imgMarket, imgKaapi, imgCubbon], verified: true, status: "approved",
  },
  {
    id: 4, title: "Colonial Cantonment & Cubbon Park Tree Trail", category: "Local Guides",
    location: "Cubbon Park / MG Road, Bengaluru", area: "Cubbon Park", price: 650, unit: "person",
    hostId: "h4", hostName: "Dr. Priya Rao", hostRole: "Urban Botanist", rating: 4.8, reviewsCount: 85,
    highlights: ["Guided walk through 100-year-old flora", "State Central Library architecture"],
    description: "A botanist-led trail under Cubbon Park's century-old canopy — bamboo groves, rain trees and gulmohars — finishing at the red-brick State Central Library and the stories of the old Cantonment.",
    duration: "2 hours · starts 7:00 AM", capacity: 15, availableNote: "Daily except Mondays",
    images: [imgCubbon, imgMarket, imgNandi], verified: true, status: "approved",
  },
  {
    id: 5, title: "Channapatna Wooden Toy Lacquer Craft Workshop", category: "Cultural Workshops",
    location: "Ramanagara–Bengaluru Outskirts", area: "Ramanagara", price: 1100, unit: "session",
    hostId: "h5", hostName: "Master Craftsman Venkatesh", hostRole: "GI-Tagged Craft Artisan", rating: 4.9, reviewsCount: 140,
    highlights: ["Hands-on lathe woodwork", "Non-toxic vegetable dyes", "Take-home handcrafted souvenir"],
    description: "Learn the 200-year-old GI-tagged craft of Channapatna lacquer toys. Turn soft ivory wood on the lathe, finish with vegetable dyes, and take home the piece you made.",
    duration: "3 hours · morning & afternoon batches", capacity: 8, availableNote: "Weekends and holidays",
    images: [imgChannapatna, imgMarket, imgVilla], verified: true, status: "approved",
  },
  {
    id: 6, title: "Traditional Filter Kaapi Brewing & South Indian Culinary Class", category: "Cultural Workshops",
    location: "Basavanagudi (near Gandhi Bazaar), Bengaluru", area: "Basavanagudi", price: 850, unit: "session",
    hostId: "h6", hostName: "Ananya & Family", hostRole: "Heritage Home Cooks", rating: 5.0, reviewsCount: 172,
    highlights: ["Authentic decoction brewing", "Making benne dosa", "Heritage family kitchen"],
    description: "In a Basavanagudi family kitchen: pull a perfect decoction in a brass filter, froth kaapi the davara way, and make benne dosa on a seasoned cast-iron tawa. Recipes go home with you.",
    duration: "2.5 hours · starts 10:00 AM", capacity: 6, availableNote: "Wed–Sun",
    images: [imgKaapi, imgVilla, imgChannapatna], verified: true, status: "approved",
  },
];

export const reviews: Review[] = [
  { id: "r1", listingId: 1, author: "Meera S.", rating: 5, date: "2026-10-12", text: "The courtyard at sunrise, the kaapi, Lakshmi aunty's breakfast — easily the warmest stay I've had in Bengaluru." },
  { id: "r2", listingId: 1, author: "James W.", rating: 5, date: "2026-09-28", text: "Felt like staying with family. Malleshwaram walks right outside the door." },
  { id: "r3", listingId: 2, author: "Aditya R.", rating: 5, date: "2026-10-05", text: "Kids loved the farm tour. The stargazing deck at night is unreal." },
  { id: "r4", listingId: 2, author: "Farah N.", rating: 4, date: "2026-09-15", text: "Peaceful, green, great food. Carry a light jacket for the evenings." },
  { id: "r5", listingId: 3, author: "Daniel K.", rating: 5, date: "2026-10-20", text: "Shivanna knows every lane and every story. The flower market at dawn is a sensory overload in the best way." },
  { id: "r6", listingId: 3, author: "Priyanka M.", rating: 5, date: "2026-10-02", text: "The dosa stop alone is worth it. Brilliantly paced walk." },
  { id: "r7", listingId: 4, author: "Sofia L.", rating: 5, date: "2026-10-18", text: "Dr. Rao made trees fascinating. Cubbon Park will never look the same." },
  { id: "r8", listingId: 5, author: "Rohan T.", rating: 5, date: "2026-10-08", text: "Made my own lacquered spinning top! Venkatesh sir is a patient teacher." },
  { id: "r9", listingId: 6, author: "Elena P.", rating: 5, date: "2026-10-22", text: "I finally understand what real filter kaapi is. The benne dosa lesson was a bonus." },
];

export const testimonials: Testimonial[] = [
  { name: "Ankit Sharma", location: "Mumbai", rating: 5, text: "NammaVibe showed me a Bengaluru no hotel could. The heritage walk and the homestay breakfast were the trip's highlights." },
  { name: "Claire Dubois", location: "Paris", rating: 5, text: "Booking directly with locals felt honest. My host family in Basavanagudi taught me to make dosa — I cried a little leaving." },
  { name: "Vikram Iyer", location: "Chennai", rating: 4, text: "The Channapatna workshop was superb and my money went straight to the artisan. That 0% commission promise is real." },
];

export const users: User[] = [
  { id: "u1", name: "Demo Tourist", email: "tourist@nammavibe.demo", role: "tourist", verified: true, joinedAt: "2026-06-14" },
  { id: "h1", name: "Lakshmi Hegde", email: "lakshmi@nammavibe.demo", role: "host", verified: true, joinedAt: "2025-11-02" },
  { id: "h2", name: "Ramesh Gowda", email: "ramesh@nammavibe.demo", role: "host", verified: true, joinedAt: "2025-12-19" },
  { id: "h3", name: "Shivanna K.", email: "shivanna@nammavibe.demo", role: "host", verified: true, joinedAt: "2026-01-07" },
  { id: "h4", name: "Dr. Priya Rao", email: "priya@nammavibe.demo", role: "host", verified: true, joinedAt: "2026-02-11" },
  { id: "h5", name: "Venkatesh", email: "venkatesh@nammavibe.demo", role: "host", verified: false, joinedAt: "2026-09-30" },
  { id: "h6", name: "Ananya & Family", email: "ananya@nammavibe.demo", role: "host", verified: true, joinedAt: "2026-03-25" },
  { id: "u2", name: "Meera S.", email: "meera@example.com", role: "tourist", verified: true, joinedAt: "2026-07-01" },
];

export const bookings: Booking[] = [
  { id: "NV2081", listingId: 1, title: "The Courtyard Heritage Villa, Malleshwaram", guestName: "Meera S.", from: "2026-11-06", to: "2026-11-09", guests: 2, subtotal: 7200, greenFund: GREEN_FUND, total: 7250, status: "Confirmed", paymentStatus: "Not charged — demo booking", createdAt: "2026-10-20" },
  { id: "NV2082", listingId: 3, title: "Old Petes & KR Flower Market Heritage Walk", guestName: "Daniel K.", from: "2026-11-14", to: "2026-11-14", guests: 4, subtotal: 3000, greenFund: GREEN_FUND, total: 3050, status: "Requested", paymentStatus: "Not charged — demo booking", createdAt: "2026-10-24" },
  { id: "NV2070", listingId: 6, title: "Traditional Filter Kaapi Brewing & South Indian Culinary Class", guestName: "Demo Tourist", from: "2026-10-18", to: "2026-10-18", guests: 2, subtotal: 1700, greenFund: GREEN_FUND, total: 1750, status: "Confirmed", paymentStatus: "Not charged — demo booking", createdAt: "2026-10-10" },
];

export const payouts: Payout[] = [
  { id: "p1", month: "August 2026", amount: 38400, status: "Paid" },
  { id: "p2", month: "September 2026", amount: 42150, status: "Paid" },
  { id: "p3", month: "October 2026", amount: 47600, status: "Paid" },
  { id: "p4", month: "November 2026", amount: 10300, status: "Scheduled" },
];

export const wishlist: number[] = [3, 5];

export const areas = ["Malleshwaram", "Basavanagudi", "Nandi Hills", "KR Market", "Cubbon Park", "Ramanagara"];
