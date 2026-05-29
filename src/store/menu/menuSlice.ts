// src/store/menu/menuSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuData: [],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuData: (state, action) => {
      state.menuData = action.payload;
    },
  },
});

export const { setMenuData } = menuSlice.actions;

export default menuSlice.reducer;
