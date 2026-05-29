import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";

interface AuditOptions {
  userId?: string;
  action: string;
  tableName?: string;
  recordId?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
}

export async function writeAuditLog(opts: AuditOptions): Promise<void> {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = headersList.get("user-agent") ?? null;

  const supabase = createAdminClient();
  await supabase.from("audit_logs").insert({
    user_id: opts.userId ?? null,
    action: opts.action,
    table_name: opts.tableName ?? null,
    record_id: opts.recordId ?? null,
    old_data: opts.oldData ?? null,
    new_data: opts.newData ?? null,
    ip_address: ip,
    user_agent: userAgent,
  });
}
