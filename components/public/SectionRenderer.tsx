import Image from "next/image";
import Link from "next/link";
import type { PageSection } from "@/types/database";
import { VideoEmbed } from "./VideoEmbed";
import { ImageGallery, type GalleryImage } from "./ImageGallery";
import { ContactForm } from "./ContactForm";
import { NewsletterForm } from "./NewsletterForm";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// ──────────────────────────────────────────────────────────
// Individual section renderers
// ──────────────────────────────────────────────────────────

function HeroSection({ content }: { content: Record<string, unknown> }) {
  const bg = content.backgroundImageUrl as string | undefined;
  const bgVideo = content.backgroundVideoUrl as string | undefined;
  const heading = content.heading as string | undefined;
  const subheading = content.subheading as string | undefined;
  const ctaLabel = content.ctaLabel as string | undefined;
  const ctaHref = content.ctaHref as string | undefined;
  const ctaSecondaryLabel = content.ctaSecondaryLabel as string | undefined;
  const ctaSecondaryHref = content.ctaSecondaryHref as string | undefined;
  const overlayOpacity = (content.overlayOpacity as number | undefined) ?? 0.4;
  const textDark = content.textDark as boolean | undefined;

  const hasMedia = bg || bgVideo;
  const textColor = hasMedia ? (textDark ? "text-text-base" : "text-white") : "text-text-base";
  const subColor = hasMedia ? (textDark ? "text-text-muted" : "text-white/80") : "text-text-muted";

  return (
    <section className={cn("relative flex items-center", hasMedia ? "min-h-[60vh] sm:min-h-[70vh]" : "section-y")}>
      {/* Background image */}
      {bg && !bgVideo && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bg}
            alt=""
            role="presentation"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
            aria-hidden
          />
        </>
      )}

      {/* Background video */}
      {bgVideo && (
        <>
          <video
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
            aria-hidden
          />
        </>
      )}

      {/* Content */}
      <div className="relative container-content w-full py-16 sm:py-24">
        <div className="max-w-3xl">
          {heading && (
            <h1 className={cn("font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight mb-6", textColor)}>
              {heading}
            </h1>
          )}
          {subheading && (
            <p className={cn("text-xl leading-relaxed mb-8 max-w-2xl", subColor)}>
              {subheading}
            </p>
          )}
          {(ctaLabel || ctaSecondaryLabel) && (
            <div className="flex flex-wrap gap-3">
              {ctaLabel && ctaHref && (
                <Link
                  href={ctaHref}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-3 rounded font-medium text-sm transition-opacity hover:opacity-90 min-h-[48px]",
                    hasMedia
                      ? "bg-white text-text-base"
                      : "bg-primary text-white"
                  )}
                >
                  {ctaLabel}
                </Link>
              )}
              {ctaSecondaryLabel && ctaSecondaryHref && (
                <Link
                  href={ctaSecondaryHref}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-3 rounded font-medium text-sm transition-opacity hover:opacity-90 min-h-[48px]",
                    hasMedia
                      ? "border border-white/60 text-white hover:bg-white/10"
                      : "border border-border text-text-base hover:bg-surface-alt"
                  )}
                >
                  {ctaSecondaryLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RichTextSection({ content }: { content: Record<string, unknown> }) {
  const html = (content.html ?? content.text) as string | undefined;
  if (!html) return null;
  return (
    <section className="section-y">
      <div className="container-content">
        <div
          className="prose-content max-w-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}

function IntroTextSection({ content }: { content: Record<string, unknown> }) {
  const text = (content.html ?? content.text) as string | undefined;
  if (!text) return null;
  // If it's HTML (from TipTap), render it; otherwise wrap in <p>
  const isHtml = text.startsWith("<");
  return (
    <section className="section-y container-content">
      {isHtml ? (
        <div className="prose-content max-w-2xl" dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        <p className="text-lg text-text-base leading-relaxed max-w-2xl">{text}</p>
      )}
    </section>
  );
}

function ImageTextSection({ content }: { content: Record<string, unknown> }) {
  const imageUrl = content.imageUrl as string | undefined;
  // Empty string alt marks an image as decorative (valid); admin should fill this in
  const imageAlt = (content.imageAlt as string) ?? "";
  const caption = content.caption as string | undefined;
  const html = (content.html ?? content.text) as string | undefined;
  const imageRight = content.imageRight as boolean | undefined;
  const heading = content.heading as string | undefined;

  if (!imageUrl && !html) return null;

  return (
    <section className="section-y">
      <div className="container-content">
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center",
            imageRight && "lg:[&>*:first-child]:order-last"
          )}
        >
          {/* Image */}
          {imageUrl && (
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full rounded-xl object-cover max-h-[600px]"
                loading="lazy"
              />
              {caption && (
                <figcaption className="text-xs text-center text-text-muted mt-2">
                  {caption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Text */}
          {(heading || html) && (
            <div>
              {heading && (
                <h2 className="font-serif text-3xl font-semibold text-text-base mb-4">
                  {heading}
                </h2>
              )}
              {html && (
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ content }: { content: Record<string, unknown> }) {
  const rawImages = content.images as unknown[];
  if (!rawImages?.length) return null;

  const images: GalleryImage[] = (rawImages as Record<string, unknown>[]).map((img) => ({
    url: (img.url ?? img.src ?? "") as string,
    alt: (img.alt ?? "") as string,
    caption: img.caption as string | undefined,
  }));

  const columns = (content.columns as 2 | 3 | 4) ?? 3;
  const heading = content.heading as string | undefined;
  const caption = content.caption as string | undefined;

  return (
    <section className="section-y">
      <div className="container-content">
        {heading && (
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-6">{heading}</h2>
        )}
        <ImageGallery images={images} columns={columns} caption={caption} />
      </div>
    </section>
  );
}

function VideoSection({ content }: { content: Record<string, unknown> }) {
  const url = content.url as string | undefined;
  if (!url) return null;

  const heading = content.heading as string | undefined;
  const subheading = content.subheading as string | undefined;
  const caption = content.caption as string | undefined;
  const poster = content.poster as string | undefined;
  const aspectRatio = (content.aspectRatio as "16/9" | "4/3" | "1/1") ?? "16/9";

  return (
    <section className="section-y">
      <div className="container-content">
        {heading && (
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-2">{heading}</h2>
        )}
        {subheading && (
          <p className="text-text-muted mb-6 max-w-2xl">{subheading}</p>
        )}
        <div className="max-w-4xl">
          <VideoEmbed
            url={url}
            title={heading ?? "Video"}
            poster={poster}
            caption={caption}
            aspectRatio={aspectRatio}
          />
        </div>
      </div>
    </section>
  );
}

function QuoteSection({ content }: { content: Record<string, unknown> }) {
  const text = content.text as string | undefined;
  const cite = content.cite as string | undefined;
  if (!text) return null;
  return (
    <section className="section-y container-content">
      <blockquote className="border-l-4 border-accent pl-6 max-w-2xl">
        <p className="text-xl font-serif italic text-text-base leading-relaxed mb-3">{text}</p>
        {cite && <cite className="text-sm text-text-muted not-italic">— {cite}</cite>}
      </blockquote>
    </section>
  );
}

function CalloutSection({ content }: { content: Record<string, unknown> }) {
  const title = content.title as string | undefined;
  const body = (content.body ?? content.html) as string | undefined;
  const variant = (content.variant as string) ?? "default";

  const variantClasses: Record<string, string> = {
    default: "bg-surface-alt border-border",
    primary: "bg-primary/8 border-primary/20",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <section className="section-y container-content">
      <div className={cn("border rounded-xl p-6 sm:p-8 max-w-2xl", variantClasses[variant] ?? variantClasses.default)}>
        {title && (
          <h3 className="font-serif text-xl font-semibold text-text-base mb-3">{title}</h3>
        )}
        {body && (
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: body }} />
        )}
      </div>
    </section>
  );
}

function NavCardsSection({ content }: { content: Record<string, unknown> }) {
  const cards = content.cards as { label: string; href: string; description?: string }[] | undefined;
  if (!cards?.length) return null;
  return (
    <section className="section-y bg-surface-alt">
      <div className="container-content">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col gap-2 p-6 bg-surface border border-border rounded-lg shadow-card hover:shadow-dropdown hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold text-text-base group-hover:text-primary transition-colors">
                  {card.label}
                </span>
                <ArrowRight size={16} className="text-text-muted group-hover:text-primary transition-colors" />
              </div>
              {card.description && (
                <p className="text-sm text-text-muted leading-relaxed">{card.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ content }: { content: Record<string, unknown> }) {
  const items = content.items as { period?: string; title: string; body?: string }[] | undefined;
  const heading = content.heading as string | undefined;
  if (!items?.length) return null;

  return (
    <section className="section-y bg-surface-alt">
      <div className="container-content">
        {heading && (
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-10">{heading}</h2>
        )}
        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border" aria-hidden />
          <ol className="space-y-10">
            {items.map((item, i) => (
              <li key={i} className="relative pl-14 sm:pl-16">
                <div className="absolute left-2.5 sm:left-4 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-alt" aria-hidden />
                {item.period && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    {item.period}
                  </p>
                )}
                <h3 className="font-serif text-xl font-semibold text-text-base mb-2">{item.title}</h3>
                {item.body && <p className="text-text-muted leading-relaxed">{item.body}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function CardsSection({ content }: { content: Record<string, unknown> }) {
  const cards = content.cards as { title: string; body?: string; imageUrl?: string }[] | undefined;
  const heading = content.heading as string | undefined;
  const columns = (content.columns as number) ?? 3;
  if (!cards?.length) return null;

  const gridCols: Record<number, string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="section-y">
      <div className="container-content">
        {heading && (
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-8">{heading}</h2>
        )}
        <div className={cn("grid grid-cols-1 gap-6", gridCols[columns] ?? gridCols[3])}>
          {cards.map((card, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg overflow-hidden shadow-card">
              {card.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-text-base mb-2">{card.title}</h3>
                {card.body && <p className="text-sm text-text-muted leading-relaxed">{card.body}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DividerSection() {
  return (
    <div className="container-content py-4">
      <hr className="border-border" />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Main dispatcher
// ──────────────────────────────────────────────────────────

interface SectionRendererProps {
  section: PageSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  if (!section.is_visible) return null;
  const content = section.content as Record<string, unknown>;

  switch (section.type) {
    case "hero":          return <HeroSection content={content} />;
    case "rich_text":     return <RichTextSection content={content} />;
    case "intro_text":    return <IntroTextSection content={content} />;
    case "image_text":    return <ImageTextSection content={content} />;
    case "gallery":       return <GallerySection content={content} />;
    case "video":         return <VideoSection content={content} />;
    case "quote":         return <QuoteSection content={content} />;
    case "callout":       return <CalloutSection content={content} />;
    case "nav_cards":     return <NavCardsSection content={content} />;
    case "timeline":      return <TimelineSection content={content} />;
    case "cards":         return <CardsSection content={content} />;
    case "divider":       return <DividerSection />;
    case "contact_form":  return (
      <section className="section-y container-content">
        <div className="max-w-md">
          <h2 className="font-serif text-2xl font-semibold text-text-base mb-6">
            {(content.heading as string) ?? "Get in touch"}
          </h2>
          <ContactForm />
        </div>
      </section>
    );
    case "newsletter_form": return (
      <section className="section-y container-content">
        <div className="max-w-md">
          <h2 className="font-serif text-2xl font-semibold text-text-base mb-3">
            {(content.heading as string) ?? "Join the newsletter"}
          </h2>
          {!!content.subheading && (
            <p className="text-text-muted mb-6 text-sm">{String(content.subheading)}</p>
          )}
          <NewsletterForm />
        </div>
      </section>
    );
    default:
      return null;
  }
}

// ──────────────────────────────────────────────────────────
// List renderer (convenience wrapper)
// ──────────────────────────────────────────────────────────

interface SectionListProps {
  sections: PageSection[];
}

export function SectionList({ sections }: SectionListProps) {
  const visible = sections.filter((s) => s.is_visible);
  if (visible.length === 0) return null;
  return (
    <>
      {visible.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}
