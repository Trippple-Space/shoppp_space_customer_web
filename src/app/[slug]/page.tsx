export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { storeService } from "@/modules/lib/utility/services/store.service";
import StorefrontAbout from "@/modules/views/storefront/StorefrontAbout";
import StorefrontLayout from "@/modules/views/storefront/StorefrontLayout";
import React from "react";
import type { Metadata } from 'next'
import { redirect } from "next/navigation";
import config from "env";
import UnknownVendor from "@/modules/views/unknown-routes/unknown-vendor";
import endpoints from "@/modules/lib/utility/endpoints";
import { buildEndpoint } from "@/modules/lib/utility/utility";

async function getStore(slug: string) {
  try {
    const res = await  fetch(config.API_HOST + "/" + buildEndpoint(endpoints.STORE, { slug }), {
        cache: "no-store", // Next.js-specific way to prevent caching
      })

    if (!res.ok) {
      return null;
    }

    const text = await res.text(); // <-- read as text first
    if (!text) {
      return null; // empty response
    }

    return JSON.parse(text); // parse safely
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
        store?.description ||
        store?.heading ||
        `${store?.name} - Check out my store`,
      // …your OG + Twitter config here
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

  return (
    <StorefrontLayout store={store}>
      <StorefrontAbout store={store} />
    </StorefrontLayout>
  );
}