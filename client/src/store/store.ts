import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./features/authSlice";

// Persist configuration for authSlice
const authPersistConfig = {
  key: "auth",
  storage,
};

// Root reducer with combined slices
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
});

// Configure store with types for reducer and middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Type for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
