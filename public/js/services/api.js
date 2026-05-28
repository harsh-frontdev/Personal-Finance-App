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
  try {
    const user = auth.currentUser;
    const demoUser = JSON.parse(localStorage.getItem("sovereign_demo_user"));
    const userId = user ? user.uid : (demoUser ? "demo-user" : null);

    if (!userId) {
      return { success: true, data: [] };
    }

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

    // Auto-seed if the user has no transactions to present a stunning and premium user experience immediately
    if (transactions.length === 0) {
      console.log("No transactions found for user in Firestore. Seeding premium default transactions...");
      const seedTransactions = [
        {
          userId,
          date: "2026-05-25",
          time: "10:15 AM",
          description: "Organic Produce & Fine Cheese (Artisan Market)",
          category: "Groceries",
          account: "SBI Bank",
          amount: -3450.00
        },
        {
          userId,
          date: "2026-05-26",
          time: "08:45 PM",
          description: "Fine Dining (The Sterling Room)",
          category: "Dining",
          account: "AXIS Bank",
          amount: -8200.00
        },
        {
          userId,
          date: "2026-05-24",
          time: "06:30 AM",
          description: "Premium Chauffeur Service (Airport Transfer)",
          category: "Transport",
          account: "IDBI Bank",
          amount: -2500.00
        },
        {
          userId,
          date: "2026-05-20",
          time: "11:00 AM",
          description: "Quarterly Rental Income (Sterling Tower)",
          category: "Rent",
          account: "AXIS Bank",
          amount: 125000.00
        }
      ];

      for (const t of seedTransactions) {
        const docRef = await addDoc(transactionsCollection, t);
        transactions.push({
          id: docRef.id,
          _id: docRef.id,
          ...t
        });
      }
    }

    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error getting documents from Firestore: ", error);
    return { success: false, error: error.message };
  }
};

export const saveData = async (formData) => {
  try {
    const user = auth.currentUser;
    const demoUser = JSON.parse(localStorage.getItem("sovereign_demo_user"));
    const userId = user ? user.uid : (demoUser ? "demo-user" : null);

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