import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    data: [],
    status: StatusCode.IDLE,
    isAuthenticated: true,
    error: null
}

const logoutSlice = createSlice({
    name: 'logout',
    initialState,
    // Handle synchronous operations.
    reducers: {
        
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(getLogoutDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(getLogoutDetails.fulfilled, (state, action) => {
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log(action.payload.error);
                state.error = action.payload.error;
            } else {
                state.isAuthenticated = true;
                state.data = action.payload;
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(getLogoutDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default logoutSlice.reducer;

export const getLogoutDetails = createAsyncThunk('logout/get', async({email,password}) => {
    const config = { headers: { "Content-Type" : "application/json" } };
    try {
        console.log("Start", email, password);
        const request = await axios.post('/api/v2/logout', { email, password}, config);
        const response = await request.data.data;
        console.log(response);
        console.log(request);
        // localStorage.setItem('login', JSON.stringify(response));
        return { "data": response };
    } catch (error) {
        console.log(error);
        return { "error" : error.message };
    }
});