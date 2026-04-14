import updateTransactions from "./utils/transaction.js";
import { initModal, closeModalById, openModalById } from "./utils/modal.js";
import { showToast } from "./utils/toast.js";
import { saveData, getData } from "./data.js";
import {updateDetailSidebar} from "./utils/detailSidebar.js";

let state = {
  transactions : [],
  selectedId: null
};

initApp();
async function initApp() {
  initModal("addTransactionModal", "btnOpenAddTransaction", "btnCloseAddTransaction",);
  await refreshData();
}

async function refreshData() {
  const result = await getData();
  if(result && result.success){
    state.transactions = result.data;
    updateTransactions(state.transactions);
  }
}

// Add Transactions
const form = document.querySelector("#addTrasactionForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addTrasactionForm);

  const newTrans = new Object({
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
  const response = await saveData(newTrans);

  if (response && response.success) {
    showToast("Transaction added successfully!", "success");
  } else {
    showToast("Failed to add transaction.", "error");
  }

  addTrasactionForm.reset();
  closeModalById("addTransactionModal");

  await refreshData();
});

// Edit Transactions
const editTransactionBtn = document.querySelector("#btnOpenEditTransaction");
editTransactionBtn.addEventListener("click", (e) => {
  openModalById("addTransactionModal");
});

// History Click Event
const transactionTable = document.querySelector("#transactionTable");
transactionTable.addEventListener("click", (e) => {
  console.log('asdasdasd');
  const allTr = document.querySelectorAll("#transactionTable tr");
  allTr.forEach( el => el.classList.remove("bg-slate-50") );

  let trEl = e.target.closest("tr");
  if(!trEl) return;

  trEl.classList.add("bg-slate-50");
  
  const transactionId = trEl.dataset.id;
  const selected = state.transactions.find( el => el._id === transactionId);
  
  if(selected){
    state.selectedId = transactionId;
    updateDetailSidebar(selected);
  }

});