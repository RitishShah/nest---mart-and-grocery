import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    deletedOrderData: null,
    error: null,
    isOrderDeleted: false,
}

const deleteOrderSlice = createSlice({
    name: 'deleteOrder',
    initialState,
    // Handle synchronous operations.
    reducers: {
        resetDeleteOrder: (state) => {
            state.deletedOrderData =  null;
            state.error = null;
            state.isOrderDeleted = false;
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(deleteOrderDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(deleteOrderDetails.fulfilled, (state, action) => {
            console.log("Review Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.deletedOrderData = action.payload.data.data;
                state.isOrderDeleted = true;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(deleteOrderDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { resetDeleteOrder } = deleteOrderSlice.actions;
export default deleteOrderSlice.reducer;

export const deleteOrderDetails = createAsyncThunk('deleteOrder/delete', async (id) => {
    try {
        console.log("delete Order Start", id);
        const request = await axios.delete(`/api/v2/admin/order/${id}`);
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