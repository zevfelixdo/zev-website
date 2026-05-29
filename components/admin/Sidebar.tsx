"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Image,
  Briefcase,
  GraduationCap,
  Palette,
  Mail,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/writing", label: "Writing", icon: BookOpen },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/cv", label: "CV & Publications", icon: GraduationCap },
  { href: "/admin/theme", label: "Theme Editor", icon: Palette },
  { href: "/admin/newsletter", label: "Subscribers", icon: Mail },
  { href: "/admin/audit", label: "Audit Log", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  user: SupabaseUser;
  role: string;
}

export function AdminSidebar({ user, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" target="_blank" className="block">
          <p className="font-serif text-lg font-semibold text-text-base">Zev Felix</p>
          <p className="text-xs text-text-muted mt-0.5">Admin Dashboard</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors min-h-[44px]",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:text-text-base hover:bg-surface"
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-4 pt-2 border-t border-border space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <User size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-base truncate">{user.email}</p>
            <p className="text-xs text-text-muted capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-text-muted hover:text-text-base hover:bg-surface transition-colors min-h-[44px]"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 bg-surface border-b border-border">
        <p className="font-serif font-semibold text-text-base">Admin</p>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors"
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-14 bottom-0 w-64 bg-surface border-r border-border shadow-modal overflow-hidden">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-surface border-r border-border">
        <SidebarContent />
      </div>
    </>
  );
}
