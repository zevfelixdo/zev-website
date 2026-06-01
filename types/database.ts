// Auto-maintained database type definitions
// Regenerate with: npx supabase gen types typescript --project-id <id> > types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type UserRole = "admin" | "editor";
export type PageStatus = "draft" | "published";
export type ProjectStatus = "active" | "completed" | "idea" | "archived";
export type CvCategory =
  | "education"
  | "training"
  | "experience"
  | "publications"
  | "presentations"
  | "research"
  | "leadership"
  | "awards"
  | "other";
export type PubType = "article" | "chapter" | "presentation" | "poster" | "other";
export type ContactStatus = "new" | "read" | "replied" | "spam";
export type SubscriberStatus = "active" | "unsubscribed" | "bounced";

export interface Theme {
  id: string;
  name: string;
  is_active: boolean;
  config: ThemeConfig;
  created_at: string;
  updated_at: string;
}

export interface ThemeConfig {
  colors: {
    primary: string;        // "r g b" format for Tailwind CSS vars
    secondary: string;
    accent: string;
    surface: string;
    surfaceAlt: string;
    muted: string;
    textBase: string;
    textMuted: string;
    border: string;
  };
  typography: {
    fontSans: string;
    fontSerif: string;
    fontMono: string;
    baseSize: string;
    lineHeight: string;
  };
  radii: {
    sm: string;
    default: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    sectionY: string;
  };
  shadows: {
    card: string;
    dropdown: string;
    modal: string;
  };
  buttons: {
    style: "rounded" | "pill" | "square";
  };
  header: {
    style: "minimal" | "bordered" | "filled";
  };
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  position: number;
  is_external: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  og_image: string | null;
  status: PageStatus;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PageSection {
  id: string;
  page_id: string;
  type: SectionType;
  position: number;
  content: Json;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionType =
  | "hero"
  | "intro_text"
  | "rich_text"
  | "nav_cards"
  | "image_text"
  | "quote"
  | "callout"
  | "gallery"
  | "parallax"
  | "video"
  | "timeline"
  | "cards"
  | "faq"
  | "testimonials"
  | "divider"
  | "contact_form"
  | "newsletter_form"
  | "cv_section"
  | "projects_grid";

export interface Media {
  id: string;
  name: string;
  file_path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  description: string | null;
  tags: string[];
  uploaded_by: string | null;
  created_at: string;
  // Image-control layer (migration 005). Optional so code compiles pre-migration.
  focal_x?: number;
  focal_y?: number;
  is_hidden?: boolean;
  credit?: string | null;
}

export type ImageFit = "cover" | "contain" | "fill" | "original";

export interface ImagePlacement {
  id: string;
  area: string;
  media_id: string | null;
  fit: ImageFit;
  focal_x: number;
  focal_y: number;
  focal_x_mobile: number | null;
  focal_y_mobile: number | null;
  aspect: string | null;
  alt_override: string | null;
  caption: string | null;
  credit: string | null;
  is_visible: boolean;
  updated_at: string;
  media?: Media | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  body: string | null;
  image_id: string | null;
  external_url: string | null;
  status: ProjectStatus;
  tags: string[];
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  image?: Media;
}

export interface CvEntry {
  id: string;
  category: CvCategory;
  title: string;
  institution: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  url: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  volume: string | null;
  pages: string | null;
  doi: string | null;
  url: string | null;
  abstract: string | null;
  pub_type: PubType;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  status: SubscriberStatus;
  ip_address: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  ip_address: string | null;
  status: ContactStatus;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image_id: string | null;
  cover_image_url: string | null;
  tags: string[];
  reading_time_minutes: number | null;
  status: "draft" | "published";
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image?: Media;
}

export interface NewsletterSend {
  id: string;
  subject: string;
  preview_text: string | null;
  body: string;
  sent_by: string | null;
  sent_at: string;
  recipient_count: number;
  post_id: string | null;
}

export interface SearchResult {
  id: string;
  content_type: string;
  content_id: string;
  title: string;
  excerpt: string | null;
  url: string;
  tags: string[];
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_data: Json;
  new_data: Json;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface SiteSettings {
  footer: {
    tagline: string;
    email: string;
    social: { twitter: string; linkedin: string; instagram: string };
    copyright: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    ogImage: string;
  };
  contact: {
    heading: string;
    subheading: string;
    newsletterHeading: string;
    newsletterSubheading: string;
  };
}
