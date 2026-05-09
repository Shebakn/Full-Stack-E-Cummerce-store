import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";

// ================= SKELETON =================
const ProductBannerSkeleton = () => {
  return (
    <div className="productBannerItem skeleton-banner">
      <div className="skeleton-img shimmer" />
    </div>
  );
};

// ================= ITEM =================
const BannerItem = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="productBannerItem">
      {/* Skeleton */}
      {!loaded && <div className="skeleton-img shimmer" />}

      {/* Image */}
      <img
        src={src}
        alt="banner"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          position: loaded ? "relative" : "absolute",
        }}
      />
    </div>
  );
};

// ================= MAIN =================
const ProductBanner: React.FC = () => {
  const images = [
    "https://cdn.dribbble.com/userupload/45294190/file/93492a2e0da2c0218d7072a4c6207a49.jpg?resize=752x353&vertical=center",
    "https://cdn.dribbble.com/userupload/45294193/file/90a018d94b7e302a07e3c9c4e217acc3.jpg?resize=752x&vertical=center",
    "https://cdn.dribbble.com/userupload/45294195/file/e3e7a3813eb749d037a0732746013bc4.jpg?resize=752x&vertical=center",
    "https://cdn.dribbble.com/userupload/45294186/file/30fe094f051f6eccaf6ae82ee4fdaa69.jpg?resize=752x353&vertical=center",
  ];

  const loading = false; // اربطها مع API لاحقًا

  return (
    <div className="productBannerSection">
      <div className="container">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={15}
          autoplay={{ delay: 4000 }}
          loop={false}
          slidesPerView={"auto"}
          className="productBannerSwiper"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <ProductBannerSkeleton />
                </SwiperSlide>
              ))
            : images.map((img, i) => (
                <SwiperSlide key={i}>
                  <BannerItem src={img} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductBanner;