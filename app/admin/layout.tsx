import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/Sidebar";
import type { ReactNode } from "react";

// The middleware handles redirecting unauthenticated users away from /admin/*.
// This layout's only job is rendering the admin chrome (sidebar + content area)
// when a valid session exists. It never redirects — that prevents loops on /admin/login.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  // No session → render bare children (the login page handles its own layout)
  if (!user) {
    return <>{children}</>;
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen flex bg-surface-alt">
      <AdminSidebar
        user={user}
        role={(roleRow?.role ?? "admin") as "admin" | "editor"}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
