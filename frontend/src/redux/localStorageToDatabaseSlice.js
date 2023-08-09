import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const items = localStorage.getItem("cartList") !== null ? JSON.parse(localStorage.getItem("cartList")) : [];
const totalQuantity = localStorage.getItem("cartQuantity") !== null ? JSON.parse(localStorage.getItem("cartQuantity")) : 0;
const totalAmount = localStorage.getItem("cartTotal") !== null ? JSON.parse(localStorage.getItem("cartTotal")) : 0;

// const setCartListFunc = (items, totalAmount, totalQuantity) => {
//     localStorage.setItem("cartList", JSON.stringify(items));
//     localStorage.setItem("cartTotal", JSON.stringify(totalAmount));
//     localStorage.setItem("cartQuantity", JSON.stringify(totalQuantity));
// };

const initialState = {
    status: StatusCode.IDLE,
    cartDatabaseData: null,
    error: null,
    items: items,
    totalQuantity: totalQuantity,
    totalAmount: totalAmount
}

const localStorageToDatabaseSlice = createSlice({
    name: 'localStorageToDatabase',
    initialState,
    // Handle synchronous operations.
    reducers: {
        emptyLocalStorageCartItems: (state) => {
            localStorage.removeItem('cartList');
            localStorage.removeItem('cartTotal');
            localStorage.removeItem('cartQuantity');
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(cartItemslocalStorageToDatabaseDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(cartItemslocalStorageToDatabaseDetails.fulfilled, (state, action) => {
            console.log("Review Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.cartDatabaseData = action.payload.data.data;
                console.log("state", state.databaseProductsData);
                // state.isOrderDeleted = true;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(cartItemslocalStorageToDatabaseDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { emptyLocalStorageCartItems } = localStorageToDatabaseSlice.actions;
export default localStorageToDatabaseSlice.reducer;

export const cartItemslocalStorageToDatabaseDetails = createAsyncThunk('cartItemslocalStorageToDatabase/post', async (data) => {
    try {
        const config = { headers: { "Content-Type" : "application/json" } };
        console.log("localStroage to database Start", data);
        const request = await axios.post(`/api/v2/cart/LocalStorageToDatabase`, data, config);
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
