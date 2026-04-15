import updateTransactions from "./utils/transaction.js";
import { initModal, closeModalById, openModalById } from "./utils/modal.js";
import { showToast } from "./utils/toast.js";
import { saveData, getData, deleteData, updateData } from "./data.js";
import { updateDetailSidebar } from "./utils/detailSidebar.js";
import { formatDateForInput } from "./utils/helper.js";
import { getFormData, fillForm } from "./utils/formHandler.js";
import { setModalMode } from "./utils/uiController.js";

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

// Add Transactions
const addTransactionBtn = document.querySelector("#btnOpenAddTransaction");
addTransactionBtn.addEventListener("click", (e) => {
  setModalMode("add");
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
  const selected = state.transactions.find(el => el._id === state.selectedId);
  if (!selected) return;

  setModalMode("edit");
  fillForm(mainForm, selected, formatDateForInput(selected.date));
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
