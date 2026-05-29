"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { NewsletterSubscriber, ContactSubmission, NewsletterSend } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { formatDate } from "@/lib/utils";
import { Send, Download, Mail, Users, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [sends, setSends] = useState<NewsletterSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendOpen, setSendOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [subRes, contactRes, sendsRes] = await Promise.all([
        supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
        supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("newsletter_sends")
          .select("*")
          .order("sent_at", { ascending: false })
          .limit(20),
      ]);
      setSubscribers((subRes.data ?? []) as NewsletterSubscriber[]);
      setContacts((contactRes.data ?? []) as ContactSubmission[]);
      setSends((sendsRes.data ?? []) as NewsletterSend[]);
      setLoading(false);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateContactStatus = async (id: string, status: ContactSubmission["status"]) => {
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const exportCsv = () => {
    const active = subscribers.filter((s) => s.status === "active");
    const csv = [
      "email,first_name,subscribed_at",
      ...active.map((s) => `${s.email},${s.first_name ?? ""},${s.created_at}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const newContacts = contacts.filter((c) => c.status === "new").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-base">
            Subscribers &amp; Messages
          </h1>
          <p className="text-text-muted mt-1">
            {activeCount} active subscriber{activeCount !== 1 ? "s" : ""} ·{" "}
            {newContacts} new message{newContacts !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}>
            <Download size={14} className="mr-1.5" /> Export CSV
          </Button>
          <Button onClick={() => setSendOpen(true)}>
            <Send size={14} className="mr-1.5" /> Send newsletter
          </Button>
        </div>
      </div>

      {/* Contact submissions */}
      <section>
        <h2 className="font-serif text-xl font-semibold text-text-base mb-4">
          Contact form submissions
        </h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-20 bg-surface-alt animate-pulse rounded-lg" />)}
          </div>
        ) : contacts.length === 0 ? (
          <p className="text-text-muted text-sm">No submissions yet.</p>
        ) : (
          <div className="bg-surface border border-border rounded-lg divide-y divide-border">
            {contacts.map((c) => (
              <div key={c.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-text-base">{c.name}</p>
                      <Badge variant={c.status === "new" ? "warning" : "default"}>{c.status}</Badge>
                    </div>
                    <p className="text-sm text-text-muted">{c.email}</p>
                    {c.subject && <p className="text-sm text-text-muted italic">{c.subject}</p>}
                    <p className="text-sm text-text-base mt-2 leading-relaxed">{c.message}</p>
                    <div className="flex gap-2 mt-3">
                      <a
                        href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject ?? "your message")}`}
                        className="text-xs text-primary hover:opacity-80 font-medium"
                      >
                        Reply via email
                      </a>
                      {c.status === "new" && (
                        <button
                          onClick={() => updateContactStatus(c.id, "read")}
                          className="text-xs text-text-muted hover:text-text-base"
                        >
                          Mark as read
                        </button>
                      )}
                      {c.status !== "spam" && (
                        <button
                          onClick={() => updateContactStatus(c.id, "spam")}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Mark spam
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text-muted flex-shrink-0">
                    {formatDate(c.created_at, { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Subscribers */}
      <section>
        <h2 className="font-serif text-xl font-semibold text-text-base mb-4">
          Newsletter subscribers
        </h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-surface-alt animate-pulse rounded-lg" />)}
          </div>
        ) : subscribers.length === 0 ? (
          <p className="text-text-muted text-sm">No subscribers yet.</p>
        ) : (
          <div className="bg-surface border border-border rounded-lg divide-y divide-border">
            {subscribers.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-xs font-semibold text-text-muted flex-shrink-0">
                    {(s.first_name ?? s.email)[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    {s.first_name && (
                      <p className="text-sm font-medium text-text-base">{s.first_name}</p>
                    )}
                    <p className="text-sm text-text-muted truncate">{s.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge variant={s.status === "active" ? "success" : "default"}>
                    {s.status}
                  </Badge>
                  <p className="text-xs text-text-muted hidden sm:block">
                    {formatDate(s.created_at, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Send history */}
      <section>
        <h2 className="font-serif text-xl font-semibold text-text-base mb-4">
          Send history
        </h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-16 bg-surface-alt animate-pulse rounded-lg" />)}
          </div>
        ) : sends.length === 0 ? (
          <p className="text-text-muted text-sm">No newsletters sent yet.</p>
        ) : (
          <div className="bg-surface border border-border rounded-lg divide-y divide-border">
            {sends.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-4 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-surface-alt text-text-muted flex-shrink-0">
                    <Mail size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-base truncate">{s.subject}</p>
                    {s.preview_text && (
                      <p className="text-xs text-text-muted truncate">{s.preview_text}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {s.recipient_count ?? "—"} sent
                  </span>
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <Clock size={12} />
                    {s.sent_at
                      ? formatDate(s.sent_at, { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Send modal */}
      {sendOpen && (
        <NewsletterSendModal
          recipientCount={activeCount}
          onClose={() => setSendOpen(false)}
        />
      )}
    </div>
  );
}

function NewsletterSendModal({
  recipientCount,
  onClose,
}: {
  recipientCount: number;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }
    if (!confirm(`Send to ${recipientCount} subscriber${recipientCount !== 1 ? "s" : ""}?`)) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, preview_text: previewText, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      toast.success(`Sent to ${data.sent} subscriber${data.sent !== 1 ? "s" : ""}`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Send newsletter" size="xl">
      <div className="space-y-4">
        <p className="text-sm text-text-muted">
          This will send to <strong>{recipientCount} active subscriber{recipientCount !== 1 ? "s" : ""}</strong>. This cannot be undone.
        </p>
        <Input
          label="Subject line"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What's on your mind this time"
        />
        <Input
          label="Preview text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Shown in email clients after the subject line"
          helper="Optional — if blank, email clients use the first line of the email body."
        />
        <div>
          <label className="text-sm font-medium text-text-base mb-1.5 block">Body</label>
          <RichTextEditor content={body} onChange={setBody} />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={send} loading={sending}>
            <Send size={14} className="mr-1.5" />
            Send to {recipientCount} subscriber{recipientCount !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
