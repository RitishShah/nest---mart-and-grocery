import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const singleUserDetail = localStorage.getItem("singleUserDetail") !== null ? JSON.parse(localStorage.getItem("singleUserDetail")) : null;

const setCartFunc = (singleUserDetail) => {
    localStorage.setItem("singleUserDetail", JSON.stringify(singleUserDetail));
}

const initialState = {
    status: StatusCode.IDLE,
    singleUserData: singleUserDetail,
    error: null,
}

const singleUserDetailSlice = createSlice({
    name: 'singleUserDetail',
    initialState,
    // Handle synchronous operations.
    reducers: {
        // resetDeleteOrder: (state) => {
        //     state.deletedOrderData =  null;
        //     state.error = null;
        //     state.isOrderDeleted = false;
        // }
        clearSingleUserDetailError: (state) => {
            state.error = null
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(singleUserDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(singleUserDetails.fulfilled, (state, action) => {
            console.log("Update Order Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.singleUserData = action.payload.data.data;

                setCartFunc(state.singleUserData);
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(singleUserDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { clearSingleUserDetailError } = singleUserDetailSlice.actions;
export default singleUserDetailSlice.reducer;

export const singleUserDetails = createAsyncThunk('singleUserDetail/get', async (id) => {
    try {
        console.log("single User Start", id);
        const request = await axios.get(`/api/v2/admin/user/${id}`);
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