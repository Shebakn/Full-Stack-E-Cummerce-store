import React, { useEffect } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './styles.css';

// 1. استيراد المكتبة
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import type { Category } from '@/common/interfaces/category.interface'; 
import { useCategories } from '@/shared/components/layout/Header/hooks/category.hook';
const TopCategories = () => {
  const { categories, isLoading } = useCategories();

  console.log("IN TOP CATEGORIES")
  return (
    <div className="topCategoriesSection homeProducts">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="info">
            <h3 className="mb-0 text-black">Top Categories</h3>
            <p className="mb-0">Check out our best selling products!</p>
          </div>
          <div className="viewAllBtn">View All <IoIosArrowForward /></div>
        </div>

        <Swiper
          slidesPerView={"auto"}
          spaceBetween={15}
          modules={[Navigation]}
        >
          {isLoading ? (
            // 2. عرض الـ Skeleton أثناء التحميل (مثلاً 6 عناصر)
            Array.from({ length: 6 }).map((_, index) => (
              <SwiperSlide key={index} style={{ width: 'auto' }}>
                <div className="categoryCard" style={{ justifyContent: 'center' }}>
                  <Skeleton circle width={50} height={50} className="mb-2" />
                  <Skeleton width={80} height={15} />
                </div>
              </SwiperSlide>
            ))
          ) : (
            // 3. عرض البيانات الحقيقية عند الانتهاء
            categories.map((cat: Category) => (
              <SwiperSlide key={cat.id} style={{ width: 'auto' }}>
                <div className="categoryCard">
                  <div className="imgWrapper">
                    {/* يفضل استخدام صورة الـ API وليس الـ static */}
                    <img lang='lazy' src={cat.image} alt={cat.name} />
                  </div>
                  <h6 className="title">{cat.name}</h6>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default TopCategories;