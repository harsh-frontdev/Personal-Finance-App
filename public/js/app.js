import updateTransactions from "./utils/transaction.js";
import { initModal, closeModalById, openModalById } from "./utils/modal.js";
import { showToast } from "./utils/toast.js";
import { saveData, getData } from "./data.js";
import { formatDate, formatCurrency } from "./utils/helper.js";

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
  updateTransactions();
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
  await getData();
  updateTransactions();
});

// Edit Transactions
const editTransactionBtn = document.querySelector("#btnOpenEditTransaction");
editTransactionBtn.addEventListener("click", (e) => {
  openModalById("addTransactionModal");
});

// History Click Event
handleTransactionClick();
function handleTransactionClick() {
  const transactionTable = document.querySelector("#transactionTable");
  transactionTable.addEventListener("click", (e) => {
    const allTr = document.querySelectorAll("#transactionTable tr");
    allTr.forEach((el) => {
      el.classList.remove("bg-slate-50");
    });
    let trEl = e.target.closest("tr");
    trEl.classList.add("bg-slate-50");
    if (trEl) {
      getData().then((result) => {
        const data = result.data;
        const filteredData = data.filter((el) => el._id == trEl.dataset.id);

        updateDetailSidebar(filteredData[0]);
      });
    }
  });
}

function updateDetailSidebar(transaction){
  if(!transaction) return;

  // Format Date
  const formattedDate = formatDate(transaction.date);  
  // Format Amount
  const formattedAmount = formatCurrency(transaction.amount);
  // Set Data in UI
  document.querySelector("#detail-desc").textContent = transaction.description;
  document.querySelector("#detail-date").textContent = formattedDate;
  document.querySelector("#detail-time").textContent = transaction.time;
  document.querySelector("#detail-category").textContent = transaction.category;
  document.querySelector("#detail-account").textContent = transaction.account;
  document.querySelector("#detail-amount").textContent = formattedAmount;
}