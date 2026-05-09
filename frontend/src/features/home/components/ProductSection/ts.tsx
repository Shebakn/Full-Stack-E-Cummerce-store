import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Rating from "@mui/material/Rating";

import type { Product } from "@/common/interfaces/product.interface"; 
import type { Category } from "@/common/interfaces/category.interface"; 

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";

/**
 * Skeleton loader for product card
 * Used while API data is loading
 */
const ProductCardSkeleton = () => {
  return (
    <div className="productItem skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-category" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-title short" />
      <div className="skeleton skeleton-btn" />
    </div>
  );
};

/**
 * Component Props
 */
type Props = {
  title: string;
  description?: string;

  /**
   * Products to render in slider
   */
  products: Product[];

  /**
   * Global loading state
   */
  loading: boolean;

  /**
   * Optional external fetch function (not used internally here)
   */
  fetchData: (params?: any) => void;

  /**
   * Categories for horizontal navigation
   */
  categories?: Category[];

  /**
   * Currently active categoryId
   */
  activeCategory?: string | null;

  /**
   * Callback when user clicks a category
   */
  onCategoryClick?: (id: string, index: number) => void;
};

/**
 * ProductSection Component
 * Displays:
 * - Title & description
 * - Category slider (optional)
 * - Product swiper grid
 */
const ProductSection: React.FC<Props> = ({
  title,
  description,
  products,
  loading,
  fetchData,

  categories,
  activeCategory,
  onCategoryClick,
}) => {
  console.log(products);
  return (
    <div className="homeProducts py-5">
      <div className="container">

        {/* ================= HEADER ================= */}
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
          <div className="info">
            {/* Section title */}
            <h3 className="mb-0">{title}</h3>

            {/* Optional description */}
            {description && (
              <p className="text-muted">{description}</p>
            )}
          </div>

          {/* ================= CATEGORY NAVIGATION ================= */}
          {categories && onCategoryClick && (
            <div style={{ maxWidth: "100%" }}>
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={10}
                freeMode
                className="navSlider"
              >
                {categories.map((cat, index) => (
                  <SwiperSlide
                    key={cat.id}
                    style={{ width: "auto" }}
                  >
                    <button
                      className={`navBtn ${
                        activeCategory === cat.id ? "active" : ""
                      }`}
                      onClick={() =>
                        onCategoryClick(cat.id, index)
                      }
                    >
                      {cat.name}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* ================= PRODUCTS SLIDER ================= */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          breakpoints={{
            0: { slidesPerView: 2.2, spaceBetween: 10 },
            576: { slidesPerView: 2.5 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          className="productSlider"
        >

          {/* ================= LOADING STATE ================= */}
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SwiperSlide
                  key={i}
                  style={{
                    display: "flex",
                    height: "auto",
                  }}
                >
                  <ProductCardSkeleton />
                </SwiperSlide>
              ))

            : products.map((product) => (
                <SwiperSlide
                  key={product.id}
                  style={{
                    display: "flex",
                    height: "auto",
                    minWidth: 0,
                  }}
                >
                  <div className="productItem">

                    {/* ================= PRODUCT IMAGE ================= */}
                    <div className="imgWrapper">
                      <img
                        loading="lazy"

                        /**
                         * Safe fallback for image field
                         */
                        src={
                          (product as any).imageCover.small ||
                          product.image
                        }

                        /**
                         * Safe fallback for title
                         */
                        alt={
                          (product as any).title ||
                          product.name
                        }
                      />
                    </div>

                    {/* ================= CATEGORY ================= */}
                    <span className="productCategory">
                      {(product as any).category?.name ??
                        "General"}
                    </span>

                    {/* ================= TITLE ================= */}
                    <h6 className="productTitle">
                      {(
                        (product as any).title ||
                        product.name ||
                        ""
                      ).length > 60
                        ? (
                            (product as any).title ||
                            product.name
                          ).slice(0, 60) + "..."
                        : (product as any).title ||
                          product.name}
                    </h6>

                    {/* ================= RATING ================= */}
                    <div className="reviewSection">
                      <Rating
                        value={
                          (product as any).ratingsAverage || 0
                        }
                        precision={0.5}
                        readOnly
                        size="small"
                      />

                      <span className="reviewCount">
                        {(product as any).ratingsQuantity || 0}{" "}
                        (Reviews)
                      </span>
                    </div>

                    {/* ================= PRICE ================= */}
                    <div className="price-section">
                      <span className="price">
                        ${Number(product.price)}
                      </span>
                    </div>

                    {/* ================= ADD TO CART ================= */}
                    <button className="btn-add">
                      Add to Cart
                    </button>

                  </div>
                </SwiperSlide>
              ))}
        </Swiper>

      </div>
    </div>
  );
};

export default ProductSection;