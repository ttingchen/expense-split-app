import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getExpenses, addExpense as addExpenseToFirebase, deleteExpense as deleteExpenseFromFirebase } from '../../firebase/config';
import { RootState } from '../store';

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string; // member ID
  date: string;
  splitBetween: string[]; // member IDs
}

interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk<Expense[], string>(
  'expenses/fetchExpenses',
  async (groupId: string) => {
    const expenses = await getExpenses(groupId);
    return expenses as Expense[];
  }
);

export const addExpense = createAsyncThunk<Expense, Omit<Expense, 'id'>>(
  'expenses/addExpense',
  async (expenseData) => {
    const expenseId = await addExpenseToFirebase(expenseData);
    return { id: expenseId, ...expenseData };
  }
);

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (expenseId: string) => {
    await deleteExpenseFromFirebase(expenseId);
    return expenseId;
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer; 