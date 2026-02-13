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

  //   const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //   const [editProductData, setEditProductData] = useState(null);
  //   const [currentEditedId, setCurrentEditedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [productCategory, setProductCategory] = useState(null);
  const [productBrand, setProductBrand] = useState(null);
  const [sizeArray, setSizeArray] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
      <div className="flex items-end bottom-0 justify-between mt-20">
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
