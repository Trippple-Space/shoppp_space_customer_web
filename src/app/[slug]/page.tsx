export const dynamic = "force-dynamic";
export const dynamicParams = true;

import React from "react";
import type { Metadata } from 'next'
import { StorefrontParent } from "@/modules/views/storefront/StorefrontParent";
import config from "env";
import UnknownVendor from "@/modules/views/unknown-routes/unknown-vendor";
import endpoints from "@/modules/lib/utility/endpoints";
import { buildEndpoint } from "@/modules/lib/utility/utility";
import { getCollections } from "@/modules/lib/utility/server/collections.server";
import { getCategories } from "@/modules/lib/utility/server/categories.server";

async function getStore(slug: string) {
  try {
    const res = await fetch(config.API_HOST + "/" + buildEndpoint(endpoints.STORE, { slug }), {
      cache: "no-store",
    })

    if (!res.ok) {
      return null;
    }

    const text = await res.text();
    if (!text) {
      return null;
    }

    return JSON.parse(text);
  } catch (e) {
    console.error("Error fetching store:", e);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const store = await getStore(params.slug);

    if (!store?.id) {
      return {
        title: `Unknown Vendor - Asoebi Africa`,
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
        url: `https://${params.slug}.asoebi.africa`,
        siteName: store.name || 'Asoebi Africa',
        images: [
          {
            url:
              store?.thumbnail || store?.meta?.heroImage1 || 'new-asoebi-logo.svg',
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
          store?.thumbnail || store?.meta?.heroImage1 || 'new-asoebi-logo.svg'
        ]
      }
    };
  } catch (error) {
    return {
      title: `Unknown Vendor - Asoebi Africa`,
      description: `This store could not be found`
    };
  }
}


export default async function storeFront({
  params,
}: {
  params: { slug: string };
}) {
  const store = await getStore(params.slug);


  if (!store) {
  return <UnknownVendor /> 
  }

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