/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import { useState } from "react";
import AuthModal from "../auth/authModal";
import { Navigate } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  console.log(authModalOpen);

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return (
        <>
          <AuthModal open={true} setOpen={setAuthModalOpen} />
          {children}
        </>
      );
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return (
      <>
        <AuthModal open={true} setOpen={setAuthModalOpen} />
      </>
    );
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return (
      <Navigate
        to="/shop/home"
        state={{ showAuthModal: true, from: location.pathname }}
        replace
      />
    );
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return <Navigate to="/shop/home" />;
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
