import { storeService } from "@/modules/lib/utility/services/store.service";
import StorefrontAbout from "@/modules/views/storefront/StorefrontAbout";
import StorefrontLayout from "@/modules/views/storefront/StorefrontLayout";
import React from "react";
import type { Metadata } from 'next'
import TrendFashion from "@/modules/templates/trendFashion/TrendFashion";
import Furniture from "@/modules/templates/furniture/Furniture";

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const store = await storeService.fetchStoreBySlug(params.slug, {});

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
    }
  } catch (error) {
    //console.error('Error generating metadata:', error)
    return {
      title: 'Store Not Found - Asoebi Africa',
      description: 'This store could not be found'
    }
  }
}


export default async function storeFront({
  params,
}: {
  params: { slug: string };
}) {
  const templateList = ['default', 'trend-fashion', 'furniture'];
  let template: string = "default";

  const store = await storeService.fetchStoreBySlug(params.slug, {});
  return (
    <>
      {
        template && templateList.includes(template) ? (
          template === 'trend-fashion' ? (
            <TrendFashion store={store} />
          ) : template === 'furniture' ? (
            <Furniture store={store} />
          ) : (
            <StorefrontLayout store={store}>
              <StorefrontAbout store={store} />
            </StorefrontLayout>
          )
        ) : (
          <StorefrontLayout store={store}>
            <StorefrontAbout store={store} />
          </StorefrontLayout>
        )
      }
      {/* <StorefrontLayout store={store}>
        <StorefrontAbout store={store} />
      </StorefrontLayout> */}
    </>
  );
}
