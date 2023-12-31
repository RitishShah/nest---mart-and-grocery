import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const allProductsData = localStorage.getItem("allProductsList") !== null ? JSON.parse(localStorage.getItem("allProductsList")) : [];
const isAllProductsReceived = localStorage.getItem("isAllProductsReceived") !== null ? JSON.parse(localStorage.getItem("isAllProductsReceived")) : false;
const totalProducts = localStorage.getItem("totalProducts") !== null ? JSON.parse(localStorage.getItem("totalProducts")) : 0;

const setCartListFunc = (allProductsData, isAllProductsReceived, totalProducts) => {
    localStorage.setItem("allProductsList", JSON.stringify(allProductsData));
    localStorage.setItem("isAllProductsReceived", JSON.stringify(isAllProductsReceived));
    localStorage.setItem("totalProducts", JSON.stringify(totalProducts));
};

const initialState = {
    data: allProductsData,
    status: StatusCode.IDLE,
    count: totalProducts,
    resultPerPage: 8,
    isAllProductsFetched: isAllProductsReceived,
    error: null
}

const allProductSlice = createSlice({
    name: 'allProducts',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(getAllProducts.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(getAllProducts.fulfilled, (state, action) => {
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                state.error = action.payload.error.message;
            } else {
                state.data = action.payload.data.data.data;
                state.count = state.data.length;
                state.isAllProductsFetched = true;
                console.log(state.data);

                setCartListFunc(
                    state.data.map((item) => item),
                    state.isAllProductsFetched,
                    state.count
                );
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(getAllProducts.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default allProductSlice.reducer;

export const getAllProducts = createAsyncThunk('allProducts/get', async () => {
    try {
        let link = `/api/v2/products`;
        console.log(link);
        const request = await axios.get(link);
        const response = await request.data.data;
        console.log("res", response);
        console.log("req", request);
        return { "data": request };
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