import updateTransactions from "./utils/transaction.js";
import { initModal, closeModalById, openModalById } from "./utils/modal.js";
import { showToast } from "./utils/toast.js";
import { saveData, getData, deleteData, updateData } from "./data.js";
import { updateDetailSidebar } from "./utils/detailSidebar.js";
import { formatDateForInput } from "./utils/helper.js";

let state = {
  transactions: [],
  selectedId: null
};
initApp();
async function initApp() {
  initModal("addTransactionModal", "btnOpenAddTransaction", "btnCloseAddTransaction");
  await refreshData();
}

async function refreshData() {
  const result = await getData();
  if (result && result.success) {
    state.transactions = result.data;
    updateTransactions(state.transactions);
  }
}

const mainForm = document.querySelector("#addTrasactionForm");
mainForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const transactionID = document.querySelector('#transactionId').value;
  const formData = new FormData(mainForm);

  const transObject = new Object({
    date: formData.get("date-time"),
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    description: formData.get("desc"),
    category: formData.get("category"),
    account: formData.get("account"),
    amount: parseFloat(formData.get("price")),
  });

  let response;

  if (transactionID) {
    response = await updateData(transactionID, transObject);
  } else {
    response = await saveData(transObject);
  }

  if (response && response.success) {
    showToast(`${transactionID ? "Updated" : "Added"} transaction successfully!`, "success");
    mainForm.reset();
    closeModalById("addTransactionModal");
    document.querySelector('#transactionId').value = "";
    await refreshData();
  } else {
    showToast(`Failed to ${transactionID ? "update" : "add"} transaction.`, "error");
  }
});

// Add Transactions
const addTransactionBtn = document.querySelector("#btnOpenAddTransaction");
addTransactionBtn.addEventListener("click", (e) => {
  document.querySelector('#addTransactionBtn').textContent = "Add Transaction";
  openModalById("addTransactionModal");
});

// History Click Event
const transactionTable = document.querySelector("#table-wrapper");
transactionTable.addEventListener("click", (e) => {
  const allTr = document.querySelectorAll("#table-wrapper tr");
  allTr.forEach(el => el.classList.remove("bg-slate-50"));

  let trEl = e.target.closest("tr");
  if (!trEl) return;

  trEl.classList.add("bg-slate-50");

  const transactionId = trEl.dataset.id;
  const selected = state.transactions.find(el => el._id === transactionId);

  if (selected) {
    state.selectedId = transactionId;
    updateDetailSidebar(selected);
  }
});

// Edit Transactions
const editTransactionBtn = document.querySelector("#btnOpenEditTransaction");
editTransactionBtn.addEventListener("click", (e) => {
  document.querySelector('#addTransactionBtn').textContent = "Update Transaction";
  const selected = state.transactions.find(el => el._id === state.selectedId);
  const formattedDate = formatDateForInput(selected.date);

  // Set transaction ID
  const transactionIDField = document.querySelector('#transactionId');
  transactionIDField.value = selected._id;

  document.querySelector('#transaction_price').value = selected.amount;
  document.querySelector('#transaction_date').value = formattedDate;
  document.querySelector('#transaction_account').value = selected.account;
  document.querySelector('#transaction_desc').value = selected.description;
  document.querySelector('#category-radio').querySelector(`input[value="${selected.category}"]`).checked = true;

  openModalById("addTransactionModal");

});

// Delete Transaction
const deleteTransactionBtn = document.querySelector("#btnDeleteTransaction");
deleteTransactionBtn.addEventListener("click", async (e) => {
  const selected = state.transactions.find(el => el._id === state.selectedId);
  if (selected) {
    const response = await deleteData(selected._id);

    if (response && response.success) {
      showToast("Transaction deleted successfully!", "success");
    } else {
      showToast("Failed to delete transaction.", "error");
    }

    await refreshData();
  }
});
