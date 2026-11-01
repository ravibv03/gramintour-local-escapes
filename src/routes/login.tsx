import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — NammaVibe" },
      { name: "description", content: "Sign in or create your NammaVibe account to book Bengaluru experiences." },
      { property: "og:title", content: "Sign in — NammaVibe" },
      { property: "og:description", content: "Sign in or create your NammaVibe account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

const field = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");

  // No fake authentication: these forms are UI-only until the FastAPI
  // backend ships. Submitting never creates a session or claims success.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    toast.info("Authentication isn't connected yet — it will go live with the NammaVibe API. Browsing and demo bookings work without an account.");
  };

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="text-center font-display text-3xl font-bold">Welcome to NammaVibe</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">Sign in to manage bookings, or join as a traveler or host.</p>

      <div className="mt-6 flex rounded-full bg-muted p-1 text-sm font-semibold">
        {(["login", "register"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-1.5 transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-6">
        {mode === "register" && (
          <>
            <label className="block text-sm font-semibold">Full name<input required className={field} placeholder="Your name" /></label>
            <label className="block text-sm font-semibold">I am a
              <select className={field}>
                <option>Tourist</option>
                <option>Local host</option>
              </select>
            </label>
          </>
        )}
        <label className="block text-sm font-semibold">Email<input required type="email" className={field} placeholder="you@example.com" /></label>
        <label className="block text-sm font-semibold">Password<input required type="password" minLength={8} className={field} placeholder="••••••••" /></label>
        <button className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
        <p className="text-center text-xs text-muted-foreground">Accounts activate when the NammaVibe API launches — nothing is stored yet.</p>
      </form>
    </main>
  );
}
