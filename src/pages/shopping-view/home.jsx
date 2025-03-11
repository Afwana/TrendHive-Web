import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { toast } from "sonner";
import { fetchAllCategories } from "@/store/shop/category-slice";
import { fetchAllBrands } from "@/store/shop/brand-slice";
import NavigationSwiper from "./../../components/ui/NavigationSwipper/index";

function ShoppingHome() {
  // const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { categoryList } = useSelector((state) => state.shopCategory);
  const { brandList } = useSelector((state) => state.shopBrand);

  console.log(featureImageList);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    const filteredItem = getCurrentItem?.title?.toLowerCase();
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [filteredItem],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
  //   }, 15000);

  //   return () => clearInterval(timer);
  // }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const CategoryCard = (item) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-4 ml-20">
        <div className="flex flex-col items-center cursor-pointer">
          <div
            onClick={() => handleNavigateToListingPage(item, "category")}
            className="hover:shadow-lg flex flex-col items-center w-24 h-24 rounded-full bg-cover bg-center mb-2"
            style={{
              backgroundImage: `url(${item.image})`,
            }}></div>
          <span className="font-medium text-center">{item.title}</span>
        </div>
      </div>
    );
  };

  const BrandCard = (brandItem) => {
    return (
      <div className="flex gap-4 items-center">
        <Card isFooterBlurred className="border-none" radius="lg">
          <img
            alt={brandItem.title}
            className="w-[200px] h-[200px]"
            src={brandItem.image}
          />
          <CardFooter className="justify-center border-1 overflow-hidden py-1 rounded-large items-center w-full mt-5">
            <Button
              className="text-tiny text-white bg-black"
              color="default"
              radius="lg"
              size="lg"
              variant="flat">
              {brandItem.title}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full h-full overflow-hidden">
        <div className="flex flex-col gap-3 md:hidden">
          {featureImageList && featureImageList.length > 0 ? (
            featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className="top-0 left-0 w-full h-full object-cover"
              />
            ))
          ) : (
            <p className="text-red-500 text-sm font-bold">
              Load..., Backend is fixing something here....
            </p>
          )}
        </div>
        <div className="md:flex flex-col gap-3 hidden lg:hidden">
          <div className="grid grid-cols-2 gap-5">
            <img
              src={featureImageList[0]?.image}
              className="top-0 left-0 w-full h-full object-cover"
            />
            <img
              src={featureImageList[1]?.image}
              className="top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <div className="flex">
            <img
              src={featureImageList[2]?.image}
              className="top-0 left-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="lg:flex gap-5 hidden max-w-full">
          <div className="flex w-2/3">
            <img
              src={featureImageList[0]?.image}
              className="top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-5 w-1/3">
            <img
              src={featureImageList[1]?.image}
              className="top-0 left-0 w-full h-full object-cover"
            />
            <img
              src={featureImageList[2]?.image}
              className="top-0 left-0 w-full h-full object-cover"
            />
          </div>
        </div>
        {/* {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null} */}
        {/* <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80">
          <ChevronLeftIcon className="w-4 h-4" />
        </Button> */}
        {/* <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
          <ChevronRightIcon className="w-4 h-4" />
        </Button> */}
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="hidden lg:block">
            <NavigationSwiper
              data={categoryList}
              SlideComponent={CategoryCard}
              slidesPerView={8}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-4 lg:hidden">
            {categoryList.map((categoryItem, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer">
                <div
                  key={index}
                  onClick={() =>
                    handleNavigateToListingPage(categoryItem, "category")
                  }
                  className="hover:shadow-lg flex flex-col items-center w-24 h-24 rounded-full bg-cover bg-center mb-2"
                  style={{
                    backgroundImage: `url(${categoryItem.image})`,
                  }}></div>
                <span className="font-medium text-center">
                  {categoryItem.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.slice(0, 20).map((productItem) => (
                  // eslint-disable-next-line react/jsx-key
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Explore the brands
          </h2>
          <div className="hidden lg:block">
            <NavigationSwiper
              data={brandList}
              SlideComponent={BrandCard}
              slidesPerView={6}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:hidden">
            {brandList.map((brandItem, index) => (
              <Card
                key={index}
                isFooterBlurred
                className="border-none"
                radius="lg">
                <img
                  alt={brandItem.title}
                  className="w-[200px] h-[200px]"
                  src={brandItem.image}
                />
                <CardFooter className="justify-center border-1 overflow-hidden py-1 rounded-large items-center w-full mt-5">
                  <Button
                    className="text-tiny text-white bg-black"
                    color="default"
                    radius="lg"
                    size="lg"
                    variant="flat">
                    {brandItem.title}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
