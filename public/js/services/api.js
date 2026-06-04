import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { 
  getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
export const auth = getAuth(app);
const transactionsCollection = collection(db, "transactions");

export const getData = async () => {
  const user = auth.currentUser;
  const demoUser = JSON.parse(localStorage.getItem("sovereign_demo_user"));
  const userId = user ? user.uid : (demoUser ? "demo-user" : null);

  if (!userId) {
    return { success: true, data: [] };
  }

  // Local Storage Mode Fallback for Demo User or Offline Testing
  if (userId === "demo-user") {
    let localData = localStorage.getItem("sovereign_local_transactions");
    let parsed = [];
    try {
      if (localData) {
        parsed = JSON.parse(localData);
      }
    } catch (e) {
      console.error("Error parsing local transactions, resetting:", e);
      localStorage.setItem("sovereign_local_transactions", JSON.stringify([]));
      parsed = [];
    }

    // Auto-clean legacy seed transactions
    if (parsed.length > 0 && parsed.every(t => t.id && String(t.id).startsWith("seed_"))) {
      localStorage.setItem("sovereign_local_transactions", JSON.stringify([]));
      parsed = [];
    }
    return { success: true, data: parsed };
  }

  try {
    const q = query(transactionsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const transactions = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        _id: doc.id,
        ...data
      });
    });

    // No auto-seeding of default transactions

    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error getting documents from Firestore: ", error);
    return { success: false, error: error.message };
  }
};

export const saveData = async (formData) => {
  const user = auth.currentUser;
  const demoUser = JSON.parse(localStorage.getItem("sovereign_demo_user"));
  const userId = user ? user.uid : (demoUser ? "demo-user" : null);

  if (userId === "demo-user") {
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem("sovereign_local_transactions") || "[]");
    } catch (e) {
      console.error("Error parsing local transactions for save, resetting:", e);
      localData = [];
    }
    const newId = "local_" + Date.now();
    const newTransaction = {
      id: newId,
      _id: newId,
      userId,
      ...formData
    };
    localData.push(newTransaction);
    localStorage.setItem("sovereign_local_transactions", JSON.stringify(localData));
    return { success: true, id: newId };
  }

  try {
    const dataWithUser = {
      ...formData,
      userId
    };

    const docRef = await addDoc(transactionsCollection, dataWithUser);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    return { success: false, error: error.message };
  }
};

export const updateData = async (id, formData) => {
  const demoUser = localStorage.getItem("sovereign_demo_user");
  if (demoUser) {
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem("sovereign_local_transactions") || "[]");
    } catch (e) {
      console.error("Error parsing local transactions for update:", e);
      return { success: false, error: e.message };
    }
    const idx = localData.findIndex(t => t.id === id);
    if (idx !== -1) {
      localData[idx] = { ...localData[idx], ...formData };
      localStorage.setItem("sovereign_local_transactions", JSON.stringify(localData));
      return { success: true };
    }
    return { success: false, error: "Local transaction not found" };
  }

  try {
    const docRef = doc(db, "transactions", id);
    await updateDoc(docRef, formData);
    return { success: true };
  } catch (error) {
    console.error("Error updating document in Firestore: ", error);
    return { success: false, error: error.message };
  }
};

export const deleteData = async (id) => {
  const demoUser = localStorage.getItem("sovereign_demo_user");
  if (demoUser) {
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem("sovereign_local_transactions") || "[]");
    } catch (e) {
      console.error("Error parsing local transactions for delete:", e);
      return { success: false, error: e.message };
    }
    localData = localData.filter(t => t.id !== id);
    localStorage.setItem("sovereign_local_transactions", JSON.stringify(localData));
    return { success: true };
  }

  try {
    const docRef = doc(db, "transactions", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting document from Firestore: ", error);
    return { success: false, error: error.message };
  }
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