"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text from a temp input
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-3" data-noprint>
      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Share
      </span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter (opens in new tab)"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-text-muted hover:text-text-base hover:border-text-muted transition-colors"
      >
        <Twitter size={14} aria-hidden="true" />
        Twitter
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn (opens in new tab)"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-text-muted hover:text-text-base hover:border-text-muted transition-colors"
      >
        <Linkedin size={14} aria-hidden="true" />
        LinkedIn
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-text-muted hover:text-text-base hover:border-text-muted transition-colors"
      >
        {copied ? (
          <>
            <Check size={14} className="text-green-600" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <Link2 size={14} />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
