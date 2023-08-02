import { createSlice } from '@reduxjs/toolkit';
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
    status: StatusCode.IDLE
}

const addItemToFavouriteSlice = createSlice({
    name: 'addItemToFavourite',
    initialState,
    // Handle synchronous operations.
    reducers: {
        addProductInFavourite(state, action) {
            const newItem = action.payload;
            console.log("newItem",newItem._id);
        
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
        }
    },
});

export const { addProductInFavourite, removeProductInFavourite } = addItemToFavouriteSlice.actions; 
export default addItemToFavouriteSlice.reducer;