import { Route, Routes, useLocation } from "react-router-dom";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth } from "./store/auth-slice";
// import { Skeleton } from "@/components/ui/skeleton";
import SearchProducts from "./pages/shopping-view/search";
import AuthModal from "@/components/auth/authModal";

function App() {
  const {
    user,
    isAuthenticated,
    // isLoading
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.showAuthModal) {
      setAuthModalOpen(true);
    }
  }, [location]);

  // if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <AuthModal
        open={authModalOpen}
        setOpen={setAuthModalOpen}
        // You might want to pass the original path for redirect after login
        redirectPath={location.state?.from || "/shop/home"}
      />

      <Routes>
        <Route path="/" element={<ShoppingLayout />}>
          <Route index element={<ShoppingHome />} />
        </Route>

        {/* <Route
          path="/auth"
          element={
            // <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
            // </CheckAuth>
          }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route> */}

        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProducts />} />

          <Route
            path="checkout"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingCheckout />
              </CheckAuth>
            }
          />
          <Route
            path="account"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingAccount />
              </CheckAuth>
            }
          />
        </Route>

        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
