import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-primary">NammaVibe</p>
          <p className="mt-1 text-sm text-muted-foreground">By locals, for travelers · Bengaluru, Karnataka</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Explore</p>
          <div className="mt-2 flex flex-col gap-1 text-muted-foreground">
            <Link to="/experiences" className="hover:text-foreground">All experiences</Link>
            <Link to="/experiences" search={{ category: "Homestay" }} className="hover:text-foreground">Homestays</Link>
            <Link to="/experiences" search={{ category: "Local Guides" }} className="hover:text-foreground">Heritage walks</Link>
            <Link to="/experiences" search={{ category: "Cultural Workshops" }} className="hover:text-foreground">Workshops</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Community</p>
          <div className="mt-2 flex flex-col gap-1 text-muted-foreground">
            <Link to="/host" className="hover:text-foreground">Become a host</Link>
            <Link to="/account" className="hover:text-foreground">My bookings</Link>
            <span>0% commission from traditional artisans</span>
          </div>
        </div>
      </div>
      <p className="border-t border-border py-3 text-center text-xs text-muted-foreground">Demo build — bookings are simulated and no payment is ever charged.</p>
    </footer>
  );
}
