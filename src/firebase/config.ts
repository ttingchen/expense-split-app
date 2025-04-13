import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collection references
export const groupsCollection = collection(db, 'groups');
export const expensesCollection = collection(db, 'expenses');

interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  splitBetween: string[];
}

// Group operations
export const createGroup = async (groupData: any) => {
  const groupRef = doc(groupsCollection);
  await setDoc(groupRef, { ...groupData, id: groupRef.id });
  return groupRef.id;
};

export const getGroup = async (groupId: string) => {
  const groupRef = doc(groupsCollection, groupId);
  const groupSnap = await getDoc(groupRef);
  return groupSnap.exists() ? groupSnap.data() : null;
};

export const getGroups = async () => {
  const groupsSnap = await getDocs(groupsCollection);
  return groupsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Expense operations
export const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
  const expenseRef = doc(expensesCollection);
  await setDoc(expenseRef, { ...expenseData, id: expenseRef.id });
  return expenseRef.id;
};

export const getExpenses = async (groupId: string) => {
  const expensesSnap = await getDocs(expensesCollection);
  return expensesSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Expense))
    .filter(expense => expense.groupId === groupId);
};

export const deleteExpense = async (expenseId: string) => {
  await deleteDoc(doc(expensesCollection, expenseId));
}; 