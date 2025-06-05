import Whatsapp from "../../assets/icons/whatsapp.png";
import Facebook from "../../assets/icons/Facebook-Logo.png";
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
import AuthModal from "./../auth/authModal";

export default function Footer() {
  const [message, setMessage] = useState("");
  const [adminInfo, setAdminInfo] = useState();
  const [openAuthModal, setOpenAuthModal] = useState(false);
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
      if (!user) {
        toast.error("Message can't send!!!", {
          description: "Please login to your account.",
          action: {
            label: "Login",
            onClick: () => setOpenAuthModal(true),
          },
        });
      } else {
        if (!message) {
          toast.warning("Can't send an empty message");
        } else {
          const formData = {
            userId: user?.id,
            message: message,
          };
          await dispatch(addMessages(formData)).unwrap();
          toast.success("Message send successfullty");
          setMessage("");
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Error sending message.");
    }
  };

  useEffect(() => {
    const AdminInfo = async () => {
      const result = await dispatch(fetchAdminInfo()).unwrap();

      if (result?.data) {
        setAdminInfo(result?.data);
      }
    };
    AdminInfo();
  }, [dispatch]);

  return (
    <div className="bg-[#000000] p-5 md:p-10">
      <div className="mx-auto grid max-w-full justify-center lg:grid-cols-1 gap-5 md:gap-20">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between text-white gap-4 md:gap-0">
          <div className="flex flex-col gap-4 md:gap-10">
            <div className="flex flex-col items-center md:items-start ustify-start">
              <Link to="/shop/home" className="flex gap-2">
                <span className="text-lg">TrendHive</span>
              </Link>
              <p className="text-gray-500 text-sm">
                Stay ahead with trending finds
              </p>
            </div>
            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
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
          <div className="relative md:w-2/4 flex justify-end text-black">
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
            <div className="flex flex-row md:flex-col gap-2">
              <p>{adminInfo?.address ?? "-"},</p>
              <p>{adminInfo?.city ?? "-"},</p>
              <p>
                {adminInfo?.state ?? "-"}, {adminInfo?.country ?? "-"},
              </p>
              <p>{adminInfo?.pincode ?? "-"}.</p>
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
      <AuthModal open={openAuthModal} setOpen={setOpenAuthModal} />
    </div>
  );
}
