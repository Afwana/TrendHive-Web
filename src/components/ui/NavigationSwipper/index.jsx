/* eslint-disable react/prop-types */
import { A11y, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { SwiperNavButtons } from "./SwiperNavButtons";

export default function NavigationSwiper({
  data,
  SlideComponent,
  slidesPerView,
  spaceBetween = 10,
}) {
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}>
        {data?.map((item, index) => (
          <SwiperSlide key={index}>
            <SlideComponent {...item} />
          </SwiperSlide>
        ))}
        <SwiperNavButtons />
      </Swiper>
    </div>
  );
}
