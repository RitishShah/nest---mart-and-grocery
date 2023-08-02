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
    status: StatusCode.IDLE
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
        
            const existingItem = state.items.find((item) => item._id === newItem._id);
        
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
        }

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(addItemToCartDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(addItemToCartDetails.fulfilled, (state, action) => {
            console.log(action.payload);
            state.data = action.payload.data.data.data;
            state.status = StatusCode.IDLE;
            state.count = state.count + 1;
            console.log(state.data);
            
        })
        .addCase(addItemToCartDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { addProductInCart, removeProductInCart, increaseProductQuantity, decreaseProductQuantity } = addItemToCartSlice.actions; 
export default addItemToCartSlice.reducer;

export const addItemToCartDetails = createAsyncThunk('addItemToCart/post', async ({id, quantity}) => {
    try {
        const link = `/api/v2/product/${id}`;
        console.log(link);
        const request = await axios.get(link);
        const response = await request.data.data;

        console.log("res", response);
        console.log("req", request);
        return { "data": request };
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