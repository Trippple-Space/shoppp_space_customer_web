import { Product, ProductVariant } from "../types/product.interface";

const useTransformProduct = (product: Product) => {
  const groupedData: { [color: string]: ProductVariant[] } = {};
  const productImages: string[] = [];
  const allProperties: { [key: string]: string[] } = {};

  product?.variants?.forEach((variant) => {
    const rawColor = variant.properties?.color || "";
    const color = rawColor.trim()?.toLowerCase();

    if (!groupedData[color]) {
      groupedData[color] = [variant];
      productImages.push(variant?.media?.[0]?.url || "");
    } else {
      groupedData[color].push(variant);
    }

    Object.entries(variant.properties || {}).forEach(([key, value]) => {
      if (!allProperties[key]) allProperties[key] = [];
      const stringValue = String(value);
      if (!allProperties[key].includes(stringValue)) allProperties[key].push(stringValue);
    });
  });

  const availableColors = Object.keys(groupedData);

  return { groupedData, availableColors, productImages, allProperties };
};

export default useTransformProduct;

export const getVariantValue = (
  variant: ProductVariant,
  key: string
): string | undefined => {
  if (key === 'size') return variant.size ?? undefined;
  return variant.properties?.[key];
};
