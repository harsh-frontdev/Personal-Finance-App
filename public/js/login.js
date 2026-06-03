import { auth } from "./services/api.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
    alert("Login failed: " + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign In to Ledger";
  }
});
