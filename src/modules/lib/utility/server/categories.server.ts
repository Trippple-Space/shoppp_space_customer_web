import endpoints from "@/modules/lib/utility/endpoints";
import { ProductCategory } from "@/modules/lib/utility/types/product.interface";

type CategoryType = "fabrics" | "wears";

function buildCategoriesUrl(
  apiBase: string,
  type: CategoryType,
  label: "GLOBAL" | "STORE",
  storeId = ""
) {
  const params = new URLSearchParams();
  params.set("filters[type]", type);
  params.set("filters[label]", label);
  if (storeId) params.set("filters[storeId]", storeId);

  return `${apiBase}/${endpoints.PRODUCT_CATEGORIES}?${params.toString()}`;
}

async function fetchSingleCategoryType(
  apiBase: string,
  type: CategoryType,
  label: "GLOBAL" | "STORE",
  storeId = ""
): Promise<ProductCategory | null> {
  try {
    const res = await fetch(buildCategoriesUrl(apiBase, type, label, storeId), {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const text = await res.text();
    if (!text) return null;

    const json = JSON.parse(text);
    return json?.data?.[0] ?? null;
  } catch (e) {
    console.error(`Error fetching ${type} categories:`, e);
    return null;
  }
}

export async function getCategories(
  apiBase: string,
  {
    type,
    label = "GLOBAL",
    storeId = "",
  }: {
    type?: CategoryType | "both";
    label?: "GLOBAL" | "STORE";
    storeId?: string;
  } = {}
): Promise<ProductCategory["categories"]> {
  try {
    if (type === "both" || storeId) {
      const [fabricsData, wearsData] = await Promise.all([
        fetchSingleCategoryType(apiBase, "fabrics", label, storeId),
        fetchSingleCategoryType(apiBase, "wears", label, storeId),
      ]);

      return [
        ...(fabricsData?.categories ?? []),
        ...(wearsData?.categories ?? []),
      ].filter(
        (category, index, arr) =>
          index ===
          arr.findIndex(
            (item) =>
              item?.name?.toLowerCase?.().trim() ===
              category?.name?.toLowerCase?.().trim()
          )
      );
    }

    const targetType: CategoryType = type === "wears" ? "wears" : "fabrics";
    const data = await fetchSingleCategoryType(apiBase, targetType, label, storeId);
    return data?.categories ?? [];
  } catch (e) {
    console.error("Error fetching categories:", e);
    return [];
  }
}
