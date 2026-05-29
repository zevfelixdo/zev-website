import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Call at the top of any admin Server Component to gate access
export async function requireAdmin() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!roleRow) {
    redirect("/admin/login?error=unauthorized");
  }

  return { user, role: roleRow.role as "admin" | "editor" };
}
