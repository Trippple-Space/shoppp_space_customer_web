export const dynamic = "force-dynamic";
export const dynamicParams = true;

import React from "react";
import type { Metadata } from 'next'
import { StorefrontParent } from "@/modules/views/storefront/StorefrontParent";
import config from "env";
import UnknownVendor from "@/modules/views/unknown-routes/unknown-vendor";
import StorefrontFetchError from "@/modules/views/storefront/StorefrontFetchError";
import endpoints from "@/modules/lib/utility/endpoints";
import { buildEndpoint } from "@/modules/lib/utility/utility";
import { getCollections } from "@/modules/lib/utility/server/collections.server";
import { getCategories } from "@/modules/lib/utility/server/categories.server";
import type { Store } from "@/modules/lib/utility/types/store.interface";
import { resolvePublishedPage } from "@/modules/website/api";
import { SaneeSite, siteMetadata } from "@/modules/website/SaneeSite";

type GetStoreResult =
  | { status: "ok"; store: Store }
  | { status: "not_found" }
  | { status: "fetch_failed" };

async function getStore(slug: string): Promise<GetStoreResult> {
  try {
    const res = await fetch(config.API_HOST + "/" + buildEndpoint(endpoints.STORE, { slug }), {
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "not_found" };
    }

    const text = await res.text();
    if (!text) {
      return { status: "not_found" };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { status: "fetch_failed" };
    }

    if (!parsed || typeof parsed !== "object" || !("id" in parsed) || !(parsed as { id?: unknown }).id) {
      return { status: "not_found" };
    }

    return { status: "ok", store: parsed as Store };
  } catch (e) {
    console.error("Error fetching store:", e);
    return { status: "fetch_failed" };
  }
}

type StorefrontPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ collection?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: StorefrontPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { collection } = await searchParams;
  try {
    // A published Sanee home page wins over the legacy storefront for this store.
    const published = await resolvePublishedPage({
      slug,
      path: "/",
      collection,
    });
    if (published.status === "ok") return siteMetadata(published.site);

    const result = await getStore(slug);
    const store = result.status === "ok" ? result.store : null;

    if (!store?.id) {
      return {
        title: `Unknown Vendor - Shoppp Space`,
        description: `This store could not be found`
      };
    }

    return {
      title: `${store?.name} ${store?.heading ? `- ${store?.heading}` : ''}`,
      description:
        `${store?.description}` ||
        `${store.heading}` ||
        `${store?.name} - Check out my store`,
      openGraph: {
        title: `${store?.name} ${store?.heading ? `- ${store?.heading}` : ''}`,
        description:
          `${store?.description}` ||
          `${store.heading}` ||
          `${store?.name} - Check out my store`,
        url: `https://${slug}.shoppp.space`,
        siteName: store.name || 'Shoppp Space',
        images: [
          {
            url:
              store?.thumbnail || store?.meta?.heroImage1 || 'new-shoppp-logo.svg',
            alt: store?.name,
            height: 630,
            width: 1200
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${store?.name} ${store?.heading ? `- ${store?.heading}` : ''}`,
        description:
          `${store?.description}` ||
          `${store.heading}` ||
          `${store?.name} - Check out my store`,
        images: [
          store?.thumbnail || store?.meta?.heroImage1 || 'new-shoppp-logo.svg'
        ]
      }
    };
  } catch (error) {
    return {
      title: `Unknown Vendor - Shoppp Space`,
      description: `This store could not be found`
    };
  }
}


export default async function storeFront({
  params,
  searchParams,
}: StorefrontPageProps) {
  const { slug } = await params;
  const { collection } = await searchParams;
  // Published Sanee site (Tranche 3). Falls back to the legacy storefront when the store has none.
  const published = await resolvePublishedPage({
    slug,
    path: "/",
    collection,
  });
  if (published.status === "ok") {
    return <SaneeSite resolved={published.site} />;
  }

  const result = await getStore(slug);

  if (result.status === "fetch_failed") {
    return <StorefrontFetchError reason="network" />;
  }

  if (result.status === "not_found") {
    return <UnknownVendor />;
  }

  const store = result.store;

  const initialCollections = await getCollections(store.id, config.API_HOST);
  const initialCategories = await getCategories(config.API_HOST, {
    type: "both",
    label: "STORE",
    storeId: store.id,
  });

  return (
    <>
      <StorefrontParent
        store={store}
        initialCollections={initialCollections}
        initialCategories={initialCategories}
      />
    </>
  );
}