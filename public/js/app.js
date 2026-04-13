import updateTransactions from "./utils/transaction.js";
import initModal, { closeModalById } from "./utils/modal.js";
import { showToast } from "./utils/toast.js";
import {saveData, getData} from "./data.js"

document.addEventListener("DOMContentLoaded", () => {
  initModal(
    "addTransactionModal",
    "btnOpenAddTransaction",
    "btnCloseAddTransaction",
  );
});

let existingTrans = [];
function loadTransactions() {
  existingTrans = JSON.parse(localStorage.getItem("myTransactions")) || [];
  updateTransactions(existingTrans);
}
loadTransactions();

// Add Transactions
const form = document.querySelector("#addTrasactionForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  existingTrans = JSON.parse(localStorage.getItem("myTransactions")) || [];
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
