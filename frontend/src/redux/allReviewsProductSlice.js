import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    productReviewsData: null,
    status: StatusCode.IDLE,
    error: null,
    isProductAllReviewsFetched: false,
    currProductId: null,
}

const allReviewsProductSlice = createSlice({
    name: 'allReviewsProduct',
    initialState,
    // Handle synchronous operations.
    reducers: {
        clearErrorsAllReviewsProduct: (state) => {
            state.error = null;
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(allReviewsProductDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(allReviewsProductDetails.fulfilled, (state, action) => {
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log(action.payload.error);
                state.error = action.payload.error.message;
            } else {
                state.productReviewsData = action.payload.data.productReviews;
                state.currProductId = action.payload.data.productId;
                state.isProductAllReviewsFetched = true;
                console.log("Fetch All Reviews of a Product associated with id", action.payload.data);
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(allReviewsProductDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { clearErrorsAllReviewsProduct } = allReviewsProductSlice.actions;
export default allReviewsProductSlice.reducer;

export const allReviewsProductDetails = createAsyncThunk('allReviewsProduct/get', async(productId) => {
    try {
        console.log("Start Product Id for Reviews", productId);
        const request = await axios.get(`/api/v2/product-reviews?id=${productId}`);
        const response = await request.data.data;
        console.log(response);
        console.log(request);
        return { "data": response };
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