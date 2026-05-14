import { useEffect, useState } from "react";

import FeatureSection from "../components/FeatureSection";
import HomeBanner from "../components/HomeBanner";
import Newsletter from "../components/NewsLetter";
import ProductBanner from "../components/ProductBanner";

import { useBestSellersStore } from "../stores/best-sellers.store";
import { useBestSellers } from "../hooks/best-sellers.hook";
import ProductSection from "../components/ProductSection";

import { useNewArrivals } from "../hooks/new-arrivals.hook";
import TopCategories from "../components/TopCategories";
import { useCategories } from "../../../common/hooks/category.hook";
const HomePage = () => {

  const { filters, setFilters } = useBestSellersStore();

  const {
    data: bestSellers,
    isLoading: isBestSellersLoading,
  } = useBestSellers(filters);

  const {
    data: newArrivals,
    isLoading: isNewArrivalsLoading,
  } = useNewArrivals();

  const { categories } = useCategories();

  return (
    <>

      {/* Home banner */}
      <HomeBanner />

      <TopCategories />

      <ProductSection
        title="Best Sellers"
        description="Check out our best selling products!"
        products={bestSellers?.data ?? []}
        loading={isBestSellersLoading}
        categories={categories}
        activeCategory={filters.categoryId}
        onFilterChange={(f) =>
          setFilters({
            categoryId: f.categoryId,
            page: 1,
          })
        }
      />

      {/* Products Banner */}
      <ProductBanner />

      {/* ================= NEW ARRIVALS ================= */}
      <ProductSection
        title="New Arrivals"
        description="Latest products added"
        products={newArrivals?.data ?? []}
        loading={isNewArrivalsLoading}
      />

      {/* ================= NEW ARRIVALS ================= */}
      <ProductSection
        title="New Arrivals"
        description="Latest products added"
        products={newArrivals?.data ?? []}
        loading={isNewArrivalsLoading}
      />
      {/* News Letter */}
      <Newsletter />

      {/* Features Section */}
      <FeatureSection />
    </>
  );
};

export default HomePage;