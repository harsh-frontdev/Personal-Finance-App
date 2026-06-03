import { getData } from "../services/api.js";

// Global Search Component Initialization
document.addEventListener("DOMContentLoaded", () => {
  initGlobalSearch();
  initDarkMode();
  initNotifications();
});

async function initGlobalSearch() {
  // Select the header search input dynamically on any page
  const searchInput = document.querySelector('header input[placeholder*="Search"]') || document.querySelector('header input[type="text"]');
  if (!searchInput) return;

  // Make the parent search container relative so we can absolutely position the dropdown
  const parentContainer = searchInput.closest('div');
  if (parentContainer) {
    parentContainer.classList.add("relative");
  }

  // State
  let allTransactions = [];
  try {
    const res = await getData();
    if (res && res.success) {
      allTransactions = res.data;
    }
  } catch (err) {
    console.warn("Failed to load search transactions: ", err);
  }

  // Standard platform items
  const pages = [
    { title: "Dashboard Overview", url: "index.html", icon: "grid_view" },
    { title: "Transactions Ledger", url: "transaction.html", icon: "receipt_long" },
    { title: "Budget Manager", url: "budgets.html", icon: "account_balance_wallet" },
    { title: "Accounts Portfolio", url: "accounts.html", icon: "account_balance" },
    { title: "Financial Reports", url: "reports.html", icon: "bar_chart" },
    { title: "Savings Goals", url: "goals.html", icon: "track_changes" },
    { title: "Workspace Settings", url: "settings.html", icon: "settings" }
  ];

  const accounts = [
    { title: "HDFC Bank Savings", url: "accounts.html", balance: "₹8,42,031.11", icon: "savings" },
    { title: "ICICI Bank FD", url: "accounts.html", balance: "₹15,78,999.91", icon: "account_balance" },
    { title: "SBI NPS (Tier-1)", url: "accounts.html", balance: "₹64,28,000.00", icon: "verified_user" },
    { title: "Zerodha Mutual Funds", url: "accounts.html", balance: "₹42,50,000.00", icon: "trending_up" },
    { title: "Groww Portfolio", url: "accounts.html", balance: "₹11,86,872.00", icon: "show_chart" },
    { title: "AMEX India Card", url: "accounts.html", balance: "₹84,501.20", icon: "credit_card" },
    { title: "OneCard", url: "accounts.html", balance: "₹40,000.30", icon: "credit_card" }
  ];

  const budgetsAndGoals = [
    { title: "Groceries Budget", url: "budgets.html", limit: "₹8,000 limit", icon: "shopping_basket" },
    { title: "Dining Budget", url: "budgets.html", limit: "₹5,000 limit", icon: "restaurant" },
    { title: "Transport Budget", url: "budgets.html", limit: "₹3,000 limit", icon: "directions_car" },
    { title: "Rent Budget", url: "budgets.html", limit: "₹45,000 limit", icon: "home" },
    { title: "European Summer Trip", url: "goals.html", target: "₹5,00,000 goal", icon: "flight" },
    { title: "Emergency Shield Fund", url: "goals.html", target: "₹2,50,000 goal", icon: "shield" },
    { title: "New Home Down Payment", url: "goals.html", target: "₹20,00,000 goal", icon: "real_estate_agent" }
  ];

  // Dynamic dropdown element creation
  const dropdown = document.createElement("div");
  dropdown.id = "global-search-dropdown";
  dropdown.className = "absolute top-[calc(100%+8px)] left-0 w-[420px] bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-2xl p-4 hidden flex-col z-[1000] overflow-y-auto max-h-[420px] transition-all duration-200 opacity-0 -translate-y-2 pointer-events-none";
  document.body.appendChild(dropdown);

  // Position dynamic adjustments
  const positionDropdown = () => {
    if (!parentContainer) return;
    const rect = parentContainer.getBoundingClientRect();
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width + 120}px`; // Provide extra layout width for details
    dropdown.style.top = `${rect.bottom + window.scrollY + 8}px`;
  };

  const showDropdown = () => {
    positionDropdown();
    dropdown.classList.remove("hidden");
    // Force a reflow
    dropdown.offsetHeight;
    dropdown.classList.remove("opacity-0", "-translate-y-2", "pointer-events-none");
    dropdown.classList.add("opacity-100", "translate-y-0");
  };

  const hideDropdown = () => {
    dropdown.classList.remove("opacity-100", "translate-y-0");
    dropdown.classList.add("opacity-0", "-translate-y-2", "pointer-events-none");
    setTimeout(() => {
      dropdown.classList.add("hidden");
    }, 200);
  };

  // Bind focus and blur actions
  searchInput.addEventListener("focus", () => {
    renderResults(searchInput.value.trim());
    showDropdown();
  });

  // Handle click outside to close dropdown
  document.addEventListener("click", (e) => {
    if (!parentContainer.contains(e.target) && !dropdown.contains(e.target)) {
      hideDropdown();
    }
  });

  // Re-position on resize or scroll to keep overlay linked
  window.addEventListener("resize", positionDropdown);
  window.addEventListener("scroll", positionDropdown, true);

  // Event handler for typing search query
  searchInput.addEventListener("input", (e) => {
    const queryStr = e.target.value.trim();
    renderResults(queryStr);
  });

  // Search matching and render engine
  function renderResults(queryStr) {
    const query = queryStr.toLowerCase();
    dropdown.innerHTML = "";

    // SECTION 1: IF EMPTY -> Show Navigation Quick Links & Portfolios
    if (!query) {
      // Title
      dropdown.insertAdjacentHTML("beforeend", `
        <div class="text-[0.65rem] font-bold text-muted uppercase tracking-wider mb-2.5 px-2">Quick Navigation</div>
      `);
      
      const gridContainer = document.createElement("div");
      gridContainer.className = "grid grid-cols-2 gap-2 mb-4";
      pages.forEach(p => {
        const item = `
          <a href="${p.url}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100/50 hover:bg-slate-50 text-main transition-all group shadow-sm bg-white">
            <span class="material-symbols-rounded text-md text-muted group-hover:text-primary transition-colors">${p.icon}</span>
            <span class="text-xs font-bold leading-tight group-hover:text-primary transition-colors">${p.title.split(" ")[0]}</span>
          </a>
        `;
        gridContainer.insertAdjacentHTML("beforeend", item);
      });
      dropdown.appendChild(gridContainer);

      dropdown.insertAdjacentHTML("beforeend", `
        <div class="text-[0.65rem] font-bold text-muted uppercase tracking-wider mb-2.5 px-2">Your Accounts</div>
      `);

      accounts.slice(0, 3).forEach(acc => {
        const item = `
          <a href="${acc.url}" class="flex justify-between items-center px-3 py-2.5 rounded-xl hover:bg-slate-50 text-main transition-colors border border-transparent">
            <div class="flex items-center gap-3">
              <span class="material-symbols-rounded text-md text-[#16a34a]">${acc.icon}</span>
              <span class="text-xs font-semibold leading-tight">${acc.title}</span>
            </div>
            <span class="text-xs font-bold text-primary">${acc.balance}</span>
          </a>
        `;
        dropdown.insertAdjacentHTML("beforeend", item);
      });
      return;
    }

    // SECTION 2: IF NOT EMPTY -> MATCH SEARCH ITEMS
    let hasResults = false;

    // A. Match Navigation Pages
    const matchedPages = pages.filter(p => p.title.toLowerCase().includes(query));
    if (matchedPages.length > 0) {
      hasResults = true;
      dropdown.insertAdjacentHTML("beforeend", `
        <div class="text-[0.65rem] font-bold text-muted uppercase tracking-wider mt-1 mb-2 px-2">Navigation</div>
      `);
      matchedPages.forEach(p => {
        const item = `
          <a href="${p.url}" class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 text-main transition-all group">
            <span class="material-symbols-rounded text-md text-muted group-hover:text-primary">${p.icon}</span>
            <span class="text-xs font-bold">${p.title}</span>
          </a>
        `;
        dropdown.insertAdjacentHTML("beforeend", item);
      });
    }

    // B. Match Accounts
    const matchedAccounts = accounts.filter(a => a.title.toLowerCase().includes(query));
    if (matchedAccounts.length > 0) {
      hasResults = true;
      dropdown.insertAdjacentHTML("beforeend", `
        <div class="text-[0.65rem] font-bold text-muted uppercase tracking-wider mt-4 mb-2 px-2">Accounts Portfolio</div>
      `);
      matchedAccounts.forEach(acc => {
        const item = `
          <a href="${acc.url}" class="flex justify-between items-center px-3 py-2 rounded-xl hover:bg-slate-50 text-main transition-colors">
            <div class="flex items-center gap-3">
              <span class="material-symbols-rounded text-md text-[#16a34a]">${acc.icon}</span>
              <span class="text-xs font-bold">${acc.title}</span>
            </div>
            <span class="text-xs font-bold text-primary">${acc.balance}</span>
          </a>
        `;
        dropdown.insertAdjacentHTML("beforeend", item);
      });
    }

    // C. Match Budgets & Goals
    const matchedBudgetsAndGoals = budgetsAndGoals.filter(bg => bg.title.toLowerCase().includes(query));
    if (matchedBudgetsAndGoals.length > 0) {
      hasResults = true;
      dropdown.insertAdjacentHTML("beforeend", `
        <div class="text-[0.65rem] font-bold text-muted uppercase tracking-wider mt-4 mb-2 px-2">Budgets & Targets</div>
      `);
      matchedBudgetsAndGoals.forEach(itemBg => {
        const detail = itemBg.limit || itemBg.target;
        const item = `
          <a href="${itemBg.url}" class="flex justify-between items-center px-3 py-2 rounded-xl hover:bg-slate-50 text-main transition-colors">
            <div class="flex items-center gap-3">
              <span class="material-symbols-rounded text-md text-[#06402b]">${itemBg.icon}</span>
              <span class="text-xs font-bold">${itemBg.title}</span>
            </div>
            <span class="text-[0.7rem] font-bold text-[#b45309] bg-amber-50 border border-amber-200/50 rounded-full px-2.5 py-0.5 leading-none shrink-0">${detail}</span>
          </a>
        `;
        dropdown.insertAdjacentHTML("beforeend", item);
      });
    }

    // D. Match Dynamic Transactions
    const matchedTransactions = allTransactions.filter(t => 
      (t.description && t.description.toLowerCase().includes(query)) ||
      (t.category && t.category.toLowerCase().includes(query)) ||
      (t.account && t.account.toLowerCase().includes(query)) ||
      (t.amount && String(t.amount).includes(query))
    );

    if (matchedTransactions.length > 0) {
      hasResults = true;
      dropdown.insertAdjacentHTML("beforeend", `
        <div class="text-[0.65rem] font-bold text-muted uppercase tracking-wider mt-4 mb-2 px-2">Transactions History</div>
      `);
      matchedTransactions.slice(0, 5).forEach(t => {
        const amt = parseFloat(t.amount) || 0;
        const formattedAmount = (amt > 0 ? "+ ₹" : "- ₹") + Math.abs(amt).toLocaleString("en-IN", { minimumFractionDigits: 2 });
        const amtColor = amt > 0 ? "text-[#16a34a]" : "text-danger";
        
        const item = `
          <a href="transaction.html" class="flex justify-between items-center px-3 py-2 rounded-xl hover:bg-slate-50 text-main transition-colors gap-4">
            <div class="flex flex-col gap-0.5 truncate">
              <span class="text-xs font-bold truncate leading-tight">${t.description}</span>
              <span class="text-[0.6rem] text-muted font-medium">${t.category} &bull; ${t.account}</span>
            </div>
            <span class="text-xs font-bold leading-none shrink-0 ${amtColor}">${formattedAmount}</span>
          </a>
        `;
        dropdown.insertAdjacentHTML("beforeend", item);
      });

      if (matchedTransactions.length > 5) {
        dropdown.insertAdjacentHTML("beforeend", `
          <a href="transaction.html" class="block text-center text-[0.7rem] font-bold text-primary hover:underline mt-2.5 py-1.5 border-t border-slate-100">
            View all ${matchedTransactions.length} matching transactions
          </a>
        `);
      }
    }

    // E. IF NO MATCHES AT ALL
    if (!hasResults) {
      dropdown.insertAdjacentHTML("beforeend", `
        <div class="flex flex-col items-center justify-center py-8 text-center px-4">
          <span class="material-symbols-rounded text-3xl text-muted mb-2">sentiment_dissatisfied</span>
          <div class="text-xs font-bold text-main">No sovereign entries found</div>
          <div class="text-[0.65rem] text-muted mt-1 leading-normal font-semibold max-w-[200px]">We couldn't find matching records for "${queryStr}"</div>
        </div>
      `);
    }
  }
}

function initDarkMode() {
  const profileCard = document.querySelector('aside div.mt-auto');
  if (!profileCard) return;

  const originalContent = profileCard.innerHTML;
  
  // Re-layout as vertical flex container
  profileCard.className = "mt-auto pt-4 border-t border-border flex flex-col gap-3";
  
  // Get theme state
  const isDark = localStorage.getItem("sovereign_theme") === "dark";
  
  profileCard.innerHTML = `
    <div class="flex items-center gap-3">
      ${originalContent}
    </div>
    <div class="flex justify-between items-center pt-2.5 border-t border-border">
      <div class="flex items-center gap-2">
        <span class="material-symbols-rounded text-md text-muted" id="theme-icon">light_mode</span>
        <span class="text-[0.7rem] font-bold text-muted uppercase tracking-wider">Dark Mode</span>
      </div>
      <label class="relative flex items-center">
        <input type="checkbox" class="ios-switch-checkbox sr-only" id="toggle_dark_mode">
        <div class="ios-switch"></div>
      </label>
    </div>
  `;

  const darkModeToggle = document.getElementById("toggle_dark_mode");
  const themeIcon = document.getElementById("theme-icon");

  if (darkModeToggle) {
    darkModeToggle.checked = isDark;
    if (themeIcon) {
      themeIcon.textContent = isDark ? "dark_mode" : "light_mode";
    }

    darkModeToggle.addEventListener("change", () => {
      if (darkModeToggle.checked) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("sovereign_theme", "dark");
        if (themeIcon) themeIcon.textContent = "dark_mode";
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("sovereign_theme", "light");
        if (themeIcon) themeIcon.textContent = "light_mode";
      }
    });
  }
}

function initNotifications() {
  const notifIcon = Array.from(document.querySelectorAll('header span.material-symbols-rounded')).find(el => el.textContent.trim() === 'notifications');
  if (!notifIcon) return;

  const parent = notifIcon.parentElement;
  if (!parent) return;

  // Style icon for relative positioning to overlay the badge
  notifIcon.style.position = "relative";
  notifIcon.classList.add("cursor-pointer");
  
  // Inject the red badge dot
  const badge = document.createElement("span");
  badge.className = "absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border border-white dark:border-[#0b120f]";
  notifIcon.appendChild(badge);

  // Create the absolute dropdown element
  const dropdown = document.createElement("div");
  dropdown.id = "notificationDropdownContainer";
  dropdown.className = "absolute right-0 top-12 w-[340px] bg-white/95 dark:bg-[#0b120f]/95 backdrop-blur-md border border-border rounded-2xl shadow-xl p-5 hidden flex-col gap-4 z-[999] animate-fade-in-up text-main";
  
  dropdown.innerHTML = `
    <div class="flex justify-between items-center pb-2.5 border-b border-border">
      <h4 class="text-xs font-bold font-manrope uppercase tracking-wider text-main">Notifications</h4>
      <button id="btnClearNotifs" class="text-[0.65rem] font-bold text-primary hover:text-primary-hover cursor-pointer outline-none hover:underline">Clear all</button>
    </div>
    
    <div class="flex flex-col gap-0 max-h-[260px] overflow-y-auto py-4 pr-2" id="notifItemsList">
      <!-- Item 1 -->
      <div class="flex gap-3 py-3.5 border-b border-slate-100 dark:border-border last:border-none last:pb-0">
        <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <span class="material-symbols-rounded text-md">check_circle</span>
        </div>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-xs font-bold text-main leading-tight truncate">Large Credit Detected</span>
          <span class="text-[0.65rem] text-muted leading-relaxed">₹1,25,000.00 credited to Axis Bank Savings account.</span>
          <span class="text-[0.55rem] text-light font-bold mt-1 uppercase">2 hours ago</span>
        </div>
      </div>

      <!-- Item 2 -->
      <div class="flex gap-3 py-3.5 border-b border-slate-100 dark:border-border last:border-none last:pb-0">
        <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-danger flex items-center justify-center shrink-0">
          <span class="material-symbols-rounded text-md">warning</span>
        </div>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-xs font-bold text-main leading-tight truncate">Budget Limit Warning</span>
          <span class="text-[0.65rem] text-muted leading-relaxed">You have exceeded your Dining & Hospitality budget.</span>
          <span class="text-[0.55rem] text-light font-bold mt-1 uppercase">5 hours ago</span>
        </div>
      </div>

      <!-- Item 3 -->
      <div class="flex gap-3 py-3.5 border-b border-slate-100 dark:border-border last:border-none last:pb-0">
        <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <span class="material-symbols-rounded text-md">security</span>
        </div>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-xs font-bold text-main leading-tight truncate">Secure Session Key</span>
          <span class="text-[0.65rem] text-muted leading-relaxed">New session authenticated using 256-bit encryption.</span>
          <span class="text-[0.55rem] text-light font-bold mt-1 uppercase">1 day ago</span>
        </div>
      </div>
    </div>
    
    <div class="pt-2.5 border-t border-border text-center">
      <a href="#" class="text-[0.7rem] font-bold text-primary hover:text-primary-hover hover:underline">View all alerts</a>
    </div>
  `;

  // Make the parent of notifIcon relative so we can align the dropdown cleanly
  parent.style.position = "relative";
  parent.appendChild(dropdown);

  // Click toggle handler
  notifIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    // Close search dropdown if open
    const searchDropdown = document.querySelector("#globalSearchDropdown");
    if (searchDropdown) searchDropdown.classList.add("hidden");
    
    dropdown.classList.toggle("hidden");
    if (!dropdown.classList.contains("hidden")) {
      // Mark as read (hide red dot badge)
      badge.classList.add("hidden");
    }
  });

  // Clear all handler
  const btnClear = dropdown.querySelector("#btnClearNotifs");
  if (btnClear) {
    btnClear.addEventListener("click", (e) => {
      e.stopPropagation();
      const list = dropdown.querySelector("#notifItemsList");
      if (list) {
        list.innerHTML = `
          <div class="flex flex-col items-center justify-center py-6 text-center text-muted gap-2">
            <span class="material-symbols-rounded text-2xl text-light">notifications_off</span>
            <span class="text-xs italic">All notifications cleared.</span>
          </div>
        `;
      }
      badge.classList.add("hidden");
    });
  }

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!dropdown.classList.contains("hidden") && !dropdown.contains(e.target) && e.target !== notifIcon) {
      dropdown.classList.add("hidden");
    }
  });
}
