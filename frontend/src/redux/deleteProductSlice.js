import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    error: null,
}

const deleteProductSlice = createSlice({
    name: 'deleteProduct',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(deleteProductDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(deleteProductDetails.fulfilled, (state, action) => {
            console.log("Review Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(deleteProductDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

// export const { resetDeleteProduct } = deleteProductSlice.actions;
export default deleteProductSlice.reducer;

export const deleteProductDetails = createAsyncThunk('deleteProduct/delete', async (id) => {
    try {
        console.log("delete Product Start", id);
        const request = await axios.delete(`/api/v2/product/${id}`);
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