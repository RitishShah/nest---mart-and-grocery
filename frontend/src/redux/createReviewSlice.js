import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    reviewData: null,
    error: null
}

const createReviewSlice = createSlice({
    name: 'createReview',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(createReviewDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(createReviewDetails.fulfilled, (state, action) => {
            console.log("Review Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.reviewData = action.payload.data.data;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(createReviewDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default createReviewSlice.reducer;

export const createReviewDetails = createAsyncThunk('createReview/post', async ({ rating, comment, productId }) => {
    try {
        console.log("Start", { rating, comment, productId });
        const request = await axios.post('/api/v2/product/review', { rating, comment, productId });
        console.log("req", request);
        console.log("Product Review");
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