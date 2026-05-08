import AWS from 'aws-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { normalizeS3Metadata } from '@/modules/lib/utility/s3-metadata';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const POST = async (req: NextRequest) => {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const { fileName, fileType, metadata: rawMetadata } = body;
  const metadataInput =
    rawMetadata != null &&
    typeof rawMetadata === 'object' &&
    !Array.isArray(rawMetadata)
      ? (rawMetadata as Record<string, unknown>)
      : undefined;
  const { Metadata, metadataHeaders } = normalizeS3Metadata(metadataInput);

  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) {
    return NextResponse.json(
      { error: 'AWS_S3_BUCKET_NAME is not configured on the server' },
      { status: 500 }
    );
  }

  const params = {
    Bucket: bucket,
    Key: String(fileName ?? ''),
    ContentType: String(fileType ?? 'application/octet-stream'),
    ...(Object.keys(Metadata).length > 0 ? { Metadata } : {}),
    Expires: 60 * 5,
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return NextResponse.json(
      Object.keys(metadataHeaders).length > 0
        ? { uploadURL, metadataHeaders }
        : { uploadURL },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error generating presigned URL' },
      { status: 500 }
    );
  }
};
