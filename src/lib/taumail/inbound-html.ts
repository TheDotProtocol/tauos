/** Inline CID images in HTML email bodies → data URLs for inbox rendering */

export type InlineAttachmentPart = {
  cid?: string;
  contentType: string;
  content: string;
  filename?: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function rewriteInlineCidReferences(html: string, inlineParts: InlineAttachmentPart[]): string {
  if (!html || inlineParts.length === 0) return html;

  let result = html;
  for (const part of inlineParts) {
    if (!part.content || !part.cid) continue;
    const dataUrl = `data:${part.contentType || 'application/octet-stream'};base64,${part.content}`;
    const cidVariants = [part.cid, part.cid.replace(/^<|>$/g, '')];
    for (const cid of cidVariants) {
      if (!cid) continue;
      result = result.replace(new RegExp(`cid:${escapeRegExp(cid)}`, 'gi'), dataUrl);
    }
  }
  return result;
}

export function sanitizeEmailHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function processInboundHtmlBody(
  html: string | undefined,
  textFallback: string,
  inlineParts: InlineAttachmentPart[] = [],
): string {
  const base = html?.trim() || textToHtml(textFallback);
  const withInline = rewriteInlineCidReferences(base, inlineParts);
  return sanitizeEmailHtml(withInline);
}

function textToHtml(text: string): string {
  if (!text.trim()) return '<p>No content</p>';
  return `<div>${text
    .split('\n')
    .map((line) => `<p>${escapeHtml(line) || '&nbsp;'}</p>`)
    .join('')}</div>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
