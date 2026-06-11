import { auth } from "./services/api.js";
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const submitBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating Account...";
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update user profile display name
    await updateProfile(userCredential.user, {
      displayName: name
    });
    
    alert("Registration successful! Welcome to the Sovereign Ledger.");
    localStorage.setItem("sovereign_logged_in", "true");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Registration failed: ", error);
    if (error.code === "auth/configuration-not-found") {
      const useDemo = confirm("Firebase Authentication is not enabled for this project yet.\n\nWould you like to run in Demo/Local Storage mode for testing?");
      if (useDemo) {
        localStorage.setItem("sovereign_demo_user", JSON.stringify({ email, displayName: name }));
        window.location.href = "index.html";
        return;
      }
    }
    alert("Registration failed: " + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  }
});
