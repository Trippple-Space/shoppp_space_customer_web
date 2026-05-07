import envConfig from 'env';

export async function uploadPublicConfigurationImage(
  file: File,
  folder = 'customer-configuration'
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_PUBLIC_UPLOAD_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Image upload is not configured. Set NEXT_PUBLIC_PUBLIC_UPLOAD_API_KEY.'
    );
  }
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(
    `${envConfig.API_HOST}/file-upload?folder=${encodeURIComponent(folder)}`,
    {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
      body: formData,
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Upload failed (${res.status})`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}
