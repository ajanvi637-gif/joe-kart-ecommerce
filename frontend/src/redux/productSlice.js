import { createSlice } from "@reduxjs/toolkit";
import { TbUvIndex } from "react-icons/tb";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        cart: {
            items: []
        },
        addresses: [],
        selectedAddress: null //currently choosen address
    },
    reducers: {

        //  Set Products
        setProducts: (state, action) => {
            state.products = action.payload;
        },

        //  Set Cart
        setCart: (state, action) => {
            state.cart = action.payload;
        },

        //  Increase Quantity
        increaseQty: (state, action) => {
            const item = state.cart.items.find(
                item => item._id === action.payload
            );
            if (item) {
                item.quantity += 1;
            }
        },

        // Decrease Quantity
        decreaseQty: (state, action) => {
            const item = state.cart.items.find(
                item => item._id === action.payload
            );
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },

        //  Remove Item
        removeFromCart: (state, action) => {
            state.cart.items = state.cart.items.filter(
                item => item._id !== action.payload
            );
        },

        //  Add to Cart (extra useful)
        addToCart: (state, action) => {
            const existingItem = state.cart.items.find(
                item => item._id === action.payload._id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.items.push({
                    ...action.payload,
                    quantity: 1
                });
            }
        },

        addAddress: (state, action) => {
            if (!state.addresses) state.addresses = [];
            state.addresses.push(action.payload)
        },

        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload
        },

        deleteAddress: (state, action) => {
            const deletedIndex = action.payload

            state.addresses = state.addresses.filter(
                (_, index) => index !== deletedIndex
            )

            if (state.selectedAddress === deletedIndex) {
                state.selectedAddress = null
            } else if (state.selectedAddress > deletedIndex) {
                state.selectedAddress -= 1
            }
        }

    }
});

//  EXPORT ALL ACTIONS
export const {
    setProducts,
    setCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    addToCart,
    addAddress,
    setSelectedAddress,
    deleteAddress
} = productSlice.actions;

export default productSlice.reducer;