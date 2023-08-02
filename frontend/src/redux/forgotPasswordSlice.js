import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    forgotPasswordData: null,
    status: StatusCode.IDLE,
    error: null
}

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(forgotPasswordDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(forgotPasswordDetails.fulfilled, (state, action) => {
            // console.log("forgot PAssword Payload", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log(action.payload.error);
                state.error = action.payload.error;
            } else {
                state.forgotPasswordData = action.payload;
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(forgotPasswordDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

// export const { login, updateData } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;

export const forgotPasswordDetails = createAsyncThunk('forgotPassword/post', async({ email }) => {
    const config = { headers: { "Content-Type" : "application/json" } };
    // localStorage.clear();
    try {
        console.log("Start", email);
        const request = await axios.post('/api/v2/password/forget', { email }, config);
        const response = await request.data.data;
        console.log(response);
        console.log(request);
        return { "data": response };
    } catch (error) {
        console.log(error);
        return { "error" : error.message };
    }
});