import { productService } from "@/modules/lib/utility/services/product.service";
import ProductDetails from "@/modules/views/product-details/Product-details";
import React from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const product = await productService.fetchProductBySlug(params.slug, {});
    console.log(product);

    return {
      title: `${product?.name} - Asoebi Africa`,
      description: `${product?.longDescription}`,
      openGraph: {
        title: `${product?.name} - Asoebi Africa`,
        description: `${product?.longDescription}`,
        url: `https://staging.asoebi.africa/products/${params.slug}`,
        siteName: "Asoebi Africa",
        images: [
          {
            url:
              product?.variants?.[0]?.media?.[0]?.url || "new-asoebi-logo.svg",
            alt: product?.name,
            height: 630,
            width: 1200,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product?.name} - Asoebi Africa`,
        description: `${product?.longDescription}`,
        images: [
          product?.variants?.[0]?.media?.[0]?.url || "new-asoebi-logo.svg",
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Not Found - Asoebi Africa",
      description: "This product could not be found",
    };
  }
}

export default async function product_details({
  params,
}: {
  params: { slug: string };
}) {
  try {
    console.log(params.slug, "paramssss");
    const product = await productService.fetchProductBySlug(params.slug, {});
    console.log({ product });

    return (
      <div>
        <ProductDetails product={product} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    return <div>Error fetching product details</div>;
  }
}
/*description:
          `${product?.longDescription}` ||
          `${product?.name} - Check out this piece on Asoebi Africa`,
          
          
          */