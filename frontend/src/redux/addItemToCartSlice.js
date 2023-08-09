import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const items = localStorage.getItem("cartList") !== null ? JSON.parse(localStorage.getItem("cartList")) : [];
const totalQuantity = localStorage.getItem("cartQuantity") !== null ? JSON.parse(localStorage.getItem("cartQuantity")) : 0;
const totalAmount = localStorage.getItem("cartTotal") !== null ? JSON.parse(localStorage.getItem("cartTotal")) : 0;

// adding this function to prevent repear code 
const setCartListFunc = (items, totalAmount, totalQuantity) => {
    localStorage.setItem("cartList", JSON.stringify(items));
    localStorage.setItem("cartTotal", JSON.stringify(totalAmount));
    localStorage.setItem("cartQuantity", JSON.stringify(totalQuantity));
};

const initialState = {
    items: items,
    totalQuantity: totalQuantity,
    totalAmount: totalAmount,
    status: StatusCode.IDLE,
    error: null,
    databaseProductsData: null,
}

const addItemToCartSlice = createSlice({
    name: 'addItemToCart',
    initialState,
    // Handle synchronous operations.
    reducers: {
        addProductInCart(state, action) {
            const newItem = action.payload.product;
            const quantity = action.payload.quantity;

            console.log("add item cart", action.payload);
            console.log("newItem",newItem._id);
            console.log("state items", state.items);

            if(!state.items) {
                localStorage.setItem("cartList", JSON.stringify(state.items));
                localStorage.setItem("cartTotal", JSON.stringify(state.totalAmount));
                localStorage.setItem("cartQuantity", JSON.stringify(state.totalQuantity));  
                
                setCartListFunc(
                    [],
                    state.totalAmount,
                    state.totalQuantity
                );

                state.items = [];
            }
        
            const existingItem = state.items ? state.items.find((item) => item._id === newItem._id) : null;
        
            if (!existingItem) {
                state.totalQuantity++;
                state.items.push({
                    _id: newItem._id,
                    price: newItem.price,
                    quantity: quantity,
                    totalPrice: newItem.price,
                    name: newItem.name,
                    images: newItem.images,
                    category: newItem.category,
                    stock: newItem.stock
                });
            } else {                
                existingItem.quantity = existingItem.quantity + quantity;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
        
         // added totalAmount to calculate number of items
            state.totalAmount = state.items.reduce((total, items) => total + Number(items.price) * Number(items.quantity), 0);
            
          // Using function for all initialState
            setCartListFunc(
                state.items.map((item) => item),
                state.totalAmount,
                state.totalQuantity
            );
        },

        removeProductInCart(state, action) {
            const currItem = action.payload;
            const newItemList = state.items.filter((item) => item._id !== currItem._id);
            console.log(newItemList);
            if(newItemList) {
                state.totalAmount = newItemList.reduce((total, items) => total + Number(items.price) * Number(items.quantity), 0);
            } else {
                state.totalAmount = 0;
            }
            state.totalQuantity--;
            state.items = newItemList;

            // Using function for all initialState
            setCartListFunc(
                state.items.map((item) => item),
                state.totalAmount,
                state.totalQuantity
            );
        },

        increaseProductQuantity(state, action) {
            const currItem = action.payload;
            const product = state.items.find((item) => item._id === currItem._id);
            product.quantity  = product.quantity + 1;
            state.totalAmount = state.items.reduce((total, items) => total + Number(items.price) * Number(items.quantity), 0);

            setCartListFunc(
                state.items.map((item) => item),
                state.totalAmount,
                state.totalQuantity
            );
        },

        decreaseProductQuantity(state, action) {
            const currItem = action.payload;
            const product = state.items.find((item) => item._id === currItem._id);
            product.quantity  = product.quantity - 1;
            state.totalAmount = state.items.reduce((total, items) => total + Number(items.price) * Number(items.quantity), 0);
            
            setCartListFunc(
                state.items.map((item) => item),
                state.totalAmount,
                state.totalQuantity
            );
        },

        resetAddItemToCart: (state) => {
            state.items = null;
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },

        addCartProductsToLocalStorage: (state) => {

            if(!state.items) {
                localStorage.setItem("cartList", JSON.stringify(state.items));
                localStorage.setItem("cartTotal", JSON.stringify(state.totalAmount));
                localStorage.setItem("cartQuantity", JSON.stringify(state.totalQuantity));

                setCartListFunc(
                    [],
                    state.totalAmount,
                    state.totalQuantity
                );

                state.items = [];
            }

            state.databaseProductsData.forEach(element => {
                const isPresent = state.items ? state.items.find((ele) => ele._id === element._id) : null;
                if(isPresent) {
                    isPresent.quantity = isPresent.quantity + element.quantity;
                    isPresent.totalPrice = isPresent.totalPrice + element.totalPrice;
                } else {
                    console.log("state db to ls", state.items);
                    state.items.push({
                        _id: element._id,
                        price: element.price,
                        quantity: element.quantity,
                        totalPrice: element.price,
                        name: element.name,
                        images: element.images,
                        category: element.category,
                        stock: element.stock
                    });
                    state.totalQuantity++;
                }
            });

            state.totalAmount = state.items.reduce((total, items) => total + Number(items.price) * Number(items.quantity), 0);
            setCartListFunc( state.items.map((item) => item), state.totalAmount, state.totalQuantity);
        },

        emptyLocalStorageCartItemsAfterPaymentDone: (state) => {
            localStorage.removeItem('cartList');
            localStorage.removeItem('cartTotal');
            localStorage.removeItem('cartQuantity');
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(cartDatabaseToLocalStorageDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(cartDatabaseToLocalStorageDetails.fulfilled, (state, action) => {
            console.log("Review Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.databaseProductsData = action.payload.data.data;
                console.log("state", state.databaseProductsData);
                // state.isOrderDeleted = true;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(cartDatabaseToLocalStorageDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { addProductInCart, removeProductInCart, increaseProductQuantity, decreaseProductQuantity, resetAddItemToCart,
    addCartProductsToLocalStorage, emptyLocalStorageCartItemsAfterPaymentDone } = addItemToCartSlice.actions; 
export default addItemToCartSlice.reducer;

// export const addItemToCartDetails = createAsyncThunk('addItemToCart/post', async () => {
//     return "data";
// });

export const cartDatabaseToLocalStorageDetails = createAsyncThunk('cartDatabaseToLocalStorage/get', async () => {
    try {
        console.log("database to localStroage Start");
        const request = await axios.get(`/api/v2/cart/DatabaseToLocalStorage`);
        console.log("req", request);
        console.log("Order Review");
        return { "data": request.data };
    } catch (error) {
        if (error.response) {
            console.log('Response data:', error.response.data);
            console.log('Response status:', error.response.status);
            console.log('Response headers:', error.response.headers);
            return { "error": error.response.data };
        } else if (error.request) {
            console.log('No response received:', error.request);
            return { "error": error.request };
        } else {
            console.log('Error setting up the request:', error.message);
            return { "error": error };
        }
    }
});