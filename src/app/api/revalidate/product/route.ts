import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const PRODUCT_CACHE_TAG_PREFIX = 'product-details';

type Body = {
  slug?: string;
};

export async function POST(req: NextRequest) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  const providedSecret = req.headers.get('x-revalidate-secret');

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    body = {};
  }

  const slug = body.slug?.trim();
  if (!slug) {
    return NextResponse.json(
      { message: 'Missing required "slug" in body' },
      { status: 400 }
    );
  }

  revalidateTag(PRODUCT_CACHE_TAG_PREFIX);
  revalidateTag(`${PRODUCT_CACHE_TAG_PREFIX}:${slug}`);
  revalidatePath(`/products/${slug}`);

  return NextResponse.json({
    revalidated: true,
    tags: [PRODUCT_CACHE_TAG_PREFIX, `${PRODUCT_CACHE_TAG_PREFIX}:${slug}`],
    path: `/products/${slug}`,
  });
}
