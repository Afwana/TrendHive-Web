import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AuthModal from "./../../components/auth/authModal";
import { fetchAllCategories } from "@/store/shop/category-slice";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { categories } = useSelector((state) => state.shopCategory);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const categoryId = searchParams.get("category");

  function handleClearAllFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
  }

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (!newFilters[getSectionId]) {
        newFilters[getSectionId] = [];
      }

      const optionIndex = newFilters[getSectionId].indexOf(getCurrentOption);

      if (optionIndex === -1) {
        newFilters[getSectionId] = [
          ...newFilters[getSectionId],
          getCurrentOption,
        ];
      } else {
        newFilters[getSectionId] = newFilters[getSectionId].filter(
          (item) => item !== getCurrentOption,
        );

        if (newFilters[getSectionId].length === 0) {
          delete newFilters[getSectionId];
        }
      }

      // update session storage
      if (Object.keys(newFilters).length === 0) {
        sessionStorage.removeItem("filters");
      } else {
        sessionStorage.setItem("filters", JSON.stringify(newFilters));
      }

      return newFilters;
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock, sizeSelected) {
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
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // useEffect(() => {
  //   if (categoryId && categories && categories.length > 0) {
  //     const category = categories.find((cat) => cat._id === categoryId);
  //     if (category) {
  //       setFilters((prev) => ({
  //         ...prev,
  //         category: [category._id],
  //       }));
  //     }
  //   }
  // }, [categoryId, categories]);

  // useEffect(() => {
  //   setSort("price-lowtohigh");

  //   if (categoryId) {
  //     setFilters({});
  //   } else {
  //     setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  //   }
  // }, [categoryId]);

  useEffect(() => {
    if (categoryId && categories && categories.length > 0) {
      setFilters({ category: [categoryId] });
      sessionStorage.removeItem("filters");
    } else {
      const savedFilters = sessionStorage.getItem("filters");
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters));
      } else {
        setFilters({});
      }
    }
    setSort("price-lowtohigh");
  }, [categoryId, categories]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      const newParams = new URLSearchParams(createQueryString);
      if (categoryId) {
        newParams.set("category", categoryId);
      }
      setSearchParams(newParams, { replace: true });
    }
    // else if (categoryId) {
    //   setSearchParams(new URLSearchParams({ category: categoryId }), {
    //     replace: false,
    //   });
    // }
    else {
      setSearchParams({}, { replace: true });
    }
  }, [filters, setSearchParams, categoryId]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
          categoryId: categoryId,
        }),
      );
    }
  }, [dispatch, sort, filters, categoryId]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <div className="hidden md:block">
        <ProductFilter
          filters={filters}
          handleFilter={handleFilter}
          currentCategory={categoryId}
          clearFilter={handleClearAllFilters}
        />
      </div>
      <div className="grid grid-cols-2 md:hidden gap-3">
        <Sheet
          open={openFilterSheet}
          onOpenChange={() => setOpenFilterSheet(false)}
        >
          <SheetTrigger asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenFilterSheet(true);
              }}
              variant="outline"
              className="flex items-center gap-1"
            >
              <ListFilter className="w-6 h-6" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <ProductFilter
              filters={filters}
              handleFilter={handleFilter}
              currentCategory={categoryId}
              clearFilter={handleClearAllFilters}
            />
          </SheetContent>
          {/* <ProductFilter filters={filters} handleFilter={handleFilter} /> */}
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <ArrowUpDownIcon className="h-6 w-6" />
              <span>Sort by</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
              {sortOptions.map((sortItem) => (
                <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                  {sortItem.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={handleSort}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem, index) => (
              <ShoppingProductTile
                key={index}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      <AuthModal open={openAuthModal} setOpen={setOpenAuthModal} />
    </div>
  );
}

export default ShoppingListing;
