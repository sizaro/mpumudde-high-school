export type CommunicationFormat = "ANNOUNCEMENT" | "NEWSLETTER" | "INVITATION" | "REMINDER";

export type CommunicationBlock =
  | { type: "heading"; text: string; level?: 1 | 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "button"; label: string; url: string }
  | { type: "divider" }
  | { type: "section"; heading: string; body?: string }
  | { type: "event"; title: string; date: string; time?: string; location?: string; description?: string; rsvpUrl?: string }
  | { type: "video"; url: string; title: string; thumbnailUrl?: string; alt?: string };

export type CommunicationContentDocument = {
  version: 1;
  blocks: CommunicationBlock[];
};

export type RenderedCommunication = { html: string; text: string };

const MAX_BLOCKS = 40;
const MAX_TEXT = 12_000;
const allowedVideoHosts = new Set([
  "youtube.com", "www.youtube.com", "youtu.be", "vimeo.com", "www.vimeo.com",
  "res.cloudinary.com",
]);

export function normalizeCommunicationFormat(value?: string): CommunicationFormat {
  const format = value?.trim().toUpperCase() || "ANNOUNCEMENT";
  if (!["ANNOUNCEMENT", "NEWSLETTER", "INVITATION", "REMINDER"].includes(format)) {
    throw new Error("Unsupported communication format.");
  }
  return format as CommunicationFormat;
}

export function validateCommunicationDocument(input: unknown): CommunicationContentDocument {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Provide a structured communication document.");
  }
  const value = input as { version?: unknown; blocks?: unknown };
  if (value.version !== 1 || !Array.isArray(value.blocks) || !value.blocks.length || value.blocks.length > MAX_BLOCKS) {
    throw new Error("The communication document must contain between 1 and 40 content blocks.");
  }

  let totalText = 0;
  const blocks = value.blocks.map((raw): CommunicationBlock => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Invalid content block.");
    const block = raw as Record<string, unknown>;
    const type = text(block.type, 30).toLowerCase();
    const count = (item: string) => { totalText += item.length; return item; };
    switch (type) {
      case "heading": return { type, text: count(text(block.text, 220)), level: headingLevel(block.level) };
      case "paragraph": return { type, text: count(text(block.text, 2_500)) };
      case "list": {
        if (!Array.isArray(block.items) || !block.items.length || block.items.length > 20) throw new Error("Lists need between 1 and 20 items.");
        return { type, items: block.items.map((item) => count(text(item, 300))), ordered: Boolean(block.ordered) };
      }
      case "image": return { type, url: safeUrl(block.url, "image URL"), alt: count(text(block.alt, 180)), caption: optionalText(block.caption, 300) };
      case "button": return { type, label: count(text(block.label, 80)), url: safeUrl(block.url, "button URL") };
      case "divider": return { type };
      case "section": return { type, heading: count(text(block.heading, 220)), body: optionalText(block.body, 2_500) };
      case "event": return { type, title: count(text(block.title, 220)), date: count(text(block.date, 120)), time: optionalText(block.time, 120), location: optionalText(block.location, 220), description: optionalText(block.description, 1_500), rsvpUrl: block.rsvpUrl ? safeUrl(block.rsvpUrl, "RSVP URL") : undefined };
      case "video": {
        const url = safeUrl(block.url, "video URL");
        const host = new URL(url).hostname.toLowerCase();
        if (!allowedVideoHosts.has(host)) throw new Error("Use YouTube, Vimeo, or an approved school video URL.");
        return { type, url, title: count(text(block.title, 220)), thumbnailUrl: block.thumbnailUrl ? safeUrl(block.thumbnailUrl, "video thumbnail URL") : undefined, alt: optionalText(block.alt, 180) };
      }
      default: throw new Error("Unsupported content block.");
    }
  });
  if (totalText > MAX_TEXT) throw new Error("The communication content is too long.");
  return { version: 1, blocks };
}

