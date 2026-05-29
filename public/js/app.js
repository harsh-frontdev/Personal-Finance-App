import { setTransactions, setSelectedId, getTransactions, getSelectedTransaction } from "./store.js";
import updateTransactions from "./components/transactionTable.js";
import { initModal, closeModalById, openModalById } from "./components/modal.js";
import { showToast } from "./components/toast.js";
import { saveData, getData, deleteData, updateData, auth } from "./services/api.js";
import { updateDetailSidebar } from "./components/detailSidebar.js";
import { formatDateForInput } from "./utils/helper.js";
import { getFormData, fillForm } from "./utils/formHandler.js";
import { setModalMode } from "./utils/uiController.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

initApp();
function initApp() {
  initModal("addTransactionModal", "btnOpenAddTransaction", "btnCloseAddTransaction");
  
  onAuthStateChanged(auth, async (user) => {
    const demoUser = JSON.parse(localStorage.getItem("sovereign_demo_user"));
    if (!user && !demoUser) {
      window.location.href = "login.html";
    } else {
      // Dynamic profile name in the header & sidebar
      const names = document.querySelectorAll(".userNameDisplay");
      names.forEach(el => {
        el.textContent = user ? (user.displayName || user.email) : demoUser.displayName;
      });
      await refreshData();

      // Check if we need to auto-open the Add Transaction modal (triggered from other pages)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("add") === "true") {
        // Clean URL query parameter instantly to keep histories clean
        window.history.replaceState({}, document.title, window.location.pathname);
        mainForm.reset();
        const today = new Date().toISOString().split('T')[0];
        document.querySelector("#transaction_date").value = today;
        setModalMode("add");
        openModalById("addTransactionModal");
      }
    }
  });
}

async function refreshData() {
  const result = await getData();
  if (result && result.success) {
    setTransactions(result.data)
    updateTransactions(getTransactions());
  }
}

const mainForm = document.querySelector("#addTrasactionForm");
mainForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const transactionID = document.querySelector('#transactionId').value;
  const transObject = getFormData(mainForm);

  const response = transactionID
    ? await updateData(transactionID, transObject)
    : await saveData(transObject);

  if (response?.success) {
    showToast(`${transactionID ? "Updated" : "Added"} transaction successfully!`, "success");
    handlePostSubmit();
  } else {
    showToast(`Failed to ${transactionID ? "update" : "add"} transaction.`, "error");
  }
});

async function handlePostSubmit() {
  mainForm.reset();
  document.querySelector('#transactionId').value = "";
  closeModalById("addTransactionModal");
  await refreshData();
}

// History Click Event
const transactionTable = document.querySelector("#table-wrapper");
transactionTable.addEventListener("click", (e) => {
  const allTr = document.querySelectorAll("#table-wrapper tr");
  allTr.forEach(el => el.classList.remove("bg-slate-50"));

  let trEl = e.target.closest("tr");
  if (!trEl) return;

  trEl.classList.add("bg-slate-50");

  const transactionId = trEl.dataset.id;
  setSelectedId(transactionId);
  const selected = getSelectedTransaction();

  if (selected) {
    updateDetailSidebar(selected);
  }
});

// Add Transactions
const addTransactionBtn = document.querySelector("#btnOpenAddTransaction");
addTransactionBtn.addEventListener("click", (e) => {
  mainForm.reset();
  document.querySelector('#transactionId').value = "";
  
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  document.querySelector("#transaction_date").value = today;
  
  setModalMode("add");
  openModalById("addTransactionModal");
});

// Edit Transactions
const editTransactionBtn = document.querySelector("#btnOpenEditTransaction");
editTransactionBtn.addEventListener("click", (e) => {
  const selected = getSelectedTransaction();
  if (!selected) return showToast("Please select a transaction first", "info");
  setModalMode("edit");
  fillForm(mainForm, selected, formatDateForInput(selected.date));
  openModalById("addTransactionModal");
});

// Delete Transaction
const deleteTransactionBtn = document.querySelector("#btnDeleteTransaction");
deleteTransactionBtn.addEventListener("click", async (e) => {
  const selected = getSelectedTransaction();
  if (!selected) return showToast("Please select a transaction first", "info");

  const response = await deleteData(selected.id);

  if (response?.success) {
    showToast("Transaction deleted successfully!", "success");
  } else {
    showToast("Failed to delete transaction.", "error");
  }

  await refreshData();
  setSelectedId(null);
  updateDetailSidebar(null);
});

// Sign Out Click Event
const signOutBtn = document.querySelector("#btnSignOut");
  if (signOutBtn) {
  signOutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      if (localStorage.getItem("sovereign_demo_user")) {
        localStorage.removeItem("sovereign_demo_user");
      } else {
        await signOut(auth);
      }
      window.location.href = "login.html";
    } catch (error) {
      console.error("Sign out failed: ", error);
      showToast("Failed to sign out.", "error");
    }
  });
}

// Real-time Search Functionality
const searchInput = document.querySelector("#searchTransactions");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const allTransactions = getTransactions();
    
    const filtered = allTransactions.filter(t => 
      (t.description && t.description.toLowerCase().includes(query)) ||
      (t.category && t.category.toLowerCase().includes(query)) ||
      (t.account && t.account.toLowerCase().includes(query)) ||
      (t.amount && String(t.amount).includes(query))
    );
    
    updateTransactions(filtered);
  });
}
