import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Zev Felix · Physician · Storyteller · Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Embed the cartoon so the card renders without a network round-trip.
const bikeSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/cartoons/bike-w-maisy.png")
).toString("base64")}`;

const dot = (color: string, size: number, top: number, left: number) => (
  <div
    style={{ position: "absolute", top, left, width: size, height: size, borderRadius: size, background: color }}
  />
);

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          background: "#FFF8F0",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* bright background shapes */}
        <div style={{ position: "absolute", top: -120, left: -120, width: 420, height: 420, borderRadius: 420, background: "rgba(91,164,201,0.25)" }} />
        <div style={{ position: "absolute", bottom: -160, right: 120, width: 460, height: 460, borderRadius: 460, background: "rgba(244,201,93,0.30)" }} />
        <div style={{ position: "absolute", bottom: -90, left: 280, width: 280, height: 280, borderRadius: 280, background: "rgba(226,120,91,0.16)" }} />
        {/* confetti dots */}
        {dot("#E2785B", 22, 90, 92)}
        {dot("#74B36E", 16, 470, 120)}
        {dot("#EA8C46", 18, 150, 980)}

        {/* text */}
        <div style={{ display: "flex", flexDirection: "column", padding: "0 64px", maxWidth: 700, zIndex: 10 }}>
          <div style={{ width: 64, height: 5, background: "rgb(30,64,48)", borderRadius: 3, marginBottom: 32 }} />
          <p
            style={{
              fontSize: 20,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgb(30,64,48)",
              marginBottom: 18,
              fontWeight: 700,
            }}
          >
            Physician · Storyteller · Builder
          </p>
          <h1 style={{ fontSize: 104, fontWeight: 800, color: "rgb(35,30,25)", lineHeight: 1.05, margin: 0 }}>
            Zev Felix
          </h1>
          <p style={{ fontSize: 30, color: "rgb(95,90,80)", lineHeight: 1.45, marginTop: 24 }}>
            Family Medicine, Camp Grounded, climbing, and the art of staying human.
          </p>
        </div>

        <p style={{ position: "absolute", bottom: 46, left: 128, fontSize: 20, color: "rgb(160,145,125)", zIndex: 10 }}>
          zevfelix.com
        </p>

        {/* cartoon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bikeSrc}
          alt=""
          width={460}
          height={441}
          style={{ position: "absolute", right: 40, bottom: 60, zIndex: 10 }}
        />
      </div>
    ),
    { ...size }
  );
}
