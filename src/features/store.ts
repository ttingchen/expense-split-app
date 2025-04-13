import { configureStore } from '@reduxjs/toolkit';
import groupsReducer from './groups/groupsSlice';
import expensesReducer from './expenses/expensesSlice';

export const store = configureStore({
  reducer: {
    groups: groupsReducer,
    expenses: expensesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 