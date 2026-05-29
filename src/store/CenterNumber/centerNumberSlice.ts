import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  centerNumber: '',
};

// interface StateType {
//   centerNumber: string;
// }

const centerSlice = createSlice({
  name: 'center',
  initialState,
  reducers: {
    setCenterNumber: (state, action) => {
      state.centerNumber = action.payload;
    },
  },
});

export const { setCenterNumber } = centerSlice.actions;
export default centerSlice.reducer;
