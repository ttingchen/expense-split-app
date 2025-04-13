import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Expense } from '../features/expenses/expensesSlice';

const expensesCollection = collection(db, 'expenses');

export const createExpense = async (expense: Omit<Expense, 'id'>) => {
  const newExpense = {
    ...expense,
    date: new Date().toISOString(),
  };
  const docRef = await addDoc(expensesCollection, newExpense);
  return { ...newExpense, id: docRef.id };
};

export const updateExpense = async (expenseId: string, updates: Partial<Expense>) => {
  const expenseRef = doc(db, 'expenses', expenseId);
  await updateDoc(expenseRef, updates);
};

export const deleteExpense = async (expenseId: string) => {
  const expenseRef = doc(db, 'expenses', expenseId);
  await deleteDoc(expenseRef);
};

export const getExpenses = async (groupId: string) => {
  const q = query(expensesCollection, where('groupId', '==', groupId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Expense[];
};

export const subscribeToExpenses = (groupId: string, callback: (expenses: Expense[]) => void) => {
  const q = query(expensesCollection, where('groupId', '==', groupId));
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Expense[];
    callback(expenses);
  });
}; 