export function plainTextFromDocument(document: CommunicationContentDocument): string {
  return document.blocks.map((block) => {
    switch (block.type) {
      case "heading": return block.text;
      case "paragraph": return block.text;
      case "list": return block.items.map((item, index) => `${block.ordered ? `${index + 1}.` : "•"} ${item}`).join("\n");
      case "image": return [block.alt, block.caption].filter(Boolean).join(" — ");
      case "button": return `${block.label}: ${block.url}`;
      case "divider": return "----------";
      case "section": return [block.heading, block.body].filter(Boolean).join("\n");
      case "event": return [block.title, block.date, block.time, block.location, block.description, block.rsvpUrl].filter(Boolean).join("\n");
      case "video": return `Watch ${block.title}: ${block.url}`;
    }
  }).join("\n\n").trim();
}

export function renderSchoolCommunication(input: {
  subject: string;
  format: CommunicationFormat;
  document?: CommunicationContentDocument | null;
  fallbackMessage: string;
  isTest?: boolean;
  logoUrl?: string;
}): RenderedCommunication {
  const text = input.document ? plainTextFromDocument(input.document) : input.fallbackMessage;
  const category = input.format.charAt(0) + input.format.slice(1).toLowerCase();
  const content = input.document ? input.document.blocks.map(renderBlock).join("") : paragraph(input.fallbackMessage);
  const testBanner = input.isTest ? '<tr><td style="padding:12px 28px;background:#fff3cd;color:#694b00;font:600 13px Arial,sans-serif;text-align:center">TEST EMAIL — not sent to the selected audience</td></tr>' : "";
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f3f6f8"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6f8"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:16px;overflow:hidden"><tr><td style="padding:28px;background:#081a2b;color:#ffffff">${input.logoUrl ? `<img src="${escapeAttribute(input.logoUrl)}" alt="Mpumudde High School" style="display:block;max-width:92px;max-height:62px;width:auto;height:auto;margin:0 0 14px"/>` : ""}<div style="font:700 22px Arial,sans-serif">Mpumudde High School</div><div style="margin-top:7px;font:600 12px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#d9a21b">Official ${escapeHtml(category)}</div></td></tr>${testBanner}<tr><td style="padding:30px 28px 8px"><h1 style="margin:0;color:#081a2b;font:700 28px/1.25 Arial,sans-serif">${escapeHtml(input.subject)}</h1><p style="margin:10px 0 0;color:#607080;font:14px Arial,sans-serif">Published ${escapeHtml(new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date()))}</p></td></tr><tr><td style="padding:12px 28px 30px;color:#27364a;font:16px/1.65 Arial,sans-serif">${content}</td></tr><tr><td style="padding:22px 28px;background:#f6f8fa;color:#58697c;font:13px/1.55 Arial,sans-serif"><strong style="color:#081a2b">Mpumudde High School</strong><br/>Mpumudde, Jinja District, Uganda<br/><a href="mailto:info@mpumuddehs.ac.ug" style="color:#0f8a5f">info@mpumuddehs.ac.ug</a></td></tr></table></td></tr></table></body></html>`;
  return { html, text };
}

