"use client";

import { useState } from "react";
import { Play } from "lucide-react";

type VideoType = "youtube" | "vimeo" | "native" | "unknown";

function detectType(url: string): VideoType {
  if (!url) return "unknown";
  if (/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(url)) return "youtube";
  if (/(?:vimeo\.com\/)/.test(url)) return "vimeo";
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return "native";
  return "unknown";
}

function toYouTubeEmbed(url: string): string {
  const match =
    url.match(/[?&]v=([^&]+)/) ??
    url.match(/youtu\.be\/([^?]+)/) ??
    url.match(/embed\/([^?]+)/) ??
    url.match(/shorts\/([^?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : url;
}

function toVimeoEmbed(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}?dnt=1` : url;
}

interface VideoEmbedProps {
  url: string;
  title?: string;
  poster?: string;        // poster image URL for native video or YouTube thumbnail
  autoplay?: boolean;     // native video only
  loop?: boolean;
  muted?: boolean;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16";
  className?: string;
  caption?: string;
}

export function VideoEmbed({
  url,
  title = "Video",
  poster,
  autoplay = false,
  loop = false,
  muted = false,
  aspectRatio = "16/9",
  className,
  caption,
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(autoplay);
  const type = detectType(url);

  const paddingMap: Record<string, string> = {
    "16/9": "56.25%",
    "4/3": "75%",
    "1/1": "100%",
    "9/16": "177.78%",
  };

  const wrapperStyle = {
    position: "relative" as const,
    paddingBottom: paddingMap[aspectRatio] ?? "56.25%",
    height: 0,
    overflow: "hidden",
  };

  const iframeStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  };

  if (type === "youtube") {
    const embedUrl = toYouTubeEmbed(url) + (autoplay ? "&autoplay=1" : "");
    return (
      <figure className={className}>
        <div style={wrapperStyle}>
          {!playing && poster ? (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/5 group"
              aria-label={`Play ${title}`}
            >
              <img
                src={poster}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="relative z-10 w-16 h-16 rounded-full bg-black/70 flex items-center justify-center group-hover:bg-black/90 transition-colors">
                <Play size={28} fill="white" className="text-white ml-1" />
              </span>
            </button>
          ) : (
            <iframe
              src={playing && !autoplay ? embedUrl + "&autoplay=1" : embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={iframeStyle}
            />
          )}
        </div>
        {caption && (
          <figcaption className="text-xs text-center text-text-muted mt-2">{caption}</figcaption>
        )}
      </figure>
    );
  }

  if (type === "vimeo") {
    const embedUrl = toVimeoEmbed(url) + (autoplay ? "&autoplay=1" : "");
    return (
      <figure className={className}>
        <div style={wrapperStyle}>
          <iframe
            src={embedUrl}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={iframeStyle}
          />
        </div>
        {caption && (
          <figcaption className="text-xs text-center text-text-muted mt-2">{caption}</figcaption>
        )}
      </figure>
    );
  }

  if (type === "native") {
    return (
      <figure className={className}>
        <video
          src={url}
          poster={poster}
          autoPlay={autoplay}
          loop={loop}
          muted={muted || autoplay}
          playsInline
          controls={!autoplay}
          className="w-full rounded-lg"
          preload="metadata"
        >
          Your browser does not support HTML5 video.
        </video>
        {caption && (
          <figcaption className="text-xs text-center text-text-muted mt-2">{caption}</figcaption>
        )}
      </figure>
    );
  }

  return (
    <p className="text-sm text-text-muted italic">
      Unsupported video URL: {url}
    </p>
  );
}
