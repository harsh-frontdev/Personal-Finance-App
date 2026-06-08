import { auth } from "./services/api.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { showToast } from "./components/toast.js";

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
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
      friendlyMessage = "This user account does not exist.";
    } else if (error.code === "auth/wrong-password") {
      friendlyMessage = "The password does not match the account.";
    } else if (error.code === "auth/invalid-credential") {
      friendlyMessage = "Invalid credentials. The user does not exist or the password does not match the account.";
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
