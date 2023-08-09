import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    error: null,
}

const registerSlice = createSlice({
    name: 'register',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(registerDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(registerDetails.fulfilled, (state, action) => {
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Register", action.payload.error);
                state.error = action.payload.error;
            } else {
                console.log(action.payload);
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(registerDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default registerSlice.reducer;

export const registerDetails = createAsyncThunk('register/post', async ({ name, email, password, avatar }) => {
    // const config = { headers: {'content-type': 'multipart/form-data' } };
    // localStorage.clear();
    try {
        // const form = payload.form;
        console.log("Start", { name, email, password, avatar });
        const request = await axios.post('/api/v2/create-user', { name, email, password, avatar });
        console.log("Next line");
        const response = await request.data.data;
        console.log("res", response);
        console.log( "req", request);
        // localStorage.setItem('login', JSON.stringify(response));
        return { "data": response };
    } catch (error) {
        // console.log(error);
        // return { "error" : error.message };
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