import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    error: null
}

const reportSlice = createSlice({
    name: 'report',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(reportDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(reportDetails.fulfilled, (state, action) => {
            console.log("Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(reportDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default reportSlice.reducer;

export const reportDetails = createAsyncThunk('report/post', async ({ name, subject, email, message }) => {
    try {
        console.log("Start", { name, subject, email, message });
        const request = await axios.post('/api/v2/report', { name, subject, email, message });
        console.log("req", request);
        console.log("SAdasdasfda");
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