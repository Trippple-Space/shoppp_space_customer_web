import { useEffect, useMemo } from "react";
import { useFilterStore } from "../store/filter.store";
import { productService } from "../services/product.service";

export const useFilter = () => {
  const { allFilters } = useFilterStore();

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      const { min, max } = allFilters.price || {};
      const { sortBy } = allFilters.sort || {};
      const { rateBy } = allFilters.rating || {};
      const { selectedState } = allFilters.location || {};
      const { showOffers } = allFilters;

      let filters: any = {};

      if (min || max) {
        filters.price = { min, max };
      }
      if (sortBy) filters.sort = sortBy;
      if (rateBy) filters.rating = rateBy;
      if (showOffers) filters.showOffers = showOffers;
      if (selectedState) filters.location = selectedState
      // productService.fetchProducts({}, filters);
    };

    fetchFilteredProducts();
  }, [allFilters]);

  return { allFilters };
};
