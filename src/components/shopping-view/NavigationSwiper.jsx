/* eslint-disable react/prop-types */
import React, { useRef } from "react";

import SwiperCore from "swiper";
import { A11y, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Swiper, SwiperSlide } from "swiper/react";

export default function NavigationSwiper({
  thumbnail,
  images,
  selectedImage,
  setSelectedImage,
}) {
  console.log(images);

  const swiperRef = useRef(null);
  const slidesPerView = 4;

  // const handleSlideChange = (swiper: SwiperCore) => {
  //   const start = swiper.activeIndex;
  //   const end = Math.min(start + slidesPerView, images.length);
  // };

  const handleNext = () => {
    const currentIndex = images.findIndex((image) => image === selectedImage);

    if (currentIndex === images.length - 1) {
      setSelectedImage(thumbnail);
      return;
    }

    const nextIndex = currentIndex + 1;
    setSelectedImage(images[nextIndex]);

    if ((nextIndex + 1) % slidesPerView === 0 && swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrev = () => {
    const currentIndex = images.findIndex((image) => image === selectedImage);

    if (selectedImage === thumbnail) {
      setSelectedImage(images[images.length - 1]);
      return;
    }

    if (currentIndex === 0) {
      setSelectedImage(thumbnail);
      return;
    }

    const prevIndex = currentIndex - 1;
    setSelectedImage(images[prevIndex]);

    if (currentIndex % slidesPerView === 0 && swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="">
        <Button
          className="border border-slate-200 bg-white"
          onClick={handlePrev}
          isIconOnly
        >
          <ArrowLeft size={20} />
        </Button>
      </div>

      <Swiper
        modules={[Pagination, A11y]}
        spaceBetween={5}
        slidesPerView={slidesPerView}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        style={{ width: "100%" }}
      >
        {images?.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className={`
                cursor-pointer w-full transition-all duration-200 ease-in-out shadow-lg
                md:h-[100px] lg:h-[150px]
                ${
                  selectedImage === item
                    ? "scale-105 shadow-lg z-10"
                    : "hover:scale-102"
                }
              `}
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item}
                alt="product images"
                className={
                  selectedImage === item
                    ? "rounded-xl border-3 border-black object-cover w-full h-[80px] md:h-[100px] lg:h-[150px]"
                    : "rounded-xl object-cover h-[80px] md:h-[100px] lg:h-[150px] w-full"
                }
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="">
        <Button
          className="border border-slate-200 bg-white"
          onClick={handleNext}
          isIconOnly
        >
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
}
