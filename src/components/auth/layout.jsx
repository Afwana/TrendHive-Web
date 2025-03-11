import { Outlet } from "react-router-dom";
import layoutImage from "../../assets/layout.jpg";
import logo from "../../assets/Auth-Logo.png";

function AuthLayout() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="hidden lg:flex items-center justify-center bg-black w-2/3">
        <img src={layoutImage} alt="auth-image" className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-8 items-center justify-center w-full p-10">
        <img src={logo} alt="auth-image" className="" />
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
