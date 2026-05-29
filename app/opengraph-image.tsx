import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Zev Felix · Physician · Storyteller · Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFF8F0",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: 64,
            height: 4,
            background: "rgb(30, 64, 48)",
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* Eyebrow */}
        <p
          style={{
            fontSize: 18,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgb(30, 64, 48)",
            marginBottom: 24,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 600,
          }}
        >
          Physician · Storyteller · Builder
        </p>

        {/* Name */}
        <h1
          style={{
            fontSize: 96,
            fontWeight: 600,
            color: "rgb(35, 30, 25)",
            lineHeight: 1.1,
            marginBottom: 28,
          }}
        >
          Zev Felix
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 28,
            color: "rgb(110, 100, 85)",
            lineHeight: 1.5,
            maxWidth: 700,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Family medicine physician in training. Former surgical resident.
          Co-founder of Digital Detox.
        </p>

        {/* URL */}
        <p
          style={{
            position: "absolute",
            bottom: 60,
            right: 96,
            fontSize: 18,
            color: "rgb(160, 145, 125)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          zevfelix.com
        </p>
      </div>
    ),
    { ...size }
  );
}
