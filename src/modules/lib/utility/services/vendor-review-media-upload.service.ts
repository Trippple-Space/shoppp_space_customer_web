const sanitizeBaseName = (raw: string) =>
  raw.replaceAll(/[^a-zA-Z0-9._-]+/g, '_').toLowerCase() || 'file';

const isVideoFile = (file: File) =>
  file.type.startsWith('video/') ||
  /\.(mp4|mov|webm|m4v)$/i.test(file.name);

export async function uploadVendorReviewMedia(
  file: File,
  kind: 'image' | 'video'
): Promise<string> {
  const parts = file.name.split('.');
  const extension = parts.length > 1 ? parts.pop() : '';
  const base = sanitizeBaseName(parts.join('.') || file.name);
  const folder = `vendor-reviews/${kind}`;
  const fileName = `${folder}/${base}_${Date.now()}${
    extension ? `.${extension}` : ''
  }`;

  const presignRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, fileType: file.type }),
  });
  const presignData = (await presignRes.json().catch(() => ({}))) as {
    uploadURL?: string;
    metadataHeaders?: Record<string, string>;
    error?: string;
  };
  if (!presignRes.ok || !presignData.uploadURL) {
    throw new Error(presignData.error || 'Could not start upload.');
  }

  const putHeaders: Record<string, string> = {
    'Content-Type': file.type || 'application/octet-stream',
  };
  if (presignData.metadataHeaders) {
    Object.assign(putHeaders, presignData.metadataHeaders);
  }

  const putRes = await fetch(presignData.uploadURL, {
    method: 'PUT',
    headers: putHeaders,
    body: file,
  });
  if (!putRes.ok) {
    throw new Error(`Upload failed (${putRes.status}).`);
  }

  return presignData.uploadURL.split('?')[0];
}

export { isVideoFile };
