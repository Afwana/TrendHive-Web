import Whatsapp from "../../assets/icons/whatsapp.png";
import Facebook from "../../assets/icons/Facebook-logo.png";
import Instagram from "../../assets/icons/instagram-logo.png";
import Twitter from "../../assets/icons/twitter.png";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addMessages, fetchAdminInfo } from "@/store/shop/footer-slice";

export default function Footer() {
  const [message, setMessage] = useState("");
  const [adminInfo, setAdminInfo] = useState();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSendMessage = async () => {
    try {
      const formData = {
        userId: user?.id,
        message: message,
      };
      await dispatch(addMessages(formData)).unwrap();
      toast.success("Message send successfullty");
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Error sending message.");
    }
  };

  useEffect(() => {
    const AdminInfo = async () => {
      const result = await dispatch(fetchAdminInfo()).unwrap();
      console.log(result);

      if (result?.data) {
        setAdminInfo(result?.data);
      }
    };
    AdminInfo();
  }, [dispatch]);

  console.log(adminInfo);

  return (
    <div className="bg-[#000000] p-10">
      <div className="mx-auto grid max-w-full justify-center lg:grid-cols-1 gap-20">
        <div className="flex items-center justify-between text-white">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col justify-start">
              <Link to="/shop/home" className="flex gap-2">
                <span className="text-lg">TrendHive</span>
              </Link>
              <p className="text-gray-500 text-sm">
                Stay ahead with trending finds
              </p>
            </div>
            <div className="flex flex-wrap gap-5">
              <Link to={"/shop/home"}>
                <img src={Whatsapp} height={25} width={25} />
              </Link>
              <Link to={"/shop/home"}>
                <img src={Instagram} height={25} width={25} />
              </Link>
              <Link to={"/shop/home"}>
                <img src={Facebook} height={25} width={25} />
              </Link>
              <Link to={"/shop/home"}>
                <img src={Twitter} height={25} width={25} />
              </Link>
            </div>
          </div>
          <div className="relative w-2/4 flex justify-end text-black">
            <Input
              value={message}
              name="message"
              onChange={(event) => setMessage(event.target.value)}
              className="pr-16"
              placeholder="Share your queries with us..."
            />
            <Button
              onClick={handleSendMessage}
              variant="ghost"
              size="icon"
              className="absolute top-1/2 -translate-y-1/2 z-10">
              <MessageCircle className="w-4 h-4" color="black" />
            </Button>
          </div>
          <div className="text-sm flex flex-col gap-2 mt-3">
            <p>+91 {adminInfo?.phone ?? "-"}</p>
            <div className="flex flex-col">
              <p>{adminInfo?.address ?? "-"}</p>
              <p>{adminInfo?.city ?? "-"}</p>
              <p>
                {adminInfo?.state ?? "-"}, {adminInfo?.country ?? "-"}
              </p>
              <p>{adminInfo?.pincode ?? "-"}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div
            className="flex gap-2 cursor-pointer items-start justify-end"
            onClick={scrollToTop}>
            <div className="flex items-center rounded-full justify-center p-2 bg-white">
              <ArrowUp color="black" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-white text-base px-2">
              @2025 TrendHive --- All rights reserved
            </p>
            <p className="text-gray-500 text-sm px-2">
              Delivering what you love, right to your doorstep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
