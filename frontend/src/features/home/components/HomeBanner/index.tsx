import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import homeSlider1 from "@/assets/imgs/HomeSlider1.png";
import homeSlider2 from "@/assets/imgs/HomeSlider2.png";
import homeSlider3 from "@/assets/imgs/HomeSlider3.png";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles.css";

// ================= SKELETON =================
const BannerSkeleton = () => {
  return (
    <div className="bannerImgWrapper">
      <div className="bannerSkeleton shimmer" />
    </div>
  );
};

// ================= ITEM =================
const BannerItem = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bannerImgWrapper">
      {/* Skeleton */}
      {!loaded && <div className="bannerSkeleton shimmer" />}

      {/* Image */}
      <img
        src={src}
        alt="banner"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
          position: loaded ? "relative" : "absolute",
        }}
      />
    </div>
  );
};

// ================= MAIN =================
const HomeBanner: React.FC = () => {
  const images = [homeSlider1, homeSlider2, homeSlider3];

  return (
    <div className="homeBannerSection">
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 5000 }}
          className=""
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="custom-slide">
              <BannerItem src={img} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeBanner;