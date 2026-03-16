import endpoints from "@/modules/lib/utility/endpoints";
import { buildEndpoint } from "@/modules/lib/utility/utility";
import { ICollection } from "@/modules/lib/utility/types/collection.interface";

export async function getCollections(
  storeId: string,
  apiBase: string
): Promise<ICollection[]> {
  try {
    const url =
      apiBase +
      "/" +
      buildEndpoint(endpoints.COLLECTIONS_BY_STORE, { storeId }) +
      "?pagination[limit]=100&pagination[page]=1&includeProducts=false";

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const text = await res.text();
    if (!text) {
      return [];
    }

    const json = JSON.parse(text);
    return json?.data ?? [];
  } catch (e) {
    console.error("Error fetching collections:", e);
    return [];
  }
}
