import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const allUsersData = localStorage.getItem("allUsersList") !== null ? JSON.parse(localStorage.getItem("allUsersList")) : [];
const isAllUsersReceived = localStorage.getItem("isAllUsersReceived") !== null ? JSON.parse(localStorage.getItem("isAllUsersReceived")) : false;
const totalUsers = localStorage.getItem("totalUsers") !== null ? JSON.parse(localStorage.getItem("totalUsers")) : null;

const setCartListFunc = (allUsersData, isAllUsersReceived, totalUsers) => {
    localStorage.setItem("allUsersList", JSON.stringify(allUsersData));
    localStorage.setItem("isAllUsersReceived", JSON.stringify(isAllUsersReceived));
    localStorage.setItem("totalUsers", JSON.stringify(totalUsers));
};

const initialState = {
    allUsersData: allUsersData,
    status: StatusCode.IDLE,
    count: totalUsers,
    isAllUsersReceived: isAllUsersReceived,
    error: null
}

const allUserSlice = createSlice({
    name: 'allUsers',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(getAllUsers.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            console.log("Allusers Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.isAllUsersReceived = true;
                state.allUsersData = action.payload.data.data.data;
                state.status = StatusCode.IDLE;
                state.count = state.allUsersData.length;

                setCartListFunc(
                    state.allUsersData.map((item) => item),
                    state.isAllUsersReceived,
                    state.count
                );
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(getAllUsers.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export default allUserSlice.reducer;

export const getAllUsers = createAsyncThunk('allUsers/get', async () => {
    try {
        let link = `/api/v2/admin/users`;
        console.log(link);
        const request = await axios.get(link);
        const response = await request.data.data;
        console.log("res", response);
        console.log("all users req", request);
        return { "data": request };
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