import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    shipData: null,
    error: null
}

const shippingInfoSlice = createSlice({
    name: 'shippingInfo',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(shippingInfoDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(shippingInfoDetails.fulfilled, (state, action) => {
            console.log("Shipping Promise", action.payload);
            console.log(action.payload.data);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log("shippingInfo", action.payload.data);
                state.shipData = action.payload.data;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(shippingInfoDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default shippingInfoSlice.reducer;

export const shippingInfoDetails = createAsyncThunk('shipping/post', async ({ address, state, country, phoneNo }) => {
    try {
        console.log("Start", { address, state, country, phoneNo });
        // const request = await axios.post('/api/v2/report', { name, subject, email, message });
        // console.log("req", request);
        // console.log("SAdasdasfda");
        // return { "data": request.data };
        return { "data": { address, state, country, phone: phoneNo } };  
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