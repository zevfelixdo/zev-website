import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  as?: "div" | "article" | "li";
}

export function Card({ children, className, href, as: Tag = "div" }: CardProps) {
  const base = cn(
    "bg-surface border border-border rounded-lg shadow-card",
    href && "hover:shadow-dropdown transition-shadow duration-200 cursor-pointer",
    className
  );

  if (href) {
    return (
      <Tag className={base}>
        <Link href={href} className="block h-full">
          {children}
        </Link>
      </Tag>
    );
  }

  return <Tag className={base}>{children}</Tag>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 pt-6 pb-3 border-b border-border", className)}>{children}</div>
  );
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-t border-border bg-surface-alt rounded-b-lg", className)}>
      {children}
    </div>
  );
}
