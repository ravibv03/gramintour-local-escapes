import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Discover" },
  { to: "/experiences", label: "Experiences" },
  { to: "/host", label: "Host" },
  { to: "/admin", label: "Admin" },
  { to: "/account", label: "My Account" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-primary">NammaVibe</span>
          <span className="hidden text-xs font-semibold tracking-wide text-muted-foreground md:inline">BENGALURU HERITAGE & STAYS</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-full px-3 py-1.5 text-muted-foreground transition hover:bg-muted"
              activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="ml-1 rounded-full border border-primary px-3.5 py-1.5 text-primary transition hover:bg-primary hover:text-primary-foreground">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
