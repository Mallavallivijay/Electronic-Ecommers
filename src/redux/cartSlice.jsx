import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Stores cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart (or increase quantity if already exists)
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity = 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Remove item from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    // Update item quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    // Clear total cart items
    clearCart: (state) => {
      state.items = [];
    },
    // Set the entire cart items array (for syncing with backend)
    setCartItems: (state, action) => {
      state.items = action.payload;
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  setCartItems  // Make sure this is exported
} = cartSlice.actions;

export default cartSlice.reducer;