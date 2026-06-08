import { getData } from "../services/api.js";

// Global Search Component Initialization
document.addEventListener("DOMContentLoaded", () => {
  initGlobalSearch();
  initDarkMode();
  initNotifications();
  initDynamicCategoryRadios();
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

async function initNotifications() {
  const notifIcon = Array.from(document.querySelectorAll('header span.material-symbols-rounded')).find(el => el.textContent.trim() === 'notifications');
  if (!notifIcon) return;

  const parent = notifIcon.parentElement;
  if (!parent) return;

  // Style icon for relative positioning to overlay the badge
  notifIcon.style.position = "relative";
  notifIcon.classList.add("cursor-pointer");
  
  // Inject the red badge dot/count
  const badge = document.createElement("span");
  badge.className = "absolute top-[-5px] right-[-5px] min-w-[16px] h-[16px] px-1 bg-danger text-white rounded-full border border-white dark:border-[#0b120f] flex items-center justify-center text-[9px] font-bold leading-none hidden z-10 animate-pulse";
  notifIcon.appendChild(badge);

  // Create the absolute dropdown element
  const dropdown = document.createElement("div");
  dropdown.id = "notificationDropdownContainer";
  dropdown.className = "absolute right-0 top-12 w-[360px] bg-white/90 dark:bg-[#0b120f]/90 backdrop-blur-xl border border-slate-100 dark:border-[#182420] ring-1 ring-slate-900/5 dark:ring-white/5 rounded-2xl shadow-2xl p-5 hidden flex-col gap-4 z-[999] animate-fade-in-up text-main";
  
  dropdown.innerHTML = `
    <div class="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-[#182420]">
      <div class="flex items-center gap-2">
        <h4 class="text-[0.68rem] font-extrabold font-manrope uppercase tracking-[0.12em] text-muted dark:text-slate-400">Notifications</h4>
        <span id="notifCountBadge" class="px-2 py-0.5 text-[0.6rem] font-bold rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-hover hidden">0</span>
      </div>
      <button id="btnClearNotifs" class="text-[0.68rem] font-bold text-muted hover:text-danger cursor-pointer outline-none transition-colors">Clear all</button>
    </div>
    
    <div class="flex flex-col gap-0 max-h-[260px] overflow-y-auto py-2 pr-1" id="notifItemsList">
      <div class="flex items-center justify-center py-6 text-center text-muted gap-2">
        <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs font-medium">Checking ledger...</span>
      </div>
    </div>
    
    <div class="pt-3 border-t border-slate-100 dark:border-[#182420]">
      <a href="alerts.html" class="block w-full py-2 text-center text-[0.7rem] font-bold text-primary dark:text-primary-hover bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 rounded-xl transition-all border border-slate-100 dark:border-slate-800/40">View all alerts</a>
    </div>
  `;

  parent.style.position = "relative";
  parent.appendChild(dropdown);

  // State variable to hold active alerts in dropdown
  let activeAlerts = [];

  // Function to refresh the dropdown content
  async function refreshDropdownAlerts() {
    try {
      const res = await getData();
      if (!res || !res.success) {
        renderEmptyState();
        return;
      }
      const transactions = res.data || [];
      // Budget limits definition matching global standards (loading custom overrides if set)
      const savedLimits = JSON.parse(localStorage.getItem("sovereign_budget_limits")) || {};
      const defaultCategories = [
        { value: "Groceries", label: "Groceries", icon: "shopping_basket" },
        { value: "Dining", label: "Dining", icon: "restaurant" },
        { value: "Transport", label: "Transport", icon: "directions_car" },
        { value: "Rent", label: "Rent", icon: "home" }
      ];

      const savedCats = localStorage.getItem("sovereign_categories");
      let activeCategories = defaultCategories;
      if (savedCats) {
        try {
          activeCategories = JSON.parse(savedCats);
        } catch (e) {
          console.warn("Failed to parse dynamic categories in notifications.");
        }
      }

      const defaultLimits = {
        Rent: 45000,
        Dining: 5000,
        Groceries: 8000,
        Transport: 3000
      };

      const budgetLimits = {};
      const categorySpends = {};
      activeCategories.forEach(cat => {
        const val = cat.value;
        budgetLimits[val] = savedLimits[val] || defaultLimits[val] || 10000;
        categorySpends[val] = 0;
      });
      
      transactions.forEach(t => {
        const cat = t.category;
        const amt = Number(t.amount || 0);
        if (cat in categorySpends && amt < 0) {
          categorySpends[cat] += Math.abs(amt);
        }
      });

      const alerts = [];
      const dismissedAlertIds = JSON.parse(localStorage.getItem("sovereign_dismissed_alerts")) || [];
      const settings = JSON.parse(localStorage.getItem("sovereign_settings")) || {};

      // Budget alerts
      for (const [cat, limit] of Object.entries(budgetLimits)) {
        const spent = categorySpends[cat];
        const pct = Math.round((spent / limit) * 100);

        if (spent > limit) {
          alerts.push({
            id: `budget_crit_${cat}`,
            type: "budget",
            level: "critical",
            title: `${cat} Overlimit`,
            desc: `Spent ₹${spent.toLocaleString("en-IN")} / ₹${limit.toLocaleString("en-IN")}.`,
            time: "Just now",
            icon: "error",
            iconClass: "bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300"
          });
        } else if (spent > 0.8 * limit && settings.toggleBudgetAl === true) {
          alerts.push({
            id: `budget_warn_${cat}`,
            type: "budget",
            level: "warning",
            title: `${cat} High Usage`,
            desc: `Consumed ${pct}% of your limit.`,
            time: "1h ago",
            icon: "warning",
            iconClass: "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300"
          });
        }
      }

      // Large transactions
      const threshold = settings.toggleLargeTrans !== false ? 50000 : 99999999;
      
      transactions.forEach(t => {
        const amt = Math.abs(Number(t.amount || 0));
        if (amt >= threshold) {
          alerts.push({
            id: `trans_${t.id || t.date}`,
            type: "transaction",
            level: "info",
            title: "Large Transaction",
            desc: `₹${amt.toLocaleString("en-IN")} on ${t.description || "Uncategorized"}.`,
            time: "Today",
            icon: "info",
            iconClass: "bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300"
          });
        }
      });

      // AI insights
      alerts.push({
        id: "ai_insight_saving",
        type: "ai",
        level: "success",
        title: "Savings Velocity",
        desc: "Monthly savings target projections are stable.",
        time: "Yesterday",
        icon: "check_circle",
        iconClass: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300"
      });

      // Security updates
      if (localStorage.getItem("sovereign_settings")) {
        alerts.push({
          id: "sec_settings_updated",
          type: "security",
          level: "info",
          title: "Settings Updated",
          desc: "Primary workspace preferences were updated.",
          time: "2d ago",
          icon: "security",
          iconClass: "bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300"
        });
      }

      // Filter out dismissed alerts
      activeAlerts = alerts.filter(a => !dismissedAlertIds.includes(a.id));
      renderAlertsList();
    } catch (err) {
      console.warn("Failed to compile dropdown alerts: ", err);
      renderEmptyState();
    }
  }

  function renderAlertsList() {
    const list = dropdown.querySelector("#notifItemsList");
    if (!list) return;

    list.innerHTML = "";

    const countBadge = dropdown.querySelector("#notifCountBadge");

    if (activeAlerts.length === 0) {
      renderEmptyState();
      badge.classList.add("hidden");
      badge.textContent = "";
      if (countBadge) {
        countBadge.classList.add("hidden");
        countBadge.textContent = "0";
      }
      return;
    }

    // Update the notification badge
    badge.textContent = activeAlerts.length;
    badge.classList.remove("hidden");

    if (countBadge) {
      countBadge.textContent = activeAlerts.length;
      countBadge.classList.remove("hidden");
    }

    // Only show top 3 alerts in dropdown to keep it compact
    activeAlerts.slice(0, 3).forEach(alert => {
      const item = document.createElement("a");
      item.href = "alerts.html";
      item.className = "flex gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-main transition-all border border-transparent hover:border-slate-100/80 dark:hover:border-slate-800/40 cursor-pointer group mb-1.5 last:mb-0";
      item.innerHTML = `
        <div class="w-8 h-8 rounded-lg ${alert.iconClass} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
          <span class="material-symbols-rounded text-md">${alert.icon}</span>
        </div>
        <div class="flex flex-col gap-0.5 min-w-0 flex-1">
          <div class="flex justify-between items-baseline gap-2">
            <span class="text-xs font-bold text-main leading-tight truncate group-hover:text-primary dark:group-hover:text-primary-hover transition-colors">${alert.title}</span>
            <span class="text-[0.55rem] text-light font-bold uppercase tracking-wider shrink-0">${alert.time}</span>
          </div>
          <span class="text-[0.65rem] text-muted dark:text-slate-400 leading-relaxed truncate">${alert.desc}</span>
        </div>
      `;
      list.appendChild(item);
    });
  }

  function renderEmptyState() {
    const list = dropdown.querySelector("#notifItemsList");
    if (list) {
      list.innerHTML = `
        <div class="flex flex-col items-center justify-center py-6 text-center text-muted gap-2 animate-fade-in">
          <span class="material-symbols-rounded text-2xl text-light">notifications_off</span>
          <span class="text-xs italic">No active notifications.</span>
        </div>
      `;
    }
  }

  // Load dropdown data initially
  await refreshDropdownAlerts();

  // Click toggle handler
  notifIcon.addEventListener("click", async (e) => {
    e.stopPropagation();
    // Close search dropdown if open
    const searchDropdown = document.querySelector("#global-search-dropdown");
    if (searchDropdown) searchDropdown.classList.add("hidden");
    
    // Refresh alerts dynamic data on open
    if (dropdown.classList.contains("hidden")) {
      await refreshDropdownAlerts();
    }
    
    dropdown.classList.toggle("hidden");
  });

  // Clear all handler
  const btnClear = dropdown.querySelector("#btnClearNotifs");
  if (btnClear) {
    btnClear.addEventListener("click", (e) => {
      e.stopPropagation();
      const dismissedAlertIds = JSON.parse(localStorage.getItem("sovereign_dismissed_alerts")) || [];
      activeAlerts.forEach(a => {
        if (!dismissedAlertIds.includes(a.id)) {
          dismissedAlertIds.push(a.id);
        }
      });
      localStorage.setItem("sovereign_dismissed_alerts", JSON.stringify(dismissedAlertIds));
      
      activeAlerts = [];
      renderAlertsList();
      
      // If the current page is alerts.html, refresh it too to sync UI
      if (window.location.pathname.endsWith("alerts.html")) {
        window.location.reload();
      }
    });
  }

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!dropdown.classList.contains("hidden") && !dropdown.contains(e.target) && e.target !== notifIcon) {
      dropdown.classList.add("hidden");
    }
  });
}

function initDynamicCategoryRadios() {
  const container = document.getElementById("category-radio");
  if (!container) return;

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
      console.warn("Failed to parse dynamic categories, falling back to defaults.");
    }
  } else {
    localStorage.setItem("sovereign_categories", JSON.stringify(defaultCategories));
  }

  container.innerHTML = "";
  categories.forEach((cat, idx) => {
    const isChecked = idx === 0 ? "checked" : "";
    const radioHTML = `
      <label class="flex-1 cursor-pointer min-w-[90px]">
        <input type="radio" name="category" value="${cat.value}" class="peer hidden" ${isChecked} required>
        <div class="h-full bg-slate-50 dark:bg-[#101a15] border border-slate-100 text-main text-[0.7rem] font-semibold rounded-lg py-3 px-2 flex flex-col items-center gap-1.5 peer-checked:bg-primary peer-checked:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
          <span class="material-symbols-rounded text-sm">${cat.icon}</span>
          <span>${cat.label}</span>
        </div>
      </label>
    `;
    container.insertAdjacentHTML("beforeend", radioHTML);
  });
}
