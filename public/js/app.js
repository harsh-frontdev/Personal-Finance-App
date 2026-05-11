import { setTransactions, setSelectedId, getTransactions, getSelectedTransaction } from "./store.js";
import updateTransactions from "./components/transactionTable.js";
import { initModal, closeModalById, openModalById } from "./components/modal.js";
import { showToast } from "./components/toast.js";
import { saveData, getData, deleteData, updateData } from "./services/api.js";
import { updateDetailSidebar } from "./components/detailSidebar.js";
import { formatDateForInput } from "./utils/helper.js";
import { getFormData, fillForm } from "./utils/formHandler.js";
import { setModalMode } from "./utils/uiController.js";

initApp();
async function initApp() {
  initModal("addTransactionModal", "btnOpenAddTransaction", "btnCloseAddTransaction");
  await refreshData();
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
