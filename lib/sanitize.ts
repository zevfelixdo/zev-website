import sanitizeHtml from "sanitize-html";

/**
 * Strip any potentially dangerous HTML from TipTap-generated post bodies.
 * Allows the full set of tags TipTap produces while blocking scripts,
 * event handlers, and data: URIs on links.
 */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "strong", "em", "u", "s", "del", "mark",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "a", "img",
      "hr", "figure", "figcaption",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      "div", "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "width", "height", "loading", "class"],
      code: ["class"],
      pre: ["class"],
      div: ["class"],
      span: ["class", "style"],
      th: ["colspan", "rowspan", "class"],
      td: ["colspan", "rowspan", "class"],
      p: ["class"],
      "*": ["data-*"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    // Force external links to open safely
    transformTags: {
      a: (_tagName, attribs) => {
        const isExternal =
          attribs.href &&
          (attribs.href.startsWith("http://") || attribs.href.startsWith("https://"));
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            ...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {}),
          },
        };
      },
    },
  });
}
