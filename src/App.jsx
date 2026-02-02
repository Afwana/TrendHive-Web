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
import SearchProducts from "./pages/shopping-view/search";
import AuthModal from "@/components/auth/authModal";
import { Spinner } from "./components/ui/spinner";
import { Button } from "./components/ui/button";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  );
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full mx-auto">
        <Button disabled size="sm">
          <Spinner data-icon="inline-start" />
          Loading...
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <AuthModal
        open={authModalOpen}
        setOpen={setAuthModalOpen}
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
