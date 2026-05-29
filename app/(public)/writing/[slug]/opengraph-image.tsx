import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";
export const alt = "Zev Felix — Writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { slug: string };
}

export default async function PostOGImage({ params }: Props) {
  try {
    const supabase = createAdminClient();
    const { data: post } = await supabase
      .from("posts")
      .select("title, excerpt, published_at, tags")
      .eq("slug", params.slug)
      .eq("status", "published")
      .single();

    const title = post?.title ?? "Writing";
    const excerpt = post?.excerpt ?? "";
    const date = post?.published_at
      ? new Date(post.published_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "linear-gradient(135deg, #f9f6f0 0%, #ede8de 100%)",
            display: "flex",
            flexDirection: "column",
            padding: "80px",
            fontFamily: "Georgia, serif",
            position: "relative",
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "#2d6a4f",
            }}
          />

          {/* Site name */}
          <p style={{ fontSize: "18px", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0, marginBottom: "48px" }}>
            Zev Felix · Writing
          </p>

          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 60 ? "44px" : "56px",
              fontWeight: 700,
              color: "#1a2b1e",
              lineHeight: 1.2,
              margin: 0,
              marginBottom: "24px",
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {title}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p
              style={{
                fontSize: "22px",
                color: "#4b5563",
                lineHeight: 1.5,
                margin: 0,
                marginBottom: "32px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {excerpt}
            </p>
          )}

          {/* Footer row */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {date && (
              <span style={{ fontSize: "16px", color: "#6b7280" }}>{date}</span>
            )}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    // Fallback generic image
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "#f9f6f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Georgia, serif",
            fontSize: "48px",
            color: "#1a2b1e",
          }}
        >
          Zev Felix
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
