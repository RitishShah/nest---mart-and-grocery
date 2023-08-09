import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    error: null
}

const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(resetPasswordDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(resetPasswordDetails.fulfilled, (state, action) => {
            // console.log("forgot PAssword Payload", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log(action.payload.error);
                state.error = action.payload.error;
            } else {
                console.log(action.payload);
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(resetPasswordDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

// export const { login, updateData } = forgotPasswordSlice.actions;
export default resetPasswordSlice.reducer;

export const resetPasswordDetails = createAsyncThunk('resetPassword/put', async({ token, password, confirmPassword }) => {
    const config = { headers: { "Content-Type" : "application/json" } };
    // localStorage.clear();
    try {
        console.log("Start", { token, password, confirmPassword });
        const request = await axios.put(`/api/v2/password/reset/${token}`, { password, confirmPassword }, config);
        const response = await request.data.data;
        console.log(response);
        console.log(request);
        return { "data": response };
    } catch (error) {
        console.log(error);
        return { "error" : error.message };
    }
});