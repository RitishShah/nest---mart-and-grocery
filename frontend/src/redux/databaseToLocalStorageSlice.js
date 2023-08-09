import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const items = localStorage.getItem("cartList") !== null ? JSON.parse(localStorage.getItem("cartList")) : [];
const totalQuantity = localStorage.getItem("cartQuantity") !== null ? JSON.parse(localStorage.getItem("cartQuantity")) : 0;
const totalAmount = localStorage.getItem("cartTotal") !== null ? JSON.parse(localStorage.getItem("cartTotal")) : 0;

const setCartListFunc = (items, totalAmount, totalQuantity) => {
    localStorage.setItem("cartList", JSON.stringify(items));
    localStorage.setItem("cartTotal", JSON.stringify(totalAmount));
    localStorage.setItem("cartQuantity", JSON.stringify(totalQuantity));
};

const initialState = {
    status: StatusCode.IDLE,
    databaseProductsData: null,
    error: null,
    items: items,
    totalQuantity: totalQuantity,
    totalAmount: totalAmount
}

const databaseToLocalStorageSlice = createSlice({
    name: 'databaseToLocalStorage',
    initialState,
    // Handle synchronous operations.
    reducers: {
        addProductsToLocalStorage: (state) => {
            // const databaseItems = databaseProductsData;
            // const localStorageItems = state.items;
            // const quantity = state.totalQuantity;

            if(!state.items) {
                localStorage.setItem("cartList", JSON.stringify(state.items));
                localStorage.setItem("cartTotal", JSON.stringify(state.totalAmount));
                localStorage.setItem("cartQuantity", JSON.stringify(state.totalQuantity));
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
            setCartListFunc( state.items.map((item) => item), state.totalAmount, state.totalQuantity );
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(databaseToLocalStorageDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(databaseToLocalStorageDetails.fulfilled, (state, action) => {
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
        .addCase(databaseToLocalStorageDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { addProductsToLocalStorage } = databaseToLocalStorageSlice.actions;
export default databaseToLocalStorageSlice.reducer;

export const databaseToLocalStorageDetails = createAsyncThunk('databaseToLocalStorage/get', async () => {
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