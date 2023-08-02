import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    data: [],
    isAuthenticated: false,
    status: StatusCode.IDLE
}

const userDetailsMyselfSlice = createSlice({
    name: 'userDetailsMyself',
    initialState,
    // Handle synchronous operations.
    reducers: {
        
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(getUserMyselfDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(getUserMyselfDetails.fulfilled, (state, action) => {
            state.data = action.payload.data.data;
            state.isAuthenticated = true;
            state.status = StatusCode.IDLE;
        })
        .addCase(getUserMyselfDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default userDetailsMyselfSlice.reducer;

export const getUserMyselfDetails = createAsyncThunk('userDetailsMyself/get', async () => {
    try {
        const link = `/api/v2/me`;
        const data = await axios.get(link);
        console.log(data);
        return data;
    } catch (error) {
        return error.response.data;
    }
});