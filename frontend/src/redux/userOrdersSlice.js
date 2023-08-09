import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const currUserOrders = localStorage.getItem("currUserOrders") !== null ? JSON.parse(localStorage.getItem("currUserOrders")) : null; 
const isCurrUserOrdersReceived = localStorage.getItem("isCurrUserOrdersReceived") !== null ? JSON.parse(localStorage.getItem("isCurrUserOrdersReceived")) : false; 

const setFunc = (currUserOrders, isCurrUserOrdersReceived) => {
    localStorage.setItem("currUserOrders", JSON.stringify(currUserOrders));
    localStorage.setItem("isCurrUserOrdersReceived", JSON.stringify(isCurrUserOrdersReceived));
}

const initialState = {
    userOrdersData: currUserOrders,
    isUserOrdersFetched: isCurrUserOrdersReceived,
    status: StatusCode.IDLE,
    error: null
}

const userOrdersSlice = createSlice({
    name: 'userOrders',
    initialState,
    // Handle synchronous operations.
    reducers: {
        clearErrorsUserOrders: (state) => {
            state.error = null;
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(userOrdersDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(userOrdersDetails.fulfilled, (state, action) => {
            console.log(action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log(action.payload.error);
                state.error = action.payload.error;
            } else {
                state.isUserOrdersFetched = true;
                state.userOrdersData = action.payload.data;

                setFunc(state.userOrdersData, state.isUserOrdersFetched);
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(userOrdersDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { clearErrorsUserOrders } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;

export const userOrdersDetails = createAsyncThunk('userOrders/get', async() => {
    try {
        console.log("Start User Orders");
        const request = await axios.get(`/api/v2/orders/me`);
        const response = await request.data.data;
        console.log(response);
        console.log(request);
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