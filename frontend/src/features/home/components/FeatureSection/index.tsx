import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import {
  FiTag,
  FiTruck,
  FiClock,
  FiGrid,
  FiRotateCcw,
} from "react-icons/fi";

import "swiper/css";
import "./styles.css";

const features = [
  {
    id: 1,
    title: "Best prices & offers",
    subtitle: "Orders $50 or more",
    icon: <FiTag style={{ color: "#22c55e" }} />,
  },
  {
    id: 2,
    title: "Free delivery",
    subtitle: "Orders $50 or more",
    icon: <FiTruck style={{ color: "#facc15" }} />,
  },
  {
    id: 3,
    title: "Great daily deal",
    subtitle: "Orders $50 or more",
    icon: <FiClock style={{ color: "#f97316" }} />,
  },
  {
    id: 4,
    title: "Wide assortment",
    subtitle: "Orders $50 or more",
    icon: <FiGrid style={{ color: "#10b981" }} />,
  },
  {
    id: 5,
    title: "Easy returns",
    subtitle: "Orders $50 or more",
    icon: <FiRotateCcw style={{ color: "#22c55e" }} />,
  },
];

const FeatureSection = () => {
  return (
    <section className="feature-section">
      <div className="container">

        <Swiper
          modules={[Autoplay]}
          spaceBetween={15}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          className="featureSwiper"
        >
          {features.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="feature-card">

                <div className="icon-wrapper">
                  {item.icon}
                </div>

                <div className="content">
                  <h6>{item.title}</h6>
                  <p>{item.subtitle}</p>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default FeatureSection;