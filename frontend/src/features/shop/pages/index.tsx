import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import CategoryTree from "../components/CategoryTree"; 
import PriceFilter from "../components/PriceFilter"; 
import RatingFilter from "../components/RatingFilter"; 
import OrderByDropdown from "../components/OrderByDropdown"; 
import ProductGrid from "../components/ProductGrid";
import ProductSearchBar from "../components/ProductSearchBar";
import { useProductStore } from "@/features/shop/stores/products.store"; 
import { useProducts } from "@/features/shop/hooks/products.hook"; 
import "./styles.css";
import { useCategories } from "@/common/hooks/category.hook";

/* ================= PAGINATION ================= */
const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="paginationWrapper">
      <button className="pageBtn navBtn" disabled={page === 1} onClick={() => onChange(1)}>«</button>
      <button className="pageBtn navBtn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {pages.map((p) => (
        <button key={p} className={`pageBtn numBtn ${p === page ? "active" : ""}`} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button className="pageBtn navBtn" disabled={page === totalPages} onClick={() => onChange(page + 1)}>›</button>
      <button className="pageBtn navBtn" disabled={page === totalPages} onClick={() => onChange(totalPages)}>»</button>
    </div>
  );
};

/* ================= FILTERS SIDEBAR ================= */
const FiltersSidebar = ({
  categories,
  categoriesLoading,
  selectedCategoryIds,
  onCategoryChange,
  priceMin,
  priceMax,
  onPriceChange,
  selectedRatings,
  onRatingChange,
  isMobile,
  isOpen,
  onClose,
}: any) => {
  const sidebarContent = (
    <>
      <div className="sidebarContent">
        <h6>Categories</h6>
        <CategoryTree
          categories={categories}
          loading={categoriesLoading}
          selectedIds={selectedCategoryIds}
          onChange={onCategoryChange}
        />
        <hr />
        <PriceFilter
          min={priceMin}
          max={priceMax}
          onChange={onPriceChange}
        />
        <hr />
        <RatingFilter
          selected={selectedRatings}
          onChange={onRatingChange}
        />
        {!isMobile && (
          <div className="filterApplySection">
            <button className="btn-apply-filters" onClick={onClose}>
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="mobileFiltersOverlay" onClick={onClose}>
            <div className="mobileFiltersDrawer" onClick={(e) => e.stopPropagation()}>
              <div className="mobileFiltersHeader">
                <h5>Filters</h5>
                <button className="closeFiltersBtn" onClick={onClose}>×</button>
              </div>
              <div className="mobileFiltersBody">
                {sidebarContent}
              </div>
              <div className="mobileFiltersFooter">
                <button className="applyFiltersBtn" onClick={onClose}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <div className="desktop">{sidebarContent}</div>;
};

/* ================= SHOP ================= */
const Shop = () => {
  const [searchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { query, setQuery } = useProductStore();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, meta, loading } = useProducts();

  /* CHECK IF MOBILE */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* URL CATEGORY */
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoryId");
    if (categoryFromUrl) setQuery({ categoryIds: [categoryFromUrl] });
  }, [searchParams]);

  /* SEARCH */
  const handleSearch = (value: string) => {
    setQuery({
      search: value,
      categoryIds: [],
      minPrice: undefined,
      maxPrice: undefined,
      ratings: [],
      orderBy: "createdAt",
      orderDirection: "desc",
    });
  };

  /* COUNT ACTIVE FILTERS */
  const getActiveFiltersCount = () => {
    let count = 0;
    if (query.categoryIds && query.categoryIds.length > 0) count++;
    if (query.minPrice && query.minPrice > 0) count++;
    if (query.maxPrice && query.maxPrice < 5000) count++;
    if (query.ratings && query.ratings.length > 0) count++;
    return count;
  };
  
  return (
    <div className="shopPage mt-4 mb-5">
      <Container>
        <Row className="align-items-start">
          {/* FILTERS TOGGLE BUTTON - MOBILE ONLY */}
          {isMobile && (
            <div className="mobileFiltersToggleWrapper">
              <button className="mobileFiltersToggleBtn" onClick={() => setMobileFiltersOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="activeFiltersBadge">{getActiveFiltersCount()}</span>
                )}
              </button>
            </div>
          )}

          {/* SIDEBAR - DESKTOP */}
          <Col md={4} lg={3} className="shopSidebar pe-lg-4">
            <FiltersSidebar
              categories={categories}
              categoriesLoading={categoriesLoading}
              selectedCategoryIds={query.categoryIds ?? []}
              onCategoryChange={(ids: string[]) => setQuery({ categoryIds: ids })}
              priceMin={query.minPrice ?? 0}
              priceMax={query.maxPrice ?? 5000}
              onPriceChange={({ minPrice, maxPrice }: any) => setQuery({ minPrice, maxPrice })}
              selectedRatings={query.ratings ?? []}
              onRatingChange={(ratings: number[]) => setQuery({ ratings })}
              isMobile={false}
              isOpen={false}
              onClose={() => {}}
            />
          </Col>

          {/* MAIN CONTENT */}
          <Col md={8} lg={9} className="shopMain ps-lg-4">
            <div className="mb-4 d-flex gap-3 flex-wrap">
              <OrderByDropdown
                value={`${query.orderBy}_${query.orderDirection}`}
                onChange={(val) => {
                  const [orderBy, orderDirection] = val.split("_");
                  setQuery({ orderBy: orderBy as any, orderDirection: orderDirection as any });
                }}
              />
              <ProductSearchBar value={query.search ?? ""} onSearch={handleSearch} />
            </div>

            <ProductGrid products={products} loading={loading} />
            
            <Pagination page={meta?.page || 1} totalPages={meta?.totalPages || 1} onChange={(page) => setQuery({ page })} />
          </Col>
        </Row>
      </Container>

      {/* MOBILE FILTERS DRAWER */}
      <FiltersSidebar
        categories={categories}
        categoriesLoading={categoriesLoading}
        selectedCategoryIds={query.categoryIds ?? []}
        onCategoryChange={(ids: string[]) => setQuery({ categoryIds: ids })}
        priceMin={query.minPrice ?? 0}
        priceMax={query.maxPrice ?? 5000}
        onPriceChange={({ minPrice, maxPrice }: any) => setQuery({ minPrice, maxPrice })}
        selectedRatings={query.ratings ?? []}
        onRatingChange={(ratings: number[]) => setQuery({ ratings })}
        isMobile={true}
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      />
    </div>
  );
};

export default Shop;