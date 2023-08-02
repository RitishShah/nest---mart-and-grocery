import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    updatedOrderData: null,
    error: null,
    isOrderUpdated: false,
}

const updateOrderSlice = createSlice({
    name: 'updateOrder',
    initialState,
    // Handle synchronous operations.
    reducers: {
        resetUpdateOrder: (state) => {
            state.updatedOrderData =  null;
            state.error = null;
            state.isOrderUpdated = false;
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(updateOrderDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(updateOrderDetails.fulfilled, (state, action) => {
            console.log("Update Order Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.updatedOrderData = action.payload.data.data;
                state.isOrderUpdated = true;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(updateOrderDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { resetUpdateOrder } = updateOrderSlice.actions;
export default updateOrderSlice.reducer;

export const updateOrderDetails = createAsyncThunk('updateOrder/put', async ({id, data}) => {
    try {
        const config = { headers: { "Content-Type" : "application/json" } };
        console.log("update Order Start", id);
        const request = await axios.put(`/api/v2/admin/order/${id}`, data, config);
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