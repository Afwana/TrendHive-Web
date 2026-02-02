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
import { fetchAllBrands } from "@/store/shop/brand-slice";
import NavigationSwiper from "./../../components/ui/NavigationSwipper/index";
import AuthModal from "./../../components/auth/authModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchAllCategories } from "@/store/shop/category-slice";

function ShoppingHome() {
  // const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { categoryList } = useSelector((state) => state.shopCategory);
  const { brandList } = useSelector((state) => state.shopBrand);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [api, setApi] = useState();
  // const [current, setCurrent] = useState(0);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");

    if (getCurrentItem && section) {
      const filteredItem =
        getCurrentItem._id || getCurrentItem?.title?.toLowerCase();
      const currentFilter = {
        [section]: [filteredItem],
      };
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    }
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock, sizeSelected) {
    console.log(getCurrentProductId, getTotalStock, sizeSelected);

    if (!user) {
      toast.error("Oops, can't add to cart!!!", {
        description: "Please login to your account.",
        action: {
          label: "Login",
          onClick: () => setOpenAuthModal(true),
        },
      });
    } else {
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
          toast.success("Product added to cart");
        }
      });
    }
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const BrandCard = (brandItem) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-4 ml-20">
        <div className="flex flex-col items-center cursor-pointer">
          <div
            onClick={() => handleNavigateToListingPage(brandItem, "brand")}
            className="hover:shadow-lg flex flex-col items-center w-28 h-28 rounded-full bg-cover bg-center mb-2 border-2 border-gray-300"
            style={{
              backgroundImage: `url(${brandItem.image})`,
            }}
          ></div>
          <span className="font-medium text-center">{brandItem.title}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full h-full overflow-hidden">
        <div className="flex w-full">
          {featureImageList && featureImageList.length > 0 ? (
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {featureImageList.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={slide?.image}
                        alt={`Feature ${index + 1}`}
                        className="w-full h-auto lg:h-[500px] object-fill rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <p className="text-red-500 text-sm font-bold">
              Load..., Backend is fixing something here....
            </p>
          )}
        </div>
      </div>
      <section className="bg-gray-50">
        <div className="flex items-center justify-center w-full gap-4 py-12 px-5">
          <div
            className="flex items-center justify-center px-3 py-1 border border-primary rounded-full w-40 cursor-pointer"
            onClick={() => {
              sessionStorage.removeItem("filters");
              navigate(`/shop/listing`);
            }}
          >
            <p className="text-2xl font-bold text-primary">All</p>
          </div>
          {categoryList &&
            categoryList.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-center px-3 py-1 border border-primary rounded-full w-40 cursor-pointer"
                onClick={() => {
                  sessionStorage.removeItem("filters");
                  navigate(`/shop/listing?category=${category._id}`);
                }}
              >
                <p className="text-2xl font-bold text-primary">
                  {category.title}
                </p>
              </div>
            ))}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-left mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
              >
                <div
                  key={index}
                  onClick={() =>
                    handleNavigateToListingPage(brandItem, "brand")
                  }
                  className="hover:shadow-lg flex flex-col items-center w-24 h-24 rounded-full bg-cover bg-center mb-2"
                  style={{
                    backgroundImage: `url(${brandItem.image})`,
                  }}
                ></div>
                <span className="font-medium text-center">
                  {brandItem.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      <AuthModal open={openAuthModal} setOpen={setOpenAuthModal} />
    </div>
  );
}

export default ShoppingHome;
