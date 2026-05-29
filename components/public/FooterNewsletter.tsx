"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Failed");
      }
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-sm text-text-muted"
      >
        <CheckCircle size={16} className="text-green-600 flex-shrink-0" aria-hidden="true" />
        <span>Subscribed — thanks!</span>
      </div>
    );
  }

  const hasError = state === "error" && errorMsg;

  return (
    <form onSubmit={submit} className="space-y-2" noValidate>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
        Newsletter
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label="Email address for newsletter"
          aria-describedby={hasError ? "footer-nl-error" : undefined}
          aria-invalid={hasError ? "true" : undefined}
          className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-surface border border-border rounded text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors min-h-[44px]"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded hover:opacity-90 transition-opacity disabled:opacity-60 min-h-[44px]"
        >
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {hasError && (
        <p
          id="footer-nl-error"
          role="alert"
          aria-live="assertive"
          className="text-xs text-red-600"
        >
          {errorMsg}
        </p>
      )}
      <p className="text-xs text-text-muted">No spam. Unsubscribe any time.</p>
    </form>
  );
}
