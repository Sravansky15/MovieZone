function registerUser() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
  
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
  
    localStorage.setItem("user", JSON.stringify({ username, password }));
    alert("Registration successful!");
    window.location.href = "login.html";
  }
  
  function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (storedUser && storedUser.username === username && storedUser.password === password) {
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Invalid username or password.");
    }
  }
  