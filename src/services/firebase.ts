import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB_971f07eMBgxS4sEK0zFnLpwaZ53j4rI",
    authDomain: "expense-split-app-fda01.firebaseapp.com",
    projectId: "expense-split-app-fda01",
    storageBucket: "expense-split-app-fda01.firebasestorage.app",
    messagingSenderId: "833168660957",
    appId: "1:833168660957:web:d6835222a3fc1b302d7e34",
    measurementId: "G-1G79QPQXLV"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
