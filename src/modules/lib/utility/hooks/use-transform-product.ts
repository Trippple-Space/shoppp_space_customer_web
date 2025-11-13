import { Product } from "../types/product.interface";

const useTransformProduct = (product: Product) => {
  const groupedData: { [key: string]: any } = {};
  const productImages: string[] = []

  product.variants.forEach((each) => {
    const rawColor = each.properties.color || "";
    const color = rawColor.trim().toLowerCase();

    const hashArray = groupedData[color];
    if (!hashArray) {
      groupedData[color] = [each];
      productImages.push(each?.media?.[0]?.url)
    } else {
      groupedData[color].push(each);
    }
  });

  const availableColors = Object.keys(groupedData);

  return { groupedData, availableColors, productImages };
};

export default useTransformProduct;
