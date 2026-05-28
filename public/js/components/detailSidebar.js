import { formatCurrency, formatDate } from "../utils/helper.js";

const categoryStyles = {
  Groceries: {
    icon: "shopping_basket",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600"
  },
  Dining: {
    icon: "restaurant",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600"
  },
  Transport: {
    icon: "directions_car",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600"
  },
  Rent: {
    icon: "home",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  }
};

const defaultStyle = {
  icon: "bookmark",
  bgColor: "bg-[#eff6ff]",
  textColor: "text-[#3b82f6]"
};

export const updateDetailSidebar = (transaction) => {
  if (!transaction) return;

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

  // Update Category Icon & Style Dynamically
  const iconContainer = document.querySelector("#detail-icon-container");
  const iconEl = document.querySelector("#detail-icon");
  if (iconContainer && iconEl) {
    const style = categoryStyles[transaction.category] || defaultStyle;
    iconEl.textContent = style.icon;
    iconContainer.className = `w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-colors duration-300 ${style.bgColor} ${style.textColor}`;
  }
}
