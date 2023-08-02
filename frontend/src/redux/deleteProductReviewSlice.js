import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    deletedProductReviewData: null,
    error: null,
    isProductReviewDeleted: false,
}

const deleteProductReviewSlice = createSlice({
    name: 'deleteProductReview',
    initialState,
    // Handle synchronous operations.
    reducers: {
        resetDeleteProductReview: (state) => {
            state.deletedProductReviewData =  null;
            state.error = null;
            state.isProductReviewDeleted = false;
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(deleteProductReviewDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(deleteProductReviewDetails.fulfilled, (state, action) => {
            console.log("Review Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.deletedProductReviewData = action.payload.data.data;
                state.isProductReviewDeleted = true;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(deleteProductReviewDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { resetDeleteProductReview } = deleteProductReviewSlice.actions;
export default deleteProductReviewSlice.reducer;

export const deleteProductReviewDetails = createAsyncThunk('deleteProductReview/delete', async ({ productId, reviewId }) => {
    try {
        console.log("delete Product review Start", { productId, reviewId });
        const request = await axios.delete(`/api/v2/product-review?productId=${productId}&reviewId=${reviewId}`);
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