import type {
  CommunicationBlock,
  CommunicationContentDocument,
} from "../../services/communicationService";

function safeHttpsUrl(value?: string) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function videoEmbedUrl(value?: string) {
  const url = safeHttpsUrl(value);
  if (!url) return null;
  const parsed = new URL(url);
  if (parsed.hostname === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`
      : null;
  }
  if (parsed.hostname.endsWith("youtube.com")) {
    const id = parsed.searchParams.get("v");
    return id
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`
      : null;
  }
  if (parsed.hostname.endsWith("vimeo.com")) {
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const id = pathParts[pathParts.length - 1];
    return id
      ? `https://player.vimeo.com/video/${encodeURIComponent(id)}`
      : null;
  }
  return null;
}

function BlockView({ block }: { block: CommunicationBlock }) {
  if (block.type === "heading") {
    const Heading = block.level === 1 ? "h1" : block.level === 3 ? "h3" : "h2";
    return (
      <Heading
        className={
          block.level === 1
            ? "text-3xl font-bold text-slate-950"
            : block.level === 3
              ? "text-lg font-bold text-slate-800"
              : "text-2xl font-bold text-slate-900"
        }
      >
        {block.text}
      </Heading>
    );
  }
  if (block.type === "paragraph")
    return (
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {block.text}
      </p>
    );
  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return (
      <List
        className={`space-y-2 pl-5 text-sm leading-7 text-slate-700 ${block.ordered ? "list-decimal" : "list-disc"}`}
      >
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </List>
    );
  }
  if (block.type === "divider") return <hr className="border-slate-200" />;
  if (block.type === "section")
    return (
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-bold text-slate-900">{block.heading}</h2>
        {block.body && (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {block.body}
          </p>
        )}
      </section>
    );
  if (block.type === "image") {
    const url = safeHttpsUrl(block.url);
    return url ? (
      <figure>
        <img
          src={url}
          alt={block.alt || "School communication"}
          className="max-h-[30rem] w-full rounded-2xl object-cover"
        />
        {block.caption && (
          <figcaption className="mt-2 text-center text-xs text-slate-500">
            {block.caption}
          </figcaption>
        )}
      </figure>
    ) : null;
  }
  if (block.type === "button") {
    const url = safeHttpsUrl(block.url);
    return url ? (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex rounded-xl bg-[#081a2b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f8a5f]"
      >
        {block.label}
      </a>
    ) : null;
  }
  if (block.type === "event") {
    const rsvpUrl = safeHttpsUrl(block.rsvpUrl);
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
          School event
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">{block.title}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-700">
          {block.date}
          {block.time ? ` · ${block.time}` : ""}
          {block.location ? ` · ${block.location}` : ""}
        </p>
        {block.description && (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {block.description}
          </p>
        )}
        {rsvpUrl && (
          <a
            href={rsvpUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            RSVP
          </a>
        )}
      </section>
    );
  }
  if (block.type === "video") {
    const embedUrl = videoEmbedUrl(block.url);
    const url = safeHttpsUrl(block.url);
    return (
      <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
        <div className="aspect-video bg-slate-900">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={block.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : block.thumbnailUrl && safeHttpsUrl(block.thumbnailUrl) ? (
            <img
              src={safeHttpsUrl(block.thumbnailUrl)!}
              alt={block.alt || block.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <figcaption className="flex items-center justify-between gap-3 p-4 text-sm text-white">
          <span className="font-semibold">{block.title}</span>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-xs font-bold hover:bg-white/25"
            >
              Open video
            </a>
          )}
        </figcaption>
      </figure>
    );
  }
  return null;
}

export default function PortalCommunicationContent({
  document,
  fallbackMessage,
}: {
  document?: CommunicationContentDocument | null;
  fallbackMessage: string;
}) {
  const blocks = document?.blocks?.filter(Boolean) ?? [];
  if (!blocks.length)
    return (
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {fallbackMessage}
      </p>
    );
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => (
        <BlockView key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
