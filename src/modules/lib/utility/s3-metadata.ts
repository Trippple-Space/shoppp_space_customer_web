/**
 * Normalize and truncate raw key-value metadata for S3 user-defined metadata.
 * S3 limits: keys alphanumeric + hyphen; total size of all x-amz-meta-* keys and values <= 2KB.
 */

const S3_METADATA_MAX_BYTES = 2048;
const S3_META_PREFIX = 'x-amz-meta-';
const MAX_VALUE_BYTES = 400;
const KEY_REGEX = /[^a-z0-9-]/g;

function sanitizeKey(key: string): string {
  return key.replace(KEY_REGEX, '-').toLowerCase().slice(0, 128) || 'key';
}

function truncateUtf8(str: string, maxBytes: number): string {
  const buf = Buffer.from(str, 'utf8');
  if (buf.length <= maxBytes) return str;
  let n = maxBytes;
  while (n > 0 && (buf[n] & 0xc0) === 0x80) n--;
  return buf.toString('utf8', 0, n);
}

function toHeaderKey(key: string): string {
  const sanitized = sanitizeKey(key);
  return sanitized.startsWith(S3_META_PREFIX)
    ? sanitized
    : `${S3_META_PREFIX}${sanitized}`;
}

export function normalizeS3Metadata(
  raw: Record<string, unknown> | null | undefined
): {
  Metadata: Record<string, string>;
  metadataHeaders: Record<string, string>;
} {
  const Metadata: Record<string, string> = {};
  const metadataHeaders: Record<string, string> = {};
  if (!raw || typeof raw !== 'object') {
    return { Metadata, metadataHeaders };
  }

  let totalBytes = 0;
  const entries = Object.entries(raw).filter(
    (e): e is [string, string | number | boolean] =>
      e[0] != null &&
      e[1] != null &&
      (typeof e[1] === 'string' ||
        typeof e[1] === 'number' ||
        typeof e[1] === 'boolean')
  );

  for (const [k, v] of entries) {
    const key = sanitizeKey(k);
    if (!key) continue;
    let value = truncateUtf8(String(v), MAX_VALUE_BYTES);
    const headerKey = toHeaderKey(key);
    const s3ParamKey = headerKey.replace(S3_META_PREFIX, '');
    let entrySize =
      Buffer.byteLength(headerKey, 'utf8') + Buffer.byteLength(value, 'utf8');
    if (totalBytes + entrySize > S3_METADATA_MAX_BYTES) {
      const remaining =
        S3_METADATA_MAX_BYTES -
        totalBytes -
        Buffer.byteLength(headerKey, 'utf8') -
        1;
      if (remaining <= 0) break;
      value = truncateUtf8(value, remaining);
      entrySize =
        Buffer.byteLength(headerKey, 'utf8') + Buffer.byteLength(value, 'utf8');
      if (value.length === 0) break;
    }
    Metadata[s3ParamKey] = value;
    metadataHeaders[headerKey] = value;
    totalBytes += entrySize;
  }

  return { Metadata, metadataHeaders };
}
