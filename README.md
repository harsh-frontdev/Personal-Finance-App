# 🏛️ The Sovereign Ledger

![Status: Deployed](https://img.shields.io/badge/Status-Deployed-success)
![Platform: Netlify](https://img.shields.io/badge/Platform-Netlify-00C7B7)

**The Sovereign Ledger** is a premium, full-stack wealth management dashboard designed for absolute financial clarity. It combines a high-performance **Vanilla JavaScript** frontend (styled with **Tailwind CSS v4** and animated via **GSAP**) with a flexible backend supporting both **Firebase/Firestore** authentication/persistence and a local-first **Demo Mode**.

## 🌐 Live Application
The application is deployed and accessible at:
👉 **[https://thesovereignledger.netlify.app](https://thesovereignledger.netlify.app)**

---

## 💎 The Vision
Most trackers feel like chores. **The Sovereign Ledger** is designed to feel like an asset. By utilizing complex scroll-triggered animations and a minimalist "Dark Mode" aesthetic, it treats your personal data with the architectural respect of a private bank.

---

## 🚀 Core Features

*   **Dynamic Data Skeleton Screens:** High-fidelity, text-less pulsing loading states (`animate-pulse`) match the visual structure of your accounts, budgets, goals, and reports while data is fetched, ensuring a premium loading transition without flashes of dummy data.
*   **Dedicated Alert Center:** Real-time budget monitoring (warning alerts at 80% consumption, critical over-limit warnings at 100%), large transaction logs (customizable ₹50,000 threshold), automated AI advisor pacing checks, and system security alerts with localStorage-backed dismiss state.
*   **Custom Profile Photo Update:** Instant base64 profile picture updates saved to local storage for demo sessions, and synced directly with Firebase Auth profiles for active live users.
*   **Persistent Transaction Engine:** Full CRUD operations synced with **Firebase/Firestore** or local storage.
*   **Debit/Credit Entry Polarity:** Explicit form toggle in the transaction registration modal automatically applies correct mathematical sign and currency color schemes.
*   **Modern Styling:** Built with **Tailwind CSS v4**, leveraging CSS variables and high-speed utility processing.
*   **Cinematic UI:** Integrated **GSAP (GreenSock)** for sticky card stacking and smooth expansion effects.
*   **Modular Architecture:** Structured split between API/Store state management, dynamic UI components, and static layout files.

---

## 🛠️ Tech Stack

### **Frontend**
*   **Language:** Vanilla JavaScript (ES6+ Modules)
*   **Styles:** Tailwind CSS v4 (CLI compiled)
*   **Animation:** GSAP 3.x (GreenSock Animation Platform)
*   **Icons:** Google Material Symbols (Rounded)

### **Authentication & Persistence**
*   **Platform:** Firebase v10 Auth & Firestore Database
*   **Local Engine:** HTML5 LocalStorage fallback (for Demo Mode)

### **Hosting & Deployment**
*   **Hosting:** Netlify (Production Branch)
*   **Dev Server:** `live-server`

---

## 📂 Project Structure

```text
/The-Sovereign-Ledger
├── /public                # Client-facing assets
│   ├── /css               # Tailwind input/output (main.css)
│   ├── /js                # State management, API calls, and components
│   │   ├── /components    # Modular UI elements (transactionTable, detailSidebar, globalSearch)
│   │   ├── /services      # API interfaces (api.js, store.js)
│   │   └── app.js         # Entry point for dynamic script routing
│   ├── /assets            # Logos, favicons, and branding
│   ├── index.html         # Main Private Wealth Dashboard
│   ├── transaction.html   # Full Ledger & Metadata Sidebar
│   ├── budgets.html       # Spending thresholds and AI advisor warnings
│   ├── accounts.html      # Asset types & balances
│   ├── reports.html       # Net income and spending velocity gauges
│   ├── goals.html         # Stashes and targets
│   ├── settings.html      # User preferences and profile credentials
│   └── alerts.html        # Dedicated Alert Center for budget warnings and logs
├── postcss.config.js      # Style compilation
├── tailwind.config.js     # Tailwind configurations
└── package.json           # Scripts & Dependencies
```

---

## 🚀 Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/harsh-frontdev/The-Sovereign-Ledger.git
    cd The-Sovereign-Ledger
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the local development server:**
    ```bash
    npm start
    ```
    This launches `live-server` serving the `/public` folder on port `5001`.

4.  **Compile CSS changes (Tailwind):**
    ```bash
    npm run build
    ```
