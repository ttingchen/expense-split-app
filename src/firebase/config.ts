import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, addDoc } from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  onAuthStateChanged, 
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Enable persistence and handle auth state
auth.setPersistence(browserLocalPersistence)
  .catch((error) => {
    console.error('Error enabling persistence:', error);
  });

// Track current user
let currentUserId: string | null = null;
onAuthStateChanged(auth, (user) => {
  currentUserId = user?.uid || null;
  console.log('Auth state changed:', user?.uid);
});

// Add Google sign-in function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

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
  try {
    const groupRef = doc(groupsCollection);
    const newGroup = {
      ...groupData,
      id: groupRef.id,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser?.uid,
    };
    await setDoc(groupRef, newGroup);
    return groupRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const getGroup = async (groupId: string) => {
  try {
    const groupRef = doc(groupsCollection, groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) {
      return null;
    }
    return { id: groupSnap.id, ...groupSnap.data() };
  } catch (error) {
    console.error('Error fetching group:', error);
    throw error;
  }
};

export const getGroups = async () => {
  try {
    if (!auth.currentUser) {
      console.log('No authenticated user');
      return [];
    }

    const userId = auth.currentUser.uid;
    console.log('Fetching groups for user:', userId);

    // Query groups where the user is either the creator or a member
    const createdGroupsQuery = query(groupsCollection, where('createdBy', '==', userId));
    const memberGroupsQuery = query(groupsCollection, where('members', 'array-contains', { id: userId }));

    const [createdGroupsSnap, memberGroupsSnap] = await Promise.all([
      getDocs(createdGroupsQuery),
      getDocs(memberGroupsQuery)
    ]);

    // Combine and deduplicate groups
    const groups = new Map();
    
    createdGroupsSnap.forEach((doc) => {
      groups.set(doc.id, { id: doc.id, ...doc.data() });
    });

    memberGroupsSnap.forEach((doc) => {
      if (!groups.has(doc.id)) {
        groups.set(doc.id, { id: doc.id, ...doc.data() });
      }
    });

    console.log('Fetched groups:', Array.from(groups.values()));
    return Array.from(groups.values());
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

// Expense operations
export const getExpenses = async (groupId: string) => {
  const q = query(expensesCollection, where('groupId', '==', groupId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
  const docRef = await addDoc(expensesCollection, expenseData);
  return docRef.id;
};

export const deleteExpense = async (expenseId: string) => {
  await deleteDoc(doc(expensesCollection, expenseId));
};

export const signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;

export { auth, db }; 