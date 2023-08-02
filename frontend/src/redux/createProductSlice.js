import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    createProductData: [],
    status: StatusCode.IDLE
}

const createProductSlice = createSlice({
    name: 'CreateProduct',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(createProductDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(createProductDetails.fulfilled, (state, action) => {
            console.log("CreatProduct Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.createProductData = action.payload.data;
                state.success = true;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(createProductDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default createProductSlice.reducer;

export const createProductDetails = createAsyncThunk('createProduct/post', async (data) => {
    try {
        console.log("Create Product", data);
        const config = { headers: { "Content-Type" : "application/json" } };
        let link = `/api/v2/product/new`;
        console.log(link);
        const request = await axios.post(link, data, config);
        const response = await request.data.data;
        console.log("res", response);
        console.log("all users req", request);
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