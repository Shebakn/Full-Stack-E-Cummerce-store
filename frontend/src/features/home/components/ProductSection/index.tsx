import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Rating from "@mui/material/Rating";

import type { Product } from "@/common/interfaces/product.interface";
import type { Category } from "@/common/interfaces/category.interface";

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";

/* ================= Skeleton ================= */
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

/* ================= Props ================= */
type Props = {
  title: string;
  description?: string;

  products: Product[];
  loading: boolean;

  categories?: Category[];

  activeCategory?: string | null;

  /**
   * Unified filter handler
   */
  onFilterChange?: (filters: {
    categoryId?: string;
  }) => void;
};

/* ================= Component ================= */
const ProductSection: React.FC<Props> = ({
  title,
  description,
  products,
  loading,
  categories,
  activeCategory,
  onFilterChange,
}) => {
  console.log(products)
  return (
    <div className="homeProducts py-5">
      <div className="container">

        {/* ================= HEADER ================= */}
        <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
          <div className="info">
            <h3 className="mb-0">{title}</h3>

            {description && (
              <p className="text-muted">{description}</p>
            )}
          </div>

          {/* ================= CATEGORY FILTER ================= */}
          {categories && onFilterChange && (
            <div style={{ maxWidth: "100%" }}>
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={10}
                freeMode
                className="navSlider"
              >
                {categories.map((cat) => (
                  <SwiperSlide
                    key={cat.id}
                    style={{ width: "auto" }}
                  >
                    <button
                      className={`navBtn ${
                        activeCategory === cat.id ? "active" : ""
                      }`}
                      onClick={() =>
                        onFilterChange({
                          categoryId: cat.id,
                        })
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

        {/* ================= PRODUCTS ================= */}
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
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <ProductCardSkeleton />
                </SwiperSlide>
              ))
            : products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="productItem">

                    {/* IMAGE */}
                    <div className="imgWrapper">
                      <img
                        loading="lazy"
                        src={product.imageCover?.small}
                        alt={product.title}
                      />
                    </div>

                    {/* CATEGORY */}
                    <span className="productCategory">
                      {product.category?.name ?? "General"}
                    </span>

                    {/* TITLE */}
                    <h6 className="productTitle">
                      {product.title.length > 60
                        ? product.title.slice(0, 60) + "..."
                        : product.title}
                    </h6>

                    {/* RATING */}
                    <div className="reviewSection">
                      <Rating
                        value={product.ratingsAverage}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <span className="reviewCount">
                        {product.ratingsQuantity} (Reviews)
                      </span>
                    </div>

                    {/* PRICE */}
                    <div className="price-section">
                      <span className="price">
                        ${product.price}
                      </span>
                    </div>

                    {/* BUTTON */}
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