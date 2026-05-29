import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { FileText, Image, Briefcase, Mail, MessageSquare, ClipboardList, ArrowRight, PenLine } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

async function getDashboardStats() {
  const supabase = createAdminClient();
  const [pages, media, projects, subscribers, contacts, posts, drafts, audits] = await Promise.all([
    supabase.from("pages").select("id, status", { count: "exact" }),
    supabase.from("media").select("id", { count: "exact" }),
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("contact_submissions").select("id", { count: "exact" }).eq("status", "new"),
    supabase.from("posts").select("id", { count: "exact" }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact" }).eq("status", "draft"),
    supabase
      .from("audit_logs")
      .select("id, action, table_name, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    pageCount: pages.count ?? 0,
    mediaCount: media.count ?? 0,
    projectCount: projects.count ?? 0,
    subscriberCount: subscribers.count ?? 0,
    newContactCount: contacts.count ?? 0,
    publishedPostCount: posts.count ?? 0,
    draftPostCount: drafts.count ?? 0,
    recentActivity: audits.data ?? [],
  };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getDashboardStats();

  const statCards = [
    { label: "Published posts", value: stats.publishedPostCount, icon: PenLine, href: "/admin/writing", color: "text-indigo-600 bg-indigo-50" },
    { label: "Drafts", value: stats.draftPostCount, icon: FileText, href: "/admin/writing", color: "text-slate-600 bg-slate-100" },
    { label: "Subscribers", value: stats.subscriberCount, icon: Mail, href: "/admin/newsletter", color: "text-amber-600 bg-amber-50" },
    { label: "New messages", value: stats.newContactCount, icon: MessageSquare, href: "/admin/newsletter", color: "text-red-600 bg-red-50" },
    { label: "Media files", value: stats.mediaCount, icon: Image, href: "/admin/media", color: "text-purple-600 bg-purple-50" },
    { label: "Projects", value: stats.projectCount, icon: Briefcase, href: "/admin/projects", color: "text-green-600 bg-green-50" },
    { label: "Pages", value: stats.pageCount, icon: FileText, href: "/admin/pages", color: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-text-base mb-1">Dashboard</h1>
        <p className="text-text-muted">Overview of your site.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {statCards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={href + label} href={href}>
            <Card className="hover:shadow-dropdown transition-shadow cursor-pointer">
              <CardBody className="p-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-bold text-text-base">{value}</p>
                <p className="text-xs text-text-muted mt-0.5">{label}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-text-base mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "New post", href: "/admin/writing", desc: "Write and publish an essay or note" },
            { label: "Edit pages", href: "/admin/pages", desc: "Update page content and sections" },
            { label: "Upload media", href: "/admin/media", desc: "Add images, videos, or documents" },
            { label: "Add project", href: "/admin/projects", desc: "Create a new project entry" },
            { label: "Update CV", href: "/admin/cv", desc: "Edit education, training, publications" },
            { label: "Change theme", href: "/admin/theme", desc: "Update colors, typography, layout" },
            { label: "View messages", href: "/admin/newsletter", desc: "Read contact form submissions" },
          ].map(({ label, href, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg hover:border-primary/30 hover:shadow-card transition-all group"
            >
              <div>
                <p className="font-medium text-text-base group-hover:text-primary transition-colors">
                  {label}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{desc}</p>
              </div>
              <ArrowRight size={16} className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-text-base">Recent activity</h2>
          <Link href="/admin/audit" className="text-sm text-primary hover:opacity-80 transition-opacity">
            View all
          </Link>
        </div>
        <Card>
          <div className="divide-y divide-border">
            {stats.recentActivity.length === 0 && (
              <div className="px-5 py-8 text-center text-text-muted text-sm">No activity yet.</div>
            )}
            {stats.recentActivity.map((log: { id: string; action: string; table_name: string | null; created_at: string }) => (
              <div key={log.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <ClipboardList size={15} className="text-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-base capitalize">
                    {log.action}
                    {log.table_name && (
                      <span className="text-text-muted"> · {log.table_name}</span>
                    )}
                  </span>
                </div>
                <span className="text-xs text-text-muted flex-shrink-0">
                  {formatDate(log.created_at, { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
