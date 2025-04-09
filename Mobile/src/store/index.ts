import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from 'redux-logger';

// Import reducers
import authReducer from './slices/authSlice';

// Create root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers as they are created
});

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // Blacklist state that shouldn't be persisted
  blacklist: ['navigation', 'form'],
  // Whitelist specific reducers if needed instead
  // whitelist: ['auth', 'offline'],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    __DEV__ 
      ? getDefaultMiddleware({
          serializableCheck: {
            // Ignore Redux-Persist actions
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
          },
        }).concat(logger)
      : getDefaultMiddleware({
          serializableCheck: {
            // Ignore Redux-Persist actions
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
          },
        }),
  devTools: __DEV__,
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 