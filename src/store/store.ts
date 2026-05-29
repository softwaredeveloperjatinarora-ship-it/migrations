// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducers
import CustomizerReducer from "./customizer/CustomizerSlice";
import MenuReducer from "./menu/menuSlice";
import ProfileReducer from "./profile/profileSlice";
import ContactsReducer from "./contacts/ContactSlice";
import centerReducer from "./CenterNumber/centerNumberSlice";
import EmpIdReducer from "./profile/EmployeeIdSlice";
import roomsReducer from "./roomMaster/roomsSlice";

// Redux Persist configuration
const persistConfig = {
  key: "root",
  storage
};

// Combine all reducers
const rootReducer = combineReducers({
  customizer: CustomizerReducer,
  menu: MenuReducer,
  profile: ProfileReducer,
  contactsReducer: ContactsReducer,
  center: centerReducer,
  user: EmpIdReducer,
  rooms: roomsReducer
});

// Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


const menuReducer = combineReducers({
  menu: MenuReducer
});
const profileReducer = combineReducers({
  profile:ProfileReducer
});

// Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
export type ProfileState = ReturnType<typeof profileReducer>;
export type menuState = ReturnType<typeof menuReducer>;