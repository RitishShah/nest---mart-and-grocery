import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const initialState = {
    status: StatusCode.IDLE,
    error: null
}

const updateUserRoleSlice = createSlice({
    name: 'updateUserRole',
    initialState,
    // Handle synchronous operations.
    reducers: {

    },

    // Handle asynchronous operations.
    extraReducers: (builder) => {
        builder
        .addCase(updateUserRoleDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(updateUserRoleDetails.fulfilled, (state, action) => {
            console.log(action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log(action.payload.error);
                state.error = action.payload.error;
            } else {
                console.log(action.payload);
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(updateUserRoleDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

// export const { resetUpdatedRole } = updateUserRoleSlice.actions;
export default updateUserRoleSlice.reducer;

export const updateUserRoleDetails = createAsyncThunk('userRoleUpdated/put', async({ role, email, name, id }) => {
    const config = { headers: { "Content-Type" : "application/json" } };
    try {
        console.log("Start", { role, email, name });
        const request = await axios.put(`/api/v2/admin/user/${id}`, { role, email, name }, config);
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