import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import StatusCode from './StatusCode';

const items = localStorage.getItem("favouriteList") !== null ? JSON.parse(localStorage.getItem("favouriteList")) : [];
const totalQuantity = localStorage.getItem("favouriteQuantity") !== null ? JSON.parse(localStorage.getItem("favouriteQuantity")) : 0;

// adding this function to prevent repear code 
const setCartListFunc = (items, totalQuantity) => {
    localStorage.setItem("favouriteList", JSON.stringify(items));
    localStorage.setItem("favouriteQuantity", JSON.stringify(totalQuantity));
};

const initialState = {
    items: items,
    totalQuantity: totalQuantity,
    status: StatusCode.IDLE,
    databaseProductsData: null,
    error: null,
}

const addItemToFavouriteSlice = createSlice({
    name: 'addItemToFavourite',
    initialState,
    // Handle synchronous operations.
    reducers: {
        addProductInFavourite(state, action) {
            const newItem = action.payload;
            console.log("newItem",newItem._id);

            if(!state.items) {
                localStorage.setItem("favouriteList", JSON.stringify(state.items));
                localStorage.setItem("favouriteQuantity", JSON.stringify(state.totalQuantity));

                setCartListFunc(
                    [],
                    state.totalQuantity
                );

                state.items = [];
            }
        
            const existingItem = state.items.find((item) => item._id === newItem._id);
        
            if (!existingItem) {
                state.totalQuantity++;
                state.items.push(newItem);
            }
            
          // Using function for all initialState
            setCartListFunc(
                state.items.map((item) => item),
                state.totalQuantity
            );
        },

        removeProductInFavourite(state, action) {
            const currItem = action.payload;
            const newItemList = state.items.filter((item) => item._id !== currItem._id);
            console.log(newItemList);
            state.totalQuantity--;
            state.items = newItemList;

            // Using function for all initialState
            setCartListFunc(
                state.items.map((item) => item),
                state.totalQuantity
            );
        },

        resetAddItemToFavourite: (state) => {
            state.items = null;
            state.totalQuantity = 0;
        },

        addFavouriteProductsToLocalStorage: (state) => {

            if(!state.items) {
                localStorage.setItem("favouriteList", JSON.stringify(state.items));
                localStorage.setItem("favouriteQuantity", JSON.stringify(state.totalQuantity));

                setCartListFunc(
                    [],
                    state.totalQuantity
                );

                state.items = [];
            }

            state.databaseProductsData.forEach(element => {
                const isPresent = state.items ? state.items.find((ele) => ele._id === element._id) : null;

                if(!isPresent) {
                    state.items.push(element);
                    state.totalQuantity++;
                }
            });

            setCartListFunc( state.items.map((item) => item), state.totalQuantity);
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(favouriteDatabaseToLocalStorageDetails.pending, (state, action) => {
            state.status = StatusCode.LOADING;
        })
        .addCase(favouriteDatabaseToLocalStorageDetails.fulfilled, (state, action) => {
            console.log("Review Promise", action.payload);
            const keys = Object.keys(action.payload);
            if(keys.includes("error")) {
                console.log("error Report", action.payload);
                state.error = action.payload.error.message;
            } else {
                console.log(action.payload.data);
                state.databaseProductsData = action.payload.data.data;
                console.log("state", state.databaseProductsData);
                // state.isOrderDeleted = true;
            }

            state.status = StatusCode.IDLE;
        })
        .addCase(favouriteDatabaseToLocalStorageDetails.rejected, (state, action) => {
            state.status = StatusCode.ERROR;
        })
    }
});

export const { addProductInFavourite, removeProductInFavourite, resetAddItemToFavourite, addFavouriteProductsToLocalStorage } = addItemToFavouriteSlice.actions; 
export default addItemToFavouriteSlice.reducer;

export const favouriteDatabaseToLocalStorageDetails = createAsyncThunk('favouriteDatabaseToLocalStorage/get', async () => {
    try {
        console.log("database to localStroage Start");
        const request = await axios.get(`/api/v2/favourite/DatabaseToLocalStorage`);
        console.log("req", request);
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