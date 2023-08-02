import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import singleProductDetailSlice from "./singleProductDetailSlice";
import loginSlice from './loginSlice';
import registerSlice from "./registerSlice";
import userDetailsMyselfSlice from "./userDetailsMyselfSlice";
import logoutSlice from "./logoutSlice";
import updatePasswordSlice from "./updatePasswordSlice";
import updateProfileSlice from "./updateProfileSlice";
import allProductsSlice from "./allProductsSlice";
import reportSlice from "./reportSlice";
import addItemToCartSlice from "./addItemToCartSlice";
import addItemToFavouriteSlice from "./addItemToFavouriteSlice";
import shippingInfoSlice from "./shippingInfoSlice";
import orderCreateSlice from "./orderCreateSlice";
import createReviewSlice from "./createReviewSlice";
import allOrdersSlice from "./allOrdersSlice";
import allUsersSlice from "./allUsersSlice";
import createProductSlice from "./createProductSlice";
import deleteProductSlice from "./deleteProductSlice";
import updateProductSlice from "./updateProductSlice";
import deleteOrderSlice from "./deleteOrderSlice";
import singleOrderDetailSlice from "./singleOrderDetailSlice";
import updateOrderSlice from "./updateOrderSlice";
import deleteUserSlice from "./deleteUserSlice";
import singleUserDetailSlice from "./singleUserDetailSlice";
import updateUserRoleSlice from "./updateUserRoleSlice";
import allReviewsProductSlice from "./allReviewsProductSlice";
import deleteProductReviewSlice from "./deleteProductReviewSlice";
import forgotPasswordSlice from "./forgotPasswordSlice";

const store = configureStore({
    reducer: {
        products: productSlice,
        allProducts: allProductsSlice,
        singleProductDetail: singleProductDetailSlice,
        login: loginSlice,
        logout: logoutSlice,
        register: registerSlice,
        userDetailsMyself: userDetailsMyselfSlice,
        updatePassword: updatePasswordSlice,
        updateProfile: updateProfileSlice,
        report: reportSlice,
        addItemToCart: addItemToCartSlice,
        addItemToFavourite: addItemToFavouriteSlice,
        shippingInfo: shippingInfoSlice,
        orderCreate: orderCreateSlice,
        createReview: createReviewSlice,
        allOrders: allOrdersSlice,
        allUsers: allUsersSlice,
        createProduct: createProductSlice,
        deleteProduct: deleteProductSlice,
        updateProduct: updateProductSlice,
        deleteOrder: deleteOrderSlice,
        singleOrderDetail: singleOrderDetailSlice,
        updateOrder: updateOrderSlice,
        deleteUser: deleteUserSlice,
        singleUserDetail: singleUserDetailSlice,
        updateUserRole: updateUserRoleSlice,
        allReviewsProduct: allReviewsProductSlice,
        deleteProductReview: deleteProductReviewSlice,
        forgotPassword: forgotPasswordSlice,
    }
});

export default store;