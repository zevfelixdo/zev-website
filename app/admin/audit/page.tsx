import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AuditLog } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

async function getAuditLogs(): Promise<AuditLog[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []) as AuditLog[];
}

const ACTION_VARIANT: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  create: "success",
  delete: "danger",
  upload: "info",
  publish: "success",
  unpublish: "warning",
  login: "default",
  update: "default",
};

export default async function AdminAuditPage() {
  await requireAdmin();
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-text-base">Audit Log</h1>
        <p className="text-text-muted mt-1">All edits, uploads, publishes, and login activity.</p>
      </div>

      {logs.length === 0 ? (
        <p className="text-text-muted text-sm">No activity recorded yet.</p>
      ) : (
        <div className="bg-surface border border-border rounded-lg divide-y divide-border">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <Badge variant={ACTION_VARIANT[log.action] ?? "default"} size="sm">
                    {log.action}
                  </Badge>
                  {log.table_name && (
                    <span className="text-xs text-text-muted">{log.table_name}</span>
                  )}
                  {log.record_id && (
                    <span className="text-xs text-text-muted font-mono truncate max-w-[120px]">
                      {log.record_id.slice(0, 8)}…
                    </span>
                  )}
                </div>
                {log.ip_address && (
                  <p className="text-xs text-text-muted">IP: {log.ip_address}</p>
                )}
              </div>
              <p className="text-xs text-text-muted flex-shrink-0 text-right">
                {formatDate(log.created_at, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
