"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/database";
import { DarkModeToggle } from "@/components/public/DarkModeToggle";

interface NavProps {
  items: NavItem[];
  siteName?: string;
}

export function Nav({ items, siteName = "Zev Felix" }: NavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate menu open/close
  useEffect(() => {
    if (menuOpen) {
      setMenuVisible(true);
    } else {
      const t = setTimeout(() => setMenuVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const sorted = [...items].sort((a, b) => a.position - b.position);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-200",
          scrolled
            ? "bg-surface/95 backdrop-blur-md shadow-card border-b border-border"
            : "bg-surface/80 backdrop-blur-sm"
        )}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Name */}
            <Link
              href="/"
              className="font-serif text-xl font-semibold text-text-base hover:text-primary transition-colors"
            >
              {siteName}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {sorted.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "px-3 py-2 rounded text-sm font-medium transition-colors",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "text-primary bg-primary/8"
                      : "text-text-muted hover:text-text-base hover:bg-surface-alt"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/search"
                aria-label="Search"
                className="ml-2 p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Search size={18} aria-hidden="true" />
              </Link>
              <DarkModeToggle />
            </nav>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/search"
                aria-label="Search"
                className="p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Search size={20} aria-hidden="true" />
              </Link>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — animated slide-down */}
        {menuVisible && (
          <div
            ref={menuRef}
            className={cn(
              "md:hidden border-t border-border bg-surface shadow-dropdown overflow-hidden transition-all duration-200",
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
          >
            <nav className="px-4 py-3 flex flex-col gap-1" aria-label="Mobile navigation">
              {sorted.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "px-4 py-3 rounded text-base font-medium transition-colors min-h-[52px] flex items-center",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "text-primary bg-primary/8"
                      : "text-text-base hover:bg-surface-alt"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 py-2">
                <DarkModeToggle />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer so content starts below fixed header */}
      <div className="h-16" aria-hidden />
    </>
  );
}
