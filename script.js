// ✅ Fully Integrated Login & Signup System (Updated for Deployment)
// 📁 Place inside <script> tag or external JS file (script.js)

function toggleMenu() {
  const menu = document.querySelector("nav ul");
  menu.classList.toggle("show");
}

window.toggleMenu = toggleMenu;

function showNotification(message, type = 'success') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) existingNotification.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    ${message}
    <button class="close-notification">&times;</button>
  `;

  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => hideNotification(notification), 4000);

  const closeBtn = notification.querySelector('.close-notification');
  closeBtn.addEventListener('click', () => hideNotification(notification));
}

function hideNotification(notification) {
  notification.classList.remove('show');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameSpan = document.getElementById("userName");

  checkLoginStatus();

  loginBtn.addEventListener("click", showLoginModal);
  logoutBtn.addEventListener("click", logout);

  function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    user ? showLoggedInState(user) : showLoggedOutState();
  }

  function showLoggedInState(user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    userNameSpan.style.display = "inline-block";
    userNameSpan.textContent = `Welcome, ${user.name}`;
    userNameSpan.style.color = "#333";
    userNameSpan.style.marginLeft = "1rem";
    userNameSpan.style.fontWeight = "600";
  }

  function showLoggedOutState() {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userNameSpan.style.display = "none";
  }

  function showLoginModal() {
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Login to QuickRent</h2>
          <span class="close-modal">&times;</span>
        </div>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit" class="login-submit-btn">Login</button>
          <p class="signup-link">Don't have an account? <a href="#" id="showSignup">Sign up</a></p>
        </form>
        <form id="signupForm" style="display: none;">
          <div class="form-group">
            <label for="signupName">Full Name:</label>
            <input type="text" id="signupName" required />
          </div>
          <div class="form-group">
            <label for="signupEmail">Email:</label>
            <input type="email" id="signupEmail" required />
          </div>
          <div class="form-group">
            <label for="signupPassword">Password:</label>
            <input type="password" id="signupPassword" required />
          </div>
          <div class="form-group">
            <label for="signupPhone">Phone:</label>
            <input type="tel" id="signupPhone" required />
          </div>
          <button type="submit" class="login-submit-btn">Sign Up</button>
          <p class="signup-link">Already have an account? <a href="#" id="showLogin">Login</a></p>
        </form>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeModal = modalOverlay.querySelector(".close-modal");
    const loginForm = modalOverlay.querySelector("#loginForm");
    const signupForm = modalOverlay.querySelector("#signupForm");
    const showSignupLink = modalOverlay.querySelector("#showSignup");
    const showLoginLink = modalOverlay.querySelector("#showLogin");

    closeModal.onclick = () => document.body.removeChild(modalOverlay);
    modalOverlay.addEventListener("click", e => {
      if (e.target === modalOverlay) document.body.removeChild(modalOverlay);
    });

    showSignupLink.onclick = (e) => {
      e.preventDefault();
      loginForm.style.display = "none";
      signupForm.style.display = "block";
    };

    showLoginLink.onclick = (e) => {
      e.preventDefault();
      signupForm.style.display = "none";
      loginForm.style.display = "block";
    };

    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("https://quickrent-backend.onrender.com/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const result = await res.json();
        if (res.ok) {
          localStorage.setItem("currentUser", JSON.stringify(result.user));
          showLoggedInState(result.user);
          document.body.removeChild(modalOverlay);
          showNotification("Login successful!", "success");
        } else {
          showNotification(`❌ ${result.error}`, "error");
        }
      } catch (err) {
        showNotification("❌ Login failed due to server error.", "error");
      }
    };

    signupForm.onsubmit = async (e) => {
      e.preventDefault();

      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const phone = document.getElementById("signupPhone").value;

      try {
        const res = await fetch("https://quickrent-backend.onrender.com/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone })
        });

        const result = await res.json();
        if (res.ok) {
          showNotification("✅ Signup successful! You can now log in.", "success");
          signupForm.reset();
          signupForm.style.display = "none";
          loginForm.style.display = "block";
        } else {
          showNotification(`❌ ${result.error}`, "error");
        }
      } catch (err) {
        showNotification("❌ Signup failed due to server error.", "error");
      }
    };
  }

  function logout() {
    localStorage.removeItem("currentUser");
    showLoggedOutState();
    showNotification("You have been logged out.", "success");
  }
});