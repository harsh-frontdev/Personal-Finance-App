import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { 
  getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, deleteUser } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
const analytics = getAnalytics(app);
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

  const useLocalFallback = localStorage.getItem("sovereign_use_local_fallback") === "true";

  // Local Storage Mode Fallback for Demo User, Offline Testing or Firestore failure fallback
  if (userId === "demo-user" || useLocalFallback) {
    const storageKey = `sovereign_local_transactions_${userId}`;
    let localData = localStorage.getItem(storageKey);
    if (!localData && userId === "demo-user") {
      localData = localStorage.getItem("sovereign_local_transactions");
    }
    let parsed = [];
    try {
      if (localData) {
        parsed = JSON.parse(localData);
      }
    } catch (e) {
      console.error("Error parsing local transactions, resetting:", e);
      localStorage.setItem(storageKey, JSON.stringify([]));
      parsed = [];
    }

    // Auto-clean legacy seed transactions for demo user
    if (userId === "demo-user" && parsed.length > 0 && parsed.every(t => t.id && String(t.id).startsWith("seed_"))) {
      localStorage.setItem(storageKey, JSON.stringify([]));
      parsed = [];
    }
    return { success: true, data: parsed, fallback: useLocalFallback };
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

    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error getting documents from Firestore: ", error);
    if (error.code === "permission-denied" || error.message.toLowerCase().includes("permission")) {
      localStorage.setItem("sovereign_use_local_fallback", "true");
      // Seamlessly reload to fallback mode
      window.location.reload();
    }
    return { success: false, error: error.message };
  }
};

export const saveData = async (formData) => {
  const user = auth.currentUser;
  const demoUser = JSON.parse(localStorage.getItem("sovereign_demo_user"));
  const userId = user ? user.uid : (demoUser ? "demo-user" : null);

  const useLocalFallback = localStorage.getItem("sovereign_use_local_fallback") === "true";

  if (userId === "demo-user" || useLocalFallback) {
    const storageKey = `sovereign_local_transactions_${userId}`;
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem(storageKey) || "[]");
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
    localStorage.setItem(storageKey, JSON.stringify(localData));
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
    if (error.code === "permission-denied" || error.message.toLowerCase().includes("permission")) {
      localStorage.setItem("sovereign_use_local_fallback", "true");
      window.location.reload();
    }
    return { success: false, error: error.message };
  }
};

export const updateData = async (id, formData) => {
  const demoUser = localStorage.getItem("sovereign_demo_user");
  const useLocalFallback = localStorage.getItem("sovereign_use_local_fallback") === "true";
  const user = auth.currentUser;
  const userId = user ? user.uid : (demoUser ? "demo-user" : null);

  if (demoUser || useLocalFallback) {
    const storageKey = `sovereign_local_transactions_${userId}`;
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (e) {
      console.error("Error parsing local transactions for update:", e);
      return { success: false, error: e.message };
    }
    const idx = localData.findIndex(t => t.id === id);
    if (idx !== -1) {
      localData[idx] = { ...localData[idx], ...formData };
      localStorage.setItem(storageKey, JSON.stringify(localData));
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
    if (error.code === "permission-denied" || error.message.toLowerCase().includes("permission")) {
      localStorage.setItem("sovereign_use_local_fallback", "true");
      window.location.reload();
    }
    return { success: false, error: error.message };
  }
};

export const deleteData = async (id) => {
  const demoUser = localStorage.getItem("sovereign_demo_user");
  const useLocalFallback = localStorage.getItem("sovereign_use_local_fallback") === "true";
  const user = auth.currentUser;
  const userId = user ? user.uid : (demoUser ? "demo-user" : null);

  if (demoUser || useLocalFallback) {
    const storageKey = `sovereign_local_transactions_${userId}`;
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (e) {
      console.error("Error parsing local transactions for delete:", e);
      return { success: false, error: e.message };
    }
    localData = localData.filter(t => t.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(localData));
    return { success: true };
  }

  try {
    const docRef = doc(db, "transactions", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting document from Firestore: ", error);
    if (error.code === "permission-denied" || error.message.toLowerCase().includes("permission")) {
      localStorage.setItem("sovereign_use_local_fallback", "true");
      window.location.reload();
    }
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

export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  const demoUser = JSON.parse(localStorage.getItem("sovereign_demo_user"));
  const userId = user ? user.uid : (demoUser ? "demo-user" : null);

  if (!userId) {
    return { success: false, error: "No active user session found" };
  }

  // 1. Delete Firestore transaction records
  if (userId !== "demo-user") {
    try {
      const q = query(transactionsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = [];
      querySnapshot.forEach((document) => {
        const docRef = doc(db, "transactions", document.id);
        deletePromises.push(deleteDoc(docRef));
      });
      
      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Failed to delete user transactions from Firestore:", err);
      return { success: false, error: "Failed to delete transaction history: " + err.message };
    }
  }

  // 2. Delete Auth User from Firebase
  if (user) {
    try {
      await deleteUser(user);
    } catch (err) {
      console.error("Failed to delete user from Auth:", err);
      return { success: false, error: err.message, code: err.code };
    }
  }

  // 3. Clean up localStorage prefixing sovereign_
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("sovereign_")) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));

  return { success: true };
};