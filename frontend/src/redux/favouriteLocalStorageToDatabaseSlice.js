import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const items = localStorage.getItem("favouriteList") !== null ? JSON.parse(localStorage.getItem("favouriteList")) : [];
const totalQuantity = localStorage.getItem("favouriteQuantity") !== null ? JSON.parse(localStorage.getItem("favouriteQuantity")) : 0;

const initialState = {
    status: StatusCode.IDLE,
    favouriteDatabaseData: null,
    error: null,
    items: items,
    totalQuantity: totalQuantity,
}

const favouriteLocalStorageToDatabaseSlice = createSlice({
    name: 'favouriteLocalStorageToDatabaseSlice',
    initialState,
    reducers: {
        emptyLocalStorageFavouriteItems: (state) => {
            localStorage.removeItem('favouriteList');
            localStorage.removeItem('favouriteQuantity');
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(favouriteItemslocalStorageToDatabaseDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(favouriteItemslocalStorageToDatabaseDetails.fulfilled, (state, action) => {
            console.log("Review Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.favouriteDatabaseData = action.payload.data.data;
                console.log("state", state.databaseProductsData);
                // state.isOrderDeleted = true;
            }
            state.status = StatusCode.IDLE;
        })
        .addCase(favouriteItemslocalStorageToDatabaseDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { emptyLocalStorageFavouriteItems } = favouriteLocalStorageToDatabaseSlice.actions;
export default favouriteLocalStorageToDatabaseSlice.reducer;

export const favouriteItemslocalStorageToDatabaseDetails = createAsyncThunk('favouriteItemslocalStorageToDatabase/post', async (data2) => {
    try {
        const config = { headers: { "Content-Type" : "application/json" } };
        console.log("localStroage to database Start", data2);
        const request = await axios.post(`/api/v2/favourite/LocalStorageToDatabase`, data2, config);
        console.log("req favourite Items products", request);
        console.log("Order Review");
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


