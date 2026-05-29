import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Room {
  id: string;
  roomNo: string;
  row: number;
  col: number;
  centerNo: string | null;
  addBy: string | null;
  isActive: string;
}

const roomsSlice = createSlice({
  name: "rooms",
  initialState: [] as Room[],   // 👈 just the array
  reducers: {
    setRooms: (_, action: PayloadAction<Room[]>) => action.payload, // replace whole array
  },
});

export const { setRooms } = roomsSlice.actions;
export default roomsSlice.reducer;
