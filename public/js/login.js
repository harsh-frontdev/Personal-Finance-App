import { auth } from "./services/api.js";
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { showToast } from "./components/toast.js";

onAuthStateChanged(auth, (user) => {
  const demoUser = localStorage.getItem("sovereign_demo_user");
  if (user || demoUser) {
    localStorage.setItem("sovereign_logged_in", "true");
    window.location.replace("index.html");
  } else {
    localStorage.removeItem("sovereign_logged_in");
  }
});

const form = document.querySelector("form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const submitBtn = form.querySelector("button[type='submit']");

// Show/hide password functionality
const toggleBtn = form.querySelector("button[type='button']");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    toggleBtn.querySelector("span").textContent = isPassword ? "visibility_off" : "visibility";
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing In...";
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("sovereign_logged_in", "true");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login failed: ", error);
    if (error.code === "auth/configuration-not-found") {
      const useDemo = confirm("Firebase Authentication is not enabled for this project yet.\n\nWould you like to run in Demo/Local Storage mode for testing?");
      if (useDemo) {
        localStorage.setItem("sovereign_demo_user", JSON.stringify({ email, displayName: email.split('@')[0] }));
        window.location.href = "index.html";
        return;
      }
    }
    
    // Custom friendly alerts based on Firebase Auth error codes
    let friendlyMessage = "Login failed. Please verify your credentials.";
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-email" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      friendlyMessage = "This user does not exist or the password does not match the account.";
    } else if (error.code === "auth/too-many-requests") {
      friendlyMessage = "Too many failed login attempts. Access has been temporarily suspended.";
    } else if (error.code === "auth/user-disabled") {
      friendlyMessage = "This user account has been disabled.";
    }
    
    showToast(friendlyMessage, "error");
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign In to Ledger";
  }
});

// Forgot password modal elements
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const btnOpenForgotPassword = document.getElementById("btnOpenForgotPassword");
const btnCloseForgotPasswordX = document.getElementById("btnCloseForgotPasswordX");
const btnCancelForgotPassword = document.getElementById("btnCancelForgotPassword");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordEmailInput = document.getElementById("forgotPasswordEmail");
const btnConfirmForgotPassword = document.getElementById("btnConfirmForgotPassword");

if (btnOpenForgotPassword) {
  btnOpenForgotPassword.addEventListener("click", (e) => {
    e.preventDefault();
    if (forgotPasswordForm) {
      forgotPasswordForm.reset();
    }
    if (emailInput && emailInput.value.trim() && forgotPasswordEmailInput) {
      forgotPasswordEmailInput.value = emailInput.value.trim();
    }
    if (forgotPasswordModal) {
      forgotPasswordModal.classList.remove("hidden");
      forgotPasswordModal.classList.add("flex");
    }
  });
}

const closeForgotPassword = () => {
  if (forgotPasswordModal) {
    forgotPasswordModal.classList.add("hidden");
    forgotPasswordModal.classList.remove("flex");
  }
};

if (btnCloseForgotPasswordX) btnCloseForgotPasswordX.addEventListener("click", closeForgotPassword);
if (btnCancelForgotPassword) btnCancelForgotPassword.addEventListener("click", closeForgotPassword);

if (forgotPasswordModal) {
  forgotPasswordModal.addEventListener("click", (e) => {
    if (e.target === forgotPasswordModal) {
      closeForgotPassword();
    }
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = forgotPasswordEmailInput.value.trim();
    if (!email) return;

    btnConfirmForgotPassword.disabled = true;
    btnConfirmForgotPassword.textContent = "Sending...";

    const demoUser = JSON.parse(localStorage.getItem("sovereign_demo_user"));

    try {
      await sendPasswordResetEmail(auth, email);
      showToast("A secure password reset link has been sent to your email address.", "success");
      closeForgotPassword();
    } catch (error) {
      console.error("Password reset failed: ", error);
      if (error.code === "auth/configuration-not-found" || demoUser) {
        showToast("Demo Mode: Simulated password recovery link sent successfully.", "success");
        closeForgotPassword();
      } else {
        let friendlyMessage = "Failed to send reset email. Please try again.";
        if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
          friendlyMessage = "This user account does not exist.";
        } else if (error.code === "auth/invalid-credential") {
          friendlyMessage = "Invalid credentials. The user does not exist.";
        }
        showToast(friendlyMessage, "error");
      }
    } finally {
      btnConfirmForgotPassword.disabled = false;
      btnConfirmForgotPassword.textContent = "Send Reset Link";
    }
  });
}
