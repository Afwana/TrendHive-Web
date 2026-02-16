// import { fetchAllBrands } from "@/store/admin/brand-slice";
// import { fetchAllCategories } from "@/store/admin/category-slice";
// import { Button, Chip, useDisclosure } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// import { fetchSubCategoriesOfCategory } from "./../../store/admin/category-slice/index";
import { Card, CardContent } from "@/components/ui/card";
// import AddNewProduct from "@/components/admin-view/Products/AddNewProduct";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { Button } from "@/components/ui/button";
import { fetchAllCategories } from "@/store/shop/category-slice";
import { fetchAllBrands } from "@/store/shop/brand-slice";
import { fetchSubCategoriesOfCategory } from "@/store/admin/category-slice";
import NavigationSwiper from "@/components/shopping-view/NavigationSwiper";
import { MessageCircle, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import StarRatingComponent from "./../../components/common/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { addReview, getReviews } from "@/store/shop/review-slice";

export default function ShoppingProductsDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts,
  );
  const { categoryList, subCategoryList } = useSelector(
    (state) => state.adminCategory,
  );
  const { brandList } = useSelector((state) => state.adminBrand);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);

  //   const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //   const [editProductData, setEditProductData] = useState(null);
  //   const [currentEditedId, setCurrentEditedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [productCategory, setProductCategory] = useState(null);
  const [productBrand, setProductBrand] = useState(null);
  const [sizeArray, setSizeArray] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySize, setEnquirySize] = useState("");

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
    dispatch(fetchAllFilteredProducts());
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails?.category) {
      dispatch(fetchSubCategoriesOfCategory(productDetails?.category));
    }
  }, [productDetails?.category, dispatch]);

  useEffect(() => {
    if (productDetails?.thumbnail) {
      setSelectedImage(productDetails?.thumbnail);
    }
  }, [productDetails]);

  useEffect(() => {
    if (productDetails?.category && categoryList.length > 0) {
      const foundCategory = categoryList.find(
        (cat) => cat._id === productDetails.category,
      );
      setProductCategory(foundCategory);
    }
  }, [productDetails, categoryList]);

  useEffect(() => {
    if (productDetails?.brand && brandList.length > 0) {
      const foundBrand = brandList.find(
        (brand) => brand._id === productDetails.brand,
      );
      setProductBrand(foundBrand);
    }
  }, [productDetails, brandList]);

  useEffect(() => {
    if (productDetails?.size) {
      if (Array.isArray(productDetails.size)) {
        const sizes = productDetails.size.map((size) =>
          typeof size === "string"
            ? size.toUpperCase()
            : String(size).toUpperCase(),
        );
        setSizeArray(sizes);
      } else if (typeof productDetails.size === "string") {
        const sizes = productDetails.size
          .split(",")
          .map((size) => size.trim())
          .filter((size) => size !== "");
        setSizeArray(sizes);
      } else {
        setSizeArray([]);
      }
    } else {
      setSizeArray([]);
    }
  }, [productDetails]);

  const matchSubCategories = useCallback(() => {
    if (productDetails?.subCategories && subCategoryList.length > 0) {
      const filteredSubCategories = subCategoryList.filter((subCat) => {
        const isMatch = productDetails.subCategories.some((subId) => {
          const subIdStr = String(subId);
          const subCatIdStr = String(subCat._id || subCat.id || "");
          return subIdStr === subCatIdStr;
        });
        return isMatch;
      });
      setSubCategories(filteredSubCategories);
    } else {
      setSubCategories([]);
    }
  }, [productDetails, subCategoryList]);

  useEffect(() => {
    matchSubCategories();
  }, [matchSubCategories]);

  const similarProducts = useCallback(() => {
    if (productDetails?.relativeProducts && productList.length > 0) {
      const filterProducts = productList.filter((product) => {
        const isMatch = productDetails.relativeProducts.some((prodId) => {
          const prodIdStr = String(prodId);
          const productIdStr = String(product._id || product._id || "");
          return prodIdStr === productIdStr;
        });
        return isMatch;
      });
      console.log(filterProducts);
      setRelatedProducts(filterProducts);
    } else {
      setRelatedProducts([]);
    }
  }, [productDetails, productList]);

  useEffect(() => {
    similarProducts();
  }, [similarProducts]);

  function handleAddToCart(getCurrentProductId, getTotalStock, sizeSelected) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId,
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.warning(
            `Only ${getQuantity} quantity can be added for this item`,
          );

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        size: sizeSelected,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  const handleProductSize = () => {
    if (!selectedSize) {
      toast.warning("Please input a size.");
      return;
    }
    handleAddToCart(
      productDetails?._id,
      productDetails?.totalStock,
      selectedSize,
    );
    setIsSizeModalOpen(false);
    setSelectedSize("");
  };

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      }),
    )
      .then((data) => {
        if (data.payload.success) {
          setRating(0);
          setReviewMsg("");
          dispatch(getReviews(productDetails?._id));
          toast.success("Review added successfully!");
        }
      })
      .catch((error) => {
        toast.error("You need to purchase product to review it.");
        console.log(error);
      });
  }

  const handleEnquiry = (product, size) => {
    const message = `Hello, I am interested in the following product\n\n${
      product?.title
    }\n*Category:* ${productCategory?.title}\n*Sub Category:* ${subCategories?.map((itm) => itm.title).join(",")}\n*Brand:* ${
      productBrand?.title
    }\n*Price:* ₹ ${
      product?.salePrice > 0 ? product?.salePrice : product?.price
    }\n*Size:* ${size}\n\n${product?.thumbnail}\n\nIs it available?`;

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

    handleEnquiry(productDetails, enquirySize);
    setIsEnquiryModalOpen(false);
    setEnquirySize("");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between gap-5">
          <h2 className="text-2xl font-bold text-primary">
            {productDetails?.title}
          </h2>
          <div className="flex items-center justify-end gap-3">
            <Button color="primary" size="lg" className="text-xl font-bold">
              {productDetails?.totalStock}
            </Button>
            <Dialog
              open={isEnquiryModalOpen}
              onOpenChange={setIsEnquiryModalOpen}
            >
              <DialogTrigger asChild>
                <Button color="primary" size="lg" className="text-xl font-bold">
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
            <div className="">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Dialog
                  open={isSizeModalOpen}
                  onOpenChange={setIsSizeModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      color="primary"
                      size="lg"
                      className="text-xl font-bold"
                    >
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
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* images swipe */}
          <div className="flex flex-col gap-3">
            <div className="w-full">
              <img
                src={selectedImage ?? "/placeholder.jpeg"}
                alt={`Thumbnail of ${productDetails?.title}`}
                className="object-contain md:object-cover w-full md:h-[500px] rounded-lg"
              />
            </div>
            {productDetails?.images && (
              <NavigationSwiper
                thumbnail={productDetails?.thumbnail}
                images={productDetails?.images}
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
              />
            )}
          </div>
          <div className="flex flex-col gap-5">
            {/* price details */}
            <div className="flex items-center justify-between gap-5">
              <Button color="danger" size="lg" className="w-full">
                &#8377;
                <span className="line-through">{`${productDetails?.price}`}</span>
              </Button>
              <Button color="success" size="lg" className="w-full">
                &#8377;<span>{`${productDetails?.salePrice}`}</span>
              </Button>
            </div>
            {/* description */}
            <p className="flex text-base md:text-lg font-medium text-justify">
              {productDetails?.description}
            </p>
            {/* category & brand */}
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center justify-start gap-2">
                <div className="w-10 h-10 rounded-full border-1 border-green-300 overflow-hidden">
                  <img
                    src={productCategory?.image || "/placeholder.jpg"}
                    alt={productCategory?.title || "Category"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg font-semibold">
                  {productCategory?.title}
                </p>
              </div>
              <div className="flex items-center justify-start gap-2">
                <div className="w-10 h-10 rounded-full border-1 border-green-300 overflow-hidden">
                  <img
                    src={productBrand?.image || "/placeholder.jpg"}
                    alt={productBrand?.title || "Category"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg font-semibold">{productBrand?.title}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-5">
              {/* product sizes */}
              <div className="flex items-center justify-start gap-3">
                {sizeArray.length > 0 ? (
                  sizeArray?.map((size, imdex) => (
                    <Button
                      key={imdex}
                      color="primary"
                      className="text-lg w-10 p-2 uppercase"
                    >
                      {size}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm font-medium">
                    No sizes available!!
                  </p>
                )}
              </div>
              {/* Quality */}
              <div className="flex items-center justify-center p-3 rounded-full bg-success text-xl border border-amber-300 font-bold w-14 h-14">
                {productDetails?.quality}
              </div>
            </div>
            {/* sub categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              {subCategories?.map((subCat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-start gap-2"
                >
                  <div className="w-20 h-20 rounded-lg border-1 border-green-300 overflow-hidden">
                    <img
                      src={subCat?.image || "/placeholder.jpg"}
                      alt={subCat?.title || "Category"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-lg font-semibold">{subCat?.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {relatedProducts && relatedProducts.length > 0 ? (
        <div className="flex justify-start flex-col gap-5 mt-10">
          <h1 className="flex justify-start text-lg md:text-xl lg:text-2xl font-semibold">
            Related Products
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((productItem, index) => (
              <Card
                key={index}
                className="w-full max-w-sm mx-auto pt-0 cursor-pointer"
                onClick={() => navigate(`/admin/products/${productItem?._id}`)}
              >
                <div>
                  <div className="relative">
                    <img
                      src={productItem?.thumbnail}
                      alt={productItem?.title}
                      className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent>
                    <h2 className="text-xl font-bold mb-2 mt-2">
                      {productItem?.title}
                    </h2>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`${
                          productItem?.salePrice > 0 ? "line-through" : ""
                        } text-lg font-semibold text-primary`}
                      >
                        &#8377; {productItem?.price}
                      </span>
                      {productItem?.salePrice > 0 ? (
                        <span className="text-lg font-bold">
                          &#8377; {productItem?.salePrice}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex p-8 flex-col gap-5">
        <p className="text-xl font-semibold">Let&apos;s Review It!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5 w-full">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground">
                ({averageReview.toFixed(2)})
              </span>
            </div>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, index) => (
                  <div key={index} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
          </div>
          <div className="flex-col flex gap-2">
            <Label>Write a review</Label>
            <div className="flex gap-1">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>
            <div className="px-2">
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                className="w-full h-[150px]"
                placeholder="Write a review..."
              />
            </div>
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-end bottom-0 justify-between mt-20 p-5">
        <p className="text-sm md:text-base font-medium">
          Updated At: {new Date(productDetails?.updatedAt).toLocaleString()}
        </p>
        <p className="text-sm md:text-base font-medium">
          {new Date(productDetails?.createdAt).toLocaleString()}
        </p>
      </div>
    </>
  );
}
