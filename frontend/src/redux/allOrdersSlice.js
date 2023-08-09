import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const allOrdersData = localStorage.getItem("allOrdersList") !== null ? JSON.parse(localStorage.getItem("allOrdersList")) : [];
const isAllOrdersReceived = localStorage.getItem("isAllOrdersReceived") !== null ? JSON.parse(localStorage.getItem("isAllOrdersReceived")) : false;
const totalOrders = localStorage.getItem("totalOrders") !== null ? JSON.parse(localStorage.getItem("totalOrders")) : 0;

const setCartListFunc = (allOrdersData, isAllOrdersReceived, totalOrders) => {
    localStorage.setItem("allOrdersList", JSON.stringify(allOrdersData));
    localStorage.setItem("isAllOrdersReceived", JSON.stringify(isAllOrdersReceived));
    localStorage.setItem("totalOrders", JSON.stringify(totalOrders));
};

const initialState = {
    allOrdersData: allOrdersData,
    isAllOrdersReceived: isAllOrdersReceived,
    status: StatusCode.IDLE,
    count: totalOrders,
}

const allOrderSlice = createSlice({
    name: 'allOrders',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(getAllOrders.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(getAllOrders.fulfilled, (state, action) => {
            state.allOrdersData = action.payload.data.data.data[1];
            state.status = StatusCode.IDLE;
            state.count = state.allOrdersData.length;
            state.isAllOrdersReceived = true;
            console.log(state.allOrdersData);

            setCartListFunc(
                state.allOrdersData.map((item) => item),
                state.isAllOrdersReceived,
                state.count
            );
        })
        .addCase(getAllOrders.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default allOrderSlice.reducer;

export const getAllOrders = createAsyncThunk('allOrders/get', async () => {
    try {
        let link = `/api/v2/admin/orders`;
        console.log(link);
        const request = await axios.get(link);
        const response = await request.data.data;
        console.log("res", response);
        console.log("all orders req", request);
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