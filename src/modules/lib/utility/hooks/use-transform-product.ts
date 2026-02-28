import { Product, ProductVariant } from "../types/product.interface";

const useTransformProduct = (product: Product) => {
  const groupedData: { [color: string]: ProductVariant[] } = {};
  const productImages: string[] = [];
  const allProperties: { [key: string]: string[] } = {};

  product?.variants?.forEach((variant) => {
    const rawColor = variant?.properties?.color || "";
    const color = rawColor.trim()?.toLowerCase();

    if (!groupedData[color]) {
      groupedData[color] = [variant];
      productImages.push(variant?.media?.[0]?.url || "");
    } else {
      groupedData[color].push(variant);
    }

    Object.entries(variant?.properties || {}).forEach(([key, value]) => {
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
  return variant?.properties?.[key];
};

export const normalizeVariant = (variant: ProductVariant): ProductVariant => {
  if (!variant?.properties) return variant;

  const { size, ...rest } = variant?.properties;
  return {
    ...variant,
    size: variant.size ?? size,
    properties: rest,
  };
};

const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const requiredKeysForVariant = (variant: ProductVariant): string[] => {
  const { size, properties } = normalizeVariant(variant);

  const keys: string[] = [];
  Object.entries(properties || {}).forEach(([key, value]) => {
    if (hasValue(value)) {
      keys.push(key);
    }
  });

  if (hasValue(size)) {
    keys.push('size');
  }

  return keys;
};

export const buildFiltersFromVariant = (variant: ProductVariant) => {
  const { size, properties } = normalizeVariant(variant);

  const filters: Record<string, string> = {};
  Object.entries(properties || {}).forEach(([key, value]) => {
    if (value) {
      filters[key] = String(value);
    }
  });

  if (size) {
    filters.size = String(size);
  }

  return filters;
};
