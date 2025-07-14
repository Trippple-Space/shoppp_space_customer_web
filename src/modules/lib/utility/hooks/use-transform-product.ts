import { Product } from "../types/product.interface";

const useTransformProduct = (product: Product) => {
  const groupedData: { [key: string]: any } = {};
  const productImages: string[] = []

  product.variants.sort((a, b) => a.id - b.id).forEach((each) => {
    const color = each.properties.color;
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
