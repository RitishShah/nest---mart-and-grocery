import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    error: null,
}

const updateProductSlice = createSlice({
    name: 'updateProduct',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(updateProductDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(updateProductDetails.fulfilled, (state, action) => {
            console.log("update product Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data.data);
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(updateProductDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

// export const {  } = updateProductSlice.actions;
export default updateProductSlice.reducer;

export const updateProductDetails = createAsyncThunk('updateProduct/put', async ({id, data}) => {
    console.log(id, data);
    try {
        const config = { headers: { "Content-Type" : "application/json" } };
        console.log("update Product Starting", id, data);
        const request = await axios.put(`/api/v2/product/${id}`, data, config);
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