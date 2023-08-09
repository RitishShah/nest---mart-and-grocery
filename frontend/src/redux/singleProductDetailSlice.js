import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const singleProductDetail = localStorage.getItem("singleProductDetail") !== null ? JSON.parse(localStorage.getItem("singleProductDetail")) : null;
const currProductIdEdit = localStorage.getItem("currProductIdEdit") !== null ? JSON.parse(localStorage.getItem("currProductIdEdit")) : null;

const setCartListFunc = (singleProductData, currProductId) => {
    localStorage.setItem("singleProductDetail", JSON.stringify(singleProductData));
    localStorage.setItem("currProductIdEdit", JSON.stringify(currProductId));
};

const initialState = {
    data: singleProductDetail,
    status: StatusCode.IDLE,
    error: null,
    currProductId: currProductIdEdit,
}

const singleProductDetailSlice = createSlice({
    name: 'singleProductDetail',
    initialState,
    // Handle synchronous operations.
    reducers: {
        clearSingleProductDetailError: (state) => {
            state.error = null;
        },
        resetSingleProductDetails: (state) => {
            state.data = null;
            state.status = StatusCode.IDLE;
            state.error = null;
            state.currProductId = null;
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(getSingleProductDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(getSingleProductDetails.fulfilled, (state, action) => {
            console.log("Update Order Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("Single product get error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.data = action.payload.data.data.product;
                state.isProductFetched = true;
                state.currProductId = action.payload.data.data.productId;

                setCartListFunc(state.data, state.currProductId);
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(getSingleProductDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { clearSingleProductDetailError, resetSingleProductDetails } = singleProductDetailSlice.actions;
export default singleProductDetailSlice.reducer;

export const getSingleProductDetails = createAsyncThunk('singleProduct/get', async (id) => {
    try {
        console.log("single product Start", id);
        const request = await axios.get(`/api/v2/product/${id}`);
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