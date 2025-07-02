import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import suppliersReducer from './suppliersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    suppliers: suppliersReducer,
  },
});