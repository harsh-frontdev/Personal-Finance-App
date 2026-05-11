import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { 
  getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARTGpPAhAhmRhNQ1vJc9Gt3HlW90g7fBk",
  authDomain: "the-sovereign-ledger-4d4e3.firebaseapp.com",
  databaseURL: "https://the-sovereign-ledger-4d4e3-default-rtdb.firebaseio.com",
  projectId: "the-sovereign-ledger-4d4e3",
  storageBucket: "the-sovereign-ledger-4d4e3.firebasestorage.app",
  messagingSenderId: "375348668049",
  appId: "1:375348668049:web:89b2656fc24d00908e0130",
  measurementId: "G-KSN2FFW3YH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const transactionsCollection = collection(db, "transactions");

export const getData = async () => {
  getDocs()
    // 1. Fetch documents from Firestore using getDocs(transactionsCollection)
    // 2. Format them to match the expected structure
    // 3. Return { success: true, data: [...] }
};

export const saveData = async (formData) => {
    // 1. Use addDoc(transactionsCollection, formData)
    // 2. Return success
};

export const updateData = async (id, formData) => {
    // 1. Use updateDoc(doc(db, "transactions", id), formData)
    // 2. Return success
};

export const deleteData = async (id) => {
    // 1. Use deleteDoc(doc(db, "transactions", id))
    // 2. Return success
};










// export const getData = async () => {
//   try {
//     const response = await fetch("http://127.0.0.1:5001/api/transactions");
//     if (!response.ok) {
//       throw new Error(`Response Status: ${response.status}`);
//     }
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error(error.message);
//   }
// };

// export const saveData = async (formData) => {
//   const response = await fetch("http://127.0.0.1:5001/api/transactions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   });

//   const result = await response.json();
//   return result;
// };

// export const deleteData = async (id) => {
//   const response = await fetch(`http://127.0.0.1:5001/api/transactions/${id}`, {
//     method: "DELETE",
//   });

//   const result = await response.json();
//   return result;
// };

// export const updateData = async (id, formData) => {
//   const response = await fetch(`http://127.0.0.1:5001/api/transactions/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   });

//   const result = await response.json();
//   return result;
// };