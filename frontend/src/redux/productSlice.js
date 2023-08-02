import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    data: [],
    status: StatusCode.IDLE,
    totalProducts: 0,
    resultPerPage: 8
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(getProducts.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(getProducts.fulfilled, (state, action) => {
            state.data = action.payload.data.data.data.products;
            state.status = StatusCode.IDLE;
            state.totalProducts = action.payload.data.data.data.totalProducts;
            console.log(state.data);
        })
        .addCase(getProducts.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

// export const { fetchProducts } = productSlice.actions;
export default productSlice.reducer;

export const getProducts = createAsyncThunk('products/get', async ({keyword,currentPage,category}) => {
    // const link = '/api/v2/products';
    // console.log("adldkf");
    // let link = `/api/v2/product?keyword=${keyword}&page=${currentPage}`;
    // if(category) {
    //     link = `/api/v2/product?keyword=${keyword}&page=${currentPage}&category=${category}`;
    // }
    // const data = await axios.get(link);
    // console.log(data);
    // return data;

    try {
        console.log("Start", keyword, currentPage, category);
        if(!keyword) keyword = "";

        // let link = `/api/v2/product`;
        let link = `/api/v2/product?keyword=${keyword}&page=${currentPage}`;

        // if(keyword) {
        //     link = `/api/v2/product?keyword=${keyword}`;
        // }
        
        // if(currentPage) {
        //     console.log()
        //     link = `/api/v2/product?keyword=${keyword}&page=${currentPage}`;
        // }
        
        if(category) {
            link = `/api/v2/product?keyword=${keyword}&page=${currentPage}&category=${category}`;
        }
        console.log(link);
        const request = await axios.get(link);
        const response = await request.data.data;
        console.log("res", response);
        console.log("req", request);
        // localStorage.setItem('login', JSON.stringify(response));
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