function renderBlock(block: CommunicationBlock): string {
  switch (block.type) {
    case "heading": return `<h${block.level ?? 2} style="margin:26px 0 10px;color:#081a2b;font:700 ${block.level === 1 ? 25 : block.level === 3 ? 17 : 21}px/1.3 Arial,sans-serif">${formatInline(block.text)}</h${block.level ?? 2}>`;
    case "paragraph": return paragraph(block.text);
    case "list": return `<${block.ordered ? "ol" : "ul"} style="margin:14px 0;padding-left:24px">${block.items.map((item) => `<li style="margin:7px 0">${formatInline(item)}</li>`).join("")}</${block.ordered ? "ol" : "ul"}>`;
    case "image": return `<div style="margin:22px 0"><img src="${escapeAttribute(block.url)}" alt="${escapeAttribute(block.alt)}" style="display:block;width:100%;max-width:624px;height:auto;border-radius:10px"/>${block.caption ? `<p style="margin:8px 0 0;color:#6b7785;font-size:13px">${escapeHtml(block.caption)}</p>` : ""}</div>`;
    case "button": return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:22px 0"><tr><td style="border-radius:8px;background:#0f8a5f"><a href="${escapeAttribute(block.url)}" style="display:inline-block;padding:12px 18px;color:#ffffff;text-decoration:none;font:700 14px Arial,sans-serif">${escapeHtml(block.label)}</a></td></tr></table>`;
    case "divider": return '<hr style="margin:28px 0;border:0;border-top:1px solid #dce3e9"/>';
    case "section": return `<section style="margin:22px 0;padding:20px;border-left:4px solid #d9a21b;background:#f8fafb"><h2 style="margin:0 0 8px;color:#081a2b;font:700 20px Arial,sans-serif">${formatInline(block.heading)}</h2>${block.body ? paragraph(block.body) : ""}</section>`;
    case "event": return `<div style="margin:24px 0;padding:22px;border:1px solid #dce3e9;border-radius:12px"><div style="color:#0f8a5f;font:700 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:1px">School event</div><h2 style="margin:8px 0;color:#081a2b;font:700 22px Arial,sans-serif">${formatInline(block.title)}</h2><p style="margin:0 0 10px"><strong>${escapeHtml(block.date)}</strong>${block.time ? ` · ${escapeHtml(block.time)}` : ""}${block.location ? `<br/>${escapeHtml(block.location)}` : ""}</p>${block.description ? paragraph(block.description) : ""}${block.rsvpUrl ? renderBlock({ type: "button", label: "RSVP", url: block.rsvpUrl }) : ""}</div>`;
    case "video": return renderVideo(block);
  }
}

function renderVideo(block: Extract<CommunicationBlock, { type: "video" }>): string {
  const image = block.thumbnailUrl || youtubeThumbnail(block.url);
  const visual = image ? `<img src="${escapeAttribute(image)}" alt="${escapeAttribute(block.alt || block.title)}" style="display:block;width:100%;height:auto;border-radius:10px"/>` : `<div style="padding:38px 18px;background:#081a2b;color:#ffffff;text-align:center;font:700 18px Arial,sans-serif">▶ ${escapeHtml(block.title)}</div>`;
  return `<div style="margin:24px 0;border:1px solid #dce3e9;border-radius:12px;overflow:hidden">${visual}<div style="padding:16px"><strong style="display:block;color:#081a2b;font:700 17px Arial,sans-serif">${formatInline(block.title)}</strong><p style="margin:7px 0 0;color:#607080;font-size:13px">Watch the school video</p>${renderBlock({ type: "button", label: "▶ Play video", url: block.url })}</div></div>`;
}
function youtubeThumbnail(url: string): string | undefined { const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{6,})/); return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : undefined; }
function paragraph(value: string): string { return `<p style="margin:0 0 16px">${escapeHtml(value).replace(/\n/g, "<br/>")}</p>`; }
function text(value: unknown, maximum: number): string {
  if (typeof value !== "string") throw new Error("A required content value is missing or too long.");
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maximum) throw new Error("A required content value is missing or too long.");
  return trimmed;
}
function optionalText(value: unknown, maximum: number): string | undefined { if (value === undefined || value === null || value === "") return undefined; return text(value, maximum); }
function headingLevel(value: unknown): 1 | 2 | 3 { return value === 1 || value === 3 ? value : 2; }
function safeUrl(value: unknown, label: string): string { const raw = text(value, 2_000); let url: URL; try { url = new URL(raw); } catch { throw new Error(`Provide a valid ${label}.`); } if (url.protocol !== "https:") throw new Error(`${label[0].toUpperCase()}${label.slice(1)} must use HTTPS.`); return url.toString(); }
function escapeHtml(value: string): string { return value.replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character); }
function escapeAttribute(value: string): string { return escapeHtml(value); }
function formatInline(value: string): string {
  return escapeHtml(value).replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>").replace(/_(.+?)_/g, "<em>$1</em>");
}




