import { formatCurrency, formatDate } from "../utils/helper.js";

const getCategoryStyles = () => {
  const defaultCategories = [
    { value: "Groceries", label: "Groceries", icon: "shopping_basket" },
    { value: "Dining", label: "Dining", icon: "restaurant" },
    { value: "Transport", label: "Transport", icon: "directions_car" },
    { value: "Rent", label: "Rent", icon: "home" }
  ];

  const saved = localStorage.getItem("sovereign_categories");
  let categories = defaultCategories;
  if (saved) {
    try {
      categories = JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse dynamic categories in sidebar.");
    }
  }

  const styles = {};
  const defaultColors = {
    Rent: { bgColor: "bg-purple-50 dark:bg-purple-950/20", textColor: "text-purple-600 dark:text-purple-400" },
    Dining: { bgColor: "bg-amber-50 dark:bg-amber-950/20", textColor: "text-amber-600 dark:text-amber-400" },
    Groceries: { bgColor: "bg-emerald-50 dark:bg-emerald-950/20", textColor: "text-emerald-600 dark:text-emerald-400" },
    Transport: { bgColor: "bg-indigo-50 dark:bg-indigo-950/20", textColor: "text-indigo-600 dark:text-indigo-400" }
  };

  categories.forEach((cat, index) => {
    const val = cat.value;
    if (defaultColors[val]) {
      styles[val] = {
        icon: cat.icon,
        bgColor: defaultColors[val].bgColor,
        textColor: defaultColors[val].textColor
      };
    } else {
      const colorsList = [
        { bgColor: "bg-teal-50 dark:bg-teal-950/20", textColor: "text-teal-600 dark:text-teal-400" },
        { bgColor: "bg-rose-50 dark:bg-rose-950/20", textColor: "text-rose-600 dark:text-rose-400" },
        { bgColor: "bg-cyan-50 dark:bg-cyan-950/20", textColor: "text-cyan-600 dark:text-cyan-400" },
        { bgColor: "bg-fuchsia-50 dark:bg-fuchsia-950/20", textColor: "text-fuchsia-600 dark:text-fuchsia-400" },
        { bgColor: "bg-sky-50 dark:bg-sky-950/20", textColor: "text-sky-600 dark:text-sky-400" },
        { bgColor: "bg-pink-50 dark:bg-pink-950/20", textColor: "text-pink-600 dark:text-pink-400" }
      ];
      const selectedColor = colorsList[index % colorsList.length];
      styles[val] = {
        icon: cat.icon,
        bgColor: selectedColor.bgColor,
        textColor: selectedColor.textColor
      };
    }
  });
  return styles;
};

const defaultStyle = {
  icon: "bookmark",
  bgColor: "bg-[#eff6ff]",
  textColor: "text-[#3b82f6]"
};

export const updateDetailSidebar = (transaction) => {
  if (!transaction) {
    const descEl = document.querySelector("#detail-desc");
    if (descEl) descEl.textContent = "No Transaction Selected";
    const dateEl = document.querySelector("#detail-date");
    if (dateEl) dateEl.textContent = "-- --, ----";
    const timeEl = document.querySelector("#detail-time");
    if (timeEl) timeEl.textContent = "--:--";
    const catEl = document.querySelector("#detail-category");
    if (catEl) catEl.textContent = "N/A";
    const accEl = document.querySelector("#detail-account");
    if (accEl) accEl.textContent = "N/A";
    const amtEl = document.querySelector("#detail-amount");
    if (amtEl) amtEl.textContent = "₹0.00";

    const iconContainer = document.querySelector("#detail-icon-container");
    const iconEl = document.querySelector("#detail-icon");
    if (iconContainer && iconEl) {
      iconEl.textContent = "bookmark";
      iconContainer.className = "w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-colors duration-300 bg-slate-50 text-slate-300 border border-slate-100";
    }

    const noteContainer = document.querySelector(".bg-\\[#fffbeb\\]");
    if (noteContainer) {
      noteContainer.classList.add("hidden");
    }
    return;
  }

  const noteContainer = document.querySelector(".bg-\\[#fffbeb\\]");
  if (noteContainer) {
    noteContainer.classList.remove("hidden");
    const noteTextEl = noteContainer.querySelector(".text-\\[#92400e\\]");
    if (noteTextEl) {
      noteTextEl.textContent = transaction.description || "No internal notes recorded.";
    }
  }

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
    const categoryStyles = getCategoryStyles();
    const style = categoryStyles[transaction.category] || defaultStyle;
    iconEl.textContent = style.icon;
    iconContainer.className = `w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-colors duration-300 ${style.bgColor} ${style.textColor}`;
  }
}
