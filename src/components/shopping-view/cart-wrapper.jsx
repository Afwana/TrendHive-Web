/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { toast } from "sonner";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems?.map((item, index) => (
              <UserCartItemsContent key={index} cartItem={item} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">&#8377;{totalCartAmount}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          if (cartItems.length === 0) {
            toast.error(
              "You'r cart is empty now, explore the fields and grab something!!!"
            );
          } else {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }
        }}
        className="w-full mt-6">
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
