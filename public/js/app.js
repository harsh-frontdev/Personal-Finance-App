import updateTransactions from "./utils/transaction.js";
import { initModal, closeModalById, openModalById } from "./utils/modal.js";
import { showToast } from "./utils/toast.js";
import { saveData, getData, deleteData } from "./data.js";
import {updateDetailSidebar} from "./utils/detailSidebar.js";
import { formatDateForInput } from "./utils/helper.js";

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

// History Click Event
const transactionTable = document.querySelector("#table-wrapper");
transactionTable.addEventListener("click", (e) => {
  const allTr = document.querySelectorAll("#table-wrapper tr");
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

// Edit Transactions
const editTransactionBtn = document.querySelector("#btnOpenEditTransaction");
editTransactionBtn.addEventListener("click", (e) => {
  const formData = new FormData(addTrasactionForm);
  formData.set("desc", 'HEYHEYHEY');

  const selected = state.transactions.find(el => el._id === state.selectedId);
  const formattedDate = formatDateForInput(selected.date);

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
    if(selected){
      console.log(selected);  
      const response = await deleteData(selected._id);
      
      if (response && response.success) {
        showToast("Transaction deleted successfully!", "success");
      } else {
        showToast("Failed to delete transaction.", "error");
      }

      await refreshData();
    }
});
