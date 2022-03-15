import { configureStore } from '@reduxjs/toolkit';
import stegoReducer from '../features/stegoSlice';

export const store = configureStore({
  reducer: {
    stego: stegoReducer,
  },
});
