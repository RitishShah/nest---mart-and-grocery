import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    singleOrderData: null,
    error: null,
}

const singleOrderDetailSlice = createSlice({
    name: 'singleOrderDetail',
    initialState,
    // Handle synchronous operations.
    reducers: {
        // resetDeleteOrder: (state) => {
        //     state.deletedOrderData =  null;
        //     state.error = null;
        //     state.isOrderDeleted = false;
        // }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(singleOrderDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(singleOrderDetails.fulfilled, (state, action) => {
            console.log("Update Order Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.singleOrderData = action.payload.data.data;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(singleOrderDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

// export const { resetDeleteOrder } = deleteOrderSlice.actions;
export default singleOrderDetailSlice.reducer;

export const singleOrderDetails = createAsyncThunk('singleOrderDetail/get', async (id) => {
    try {
        console.log("single Order Start", id);
        const request = await axios.get(`/api/v2/order/${id}`);
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