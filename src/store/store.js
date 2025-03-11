import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

import adminProfileSlice from "./admin/profile-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminCategorySlice from "./admin/category-slice";
import adminBrandSlice from "./admin/brand-slice";
import adminFooterSlice from "./admin/footer-slice";
import adminReviewSlice from "./admin/review-slice";
import adminReturnSlice from "./admin/return-slice";

import shopProfileSlice from "./shop/profile-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import shopCategorySlice from "./shop/category-slice";
import shopBrandSlice from "./shop/brand-slice";
import shopFooterSlice from "./shop/footer-slice";
import shopReturnSlice from "./shop/return-slice";

import commonFeatureSlice from "./common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProfile: adminProfileSlice,
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminCategory: adminCategorySlice,
    adminBrand: adminBrandSlice,
    adminFooter: adminFooterSlice,
    adminReviews: adminReviewSlice,
    adminReturn: adminReturnSlice,

    shopProfile: shopProfileSlice,
    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    shopCategory: shopCategorySlice,
    shopBrand: shopBrandSlice,
    shopFooter: shopFooterSlice,
    shopReturn: shopReturnSlice,

    commonFeature: commonFeatureSlice,
  },
});

export default store;
