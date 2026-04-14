import { formatCurrency, formatDate } from "./helper.js";

export const updateDetailSidebar = (transaction) => {
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
