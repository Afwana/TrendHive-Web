import { useSwiper } from "swiper/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
export const SwiperNavButtons = () => {
  const swiper = useSwiper();

  return (
    <div className="my-2 flex justify-end gap-2 lg:my-5">
      <Button className="m-0 min-w-fit p-3" onClick={() => swiper.slidePrev()}>
        <ChevronLeft size={20} />
      </Button>
      <Button className="m-0 min-w-fit p-3" onClick={() => swiper.slideNext()}>
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};
