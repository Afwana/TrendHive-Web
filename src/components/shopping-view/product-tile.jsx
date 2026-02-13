/* eslint-disable react/prop-types */
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";

function ShoppingProductTile({
  product,
  // handleGetProductDetails,
  handleAddtoCart,
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [enquirySize, setEnquirySize] = useState("");
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleEnquiry = (product, size) => {
    const message = `Hello, I am interested in the following product\n\n${
      product?.title
    }\n*Category:* ${categoryOptionsMap[product?.category]}\n*Brand:* ${
      brandOptionsMap[product?.brand]
    }\n*Price:* ₹ ${
      product?.salePrice > 0 ? product?.salePrice : product?.price
    }\n*Size:* ${size}\n${product?.thumbnail}\n\nIs it available?`;

    const phoneNumber = "916238933760";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappURL, "_blank");
  };

  const handleSizeForEnquiry = () => {
    if (!enquirySize) {
      toast.error("Please input a size");
    }

    handleEnquiry(product, enquirySize);
    setIsEnquiryModalOpen(false);
    setEnquirySize("");
  };

  const handleProductSize = () => {
    if (!selectedSize) {
      toast.warning("Please input a size.");
      return;
    }
    handleAddtoCart(product?._id, product?.totalStock, selectedSize);
    setIsSizeModalOpen(false);
    setSelectedSize("");
  };
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => navigate(`/shop/products/${product?._id}`)}>
        <div className="relative">
          <img
            src={product?.thumbnail}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              &#8377; {product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                &#8377; {product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex flex-col lg:flex-row items-center justify-between gap-3 md:gap-5">
        <Dialog open={isEnquiryModalOpen} onOpenChange={setIsEnquiryModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <MessageCircle /> Enquiry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Size</DialogTitle>
            </DialogHeader>
            <div className="flex w-full">
              <Input
                value={enquirySize}
                onChange={(e) => setEnquirySize(e.target.value)}
                className="border-black border-2"
              />
            </div>
            <Button
              onClick={handleSizeForEnquiry}
              disabled={!enquirySize}
              className="w-full mt-4"
            >
              Add Size
            </Button>
          </DialogContent>
        </Dialog>

        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Dialog open={isSizeModalOpen} onOpenChange={setIsSizeModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <ShoppingBag /> Add to cart
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Size</DialogTitle>
              </DialogHeader>
              <div className="flex w-full">
                <Input
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="border-black border-2"
                />
              </div>
              <Button
                onClick={handleProductSize}
                disabled={!selectedSize}
                className="w-full mt-4"
              >
                Add Size
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
