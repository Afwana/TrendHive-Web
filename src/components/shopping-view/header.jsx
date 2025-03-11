import {
  House,
  LayoutList,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserCog,
  X,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Input } from "@/components/ui/input";
import logo from "../../assets/TrendHive.png";

function MenuItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  console.log(searchParams);

  function handleSearch() {
    if (keyword && keyword.trim() !== "") {
      navigate(`/shop/search?keyword=${keyword}`);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
    }
  }

  return (
    <div className="flex justify-between gap-3 items-center w-full">
      <div className="w-full flex items-center relative h-fit">
        <div className="relative w-full flex justify-end">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="pr-16"
            placeholder="Search Products..."
          />
          {keyword && (
            <Button
              onClick={() => setKeyword("")}
              variant="ghost"
              size="icon"
              className="absolute top-1/2 -translate-y-1/2 z-10">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          variant="outline"
          size="icon"
          className="ml-2">
          <Search />
        </Button>
      </div>
    </div>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  console.log(cartItems, "sangam");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <div className="flex justify-start gap-3 items-center">
        <Button
          onClick={() => navigate("/shop/home")}
          variant="outline"
          size="icon"
          className="relative">
          <House className="w-6 h-6" />
        </Button>
        <span className="block lg:hidden text-base font-bold">Home</span>
      </div>
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <div className="flex justify-start gap-3 items-center">
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="outline"
            size="icon"
            className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
              {cartItems?.items?.length || 0}
            </span>
            <span className="sr-only">User cart</span>
          </Button>
          <span className="block lg:hidden text-base font-bold">Cart</span>
        </div>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>{user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/listing")}>
            <LayoutList className="mr-2 h-4 w-4" />
            Products
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  console.log(isAuthenticated);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <img src={logo} alt="TrendHive" width={200} height={200} />
        </Link>
        <div className="flex justify-between gap-3">
          <Button
            onClick={() => navigate("/shop/search")}
            variant="outline"
            size="icon"
            className="relative block lg:hidden">
            <Search className="w-6 h-6" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              {/* <MenuItems /> */}
              <HeaderRightContent />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:block w-[600px]">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
