
const sanitizeBaseName = (raw: string) =>
  raw.replaceAll(/[^a-zA-Z0-9._-]+/g, '_').toLowerCase() || 'file';

export async function uploadPublicConfigurationImage(
  file: File,
  folder = 'customer-configuration'
): Promise<string> {
  const parts = file.name.split('.');
  const extension = parts.length > 1 ? parts.pop() : '';
  const base = sanitizeBaseName(parts.join('.') || file.name);
  const safeFolder = folder.replace(/^\/+|\/+$/g, '');
  const fileName = `${safeFolder ? `${safeFolder}/` : ''}${base}_${Date.now()}${
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
    throw new Error(presignData.error || 'Could not start image upload.');
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
    throw new Error(`Image upload failed (${putRes.status}).`);
  }

  return presignData.uploadURL.split('?')[0];
}
