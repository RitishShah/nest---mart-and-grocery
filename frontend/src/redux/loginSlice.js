import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    data: [],
    status: StatusCode.IDLE,
    isAuthenticated: false,
    error: null
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    // Handle synchronous operations.
    reducers: {
        login: (state) => {
            state.data = [];
            state.isAuthenticated = false;
            state.error = null;
        },

        updateData: (state, action) => {
            console.log("last Step", action.payload.data);
            state.data = {"data" : action.payload};
        }
    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(getLoginDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(getLoginDetails.fulfilled, (state, action) => {
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
        .addCase(getLoginDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { login, updateData } = loginSlice.actions;
export default loginSlice.reducer;

export const getLoginDetails = createAsyncThunk('login/post', async({email,password}) => {
    const config = { headers: { "Content-Type" : "application/json" } };
    // localStorage.clear();
    try {
        console.log("Start", email, password);
        const request = await axios.post('/api/v2/login', { email, password}, config);
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