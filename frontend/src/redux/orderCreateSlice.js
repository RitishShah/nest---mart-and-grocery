import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    orderData: null,
    error: null
}

const orderCreateSlice = createSlice({
    name: 'orderCreateInfo',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(orderCreateDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(orderCreateDetails.fulfilled, (state, action) => {
            console.log("Order Promise", action.payload);
            console.log(action.payload.data);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log("orderCreate", action.payload.data);
                state.orderData = action.payload.data;
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(orderCreateDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default orderCreateSlice.reducer;

export const orderCreateDetails = createAsyncThunk('orderCreate/post', async (order) => {
    try {
        const config = { headers: {"Content-Type": "application/json"} };
        console.log("Start", order);
        const request = await axios.post('/api/v2/order/new', order, config);
        console.log("order reqqqqqqqqq", request);
        // console.log("SAdasdasfda");
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