import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    error: null
}

const updatePasswordSlice = createSlice({
    name: 'updatePassword',
    initialState,
    // Handle synchronous operations.
    reducers: {
        
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(updatePasswordDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(updatePasswordDetails.fulfilled, (state, action) => {
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log(action.payload.error);
                state.error = action.payload.error;
            } else {
                console.log(action.payload);
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(updatePasswordDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default updatePasswordSlice.reducer;

export const updatePasswordDetails = createAsyncThunk('updatePassword/put', async({oldPassword, newPassword, confirmPassword}) => {
    const config = { headers: { "Content-Type" : "application/json" } };
    try {
        console.log("Start", oldPassword, newPassword, confirmPassword);
        const request = await axios.put('/api/v2/me/password/update', { oldPassword, newPassword, confirmPassword }, config);
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