// Toggle between Sign In and Sign Up
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton?.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton?.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Handle Sign In Form Submission
const signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  
  // Check if credentials match admin/admin
  if (email === "admin" && password === "admin") {
    // Show success animation
    showSuccessMessage("Admin Login Successful!");
    
    // Redirect to admin dashboard after short delay
    setTimeout(() => {
      window.location.href = "AdminDashboard.html";
    }, 1500);
  } 
  // Check if credentials match user/user
  else if (email === "user" && password === "user") {
    // Show success animation
    showSuccessMessage("User Login Successful!");
    
    // Redirect to user portal after short delay
    setTimeout(() => {
      window.location.href = "Userportal.html";
    }, 1500);
  }
  else {
    // Show error message
    showErrorMessage();
  }
  
});

// Handle Sign Up Form Submission
const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showInfoMessage("Sign up functionality coming soon!");
});

// Success Message
function showSuccessMessage(text = "Login successful! Redirecting...") {
  const message = document.createElement("div");
  message.className = "toast-message success";
  message.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${text}</span>
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add("show");
  }, 100);
  
  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => message.remove(), 300);
  }, 2000);
}

// Error Message
function showErrorMessage() {
  const message = document.createElement("div");
  message.className = "toast-message error";
  message.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>Invalid credentials! Try admin/admin or user/user</span>
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add("show");
  }, 100);
  
  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

// Info Message
function showInfoMessage(text) {
  const message = document.createElement("div");
  message.className = "toast-message info";
  message.innerHTML = `
    <i class="fas fa-info-circle"></i>
    <span>${text}</span>
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add("show");
  }, 100);
  
  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

// Add toast message styles dynamically
const style = document.createElement("style");
style.textContent = `
  .toast-message {
    position: fixed;
    top: 30px;
    right: 30px;
    background: white;
    padding: 18px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .toast-message.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .toast-message i {
    font-size: 20px;
  }
  
  .toast-message.success {
    border-left: 4px solid #48bb78;
  }
  
  .toast-message.success i {
    color: #48bb78;
  }
  
  .toast-message.error {
    border-left: 4px solid #f56565;
  }
  
  .toast-message.error i {
    color: #f56565;
  }
  
  .toast-message.info {
    border-left: 4px solid #4299e1;
  }
  
  .toast-message.info i {
    color: #4299e1;
  }
`;
document.head.appendChild(style);