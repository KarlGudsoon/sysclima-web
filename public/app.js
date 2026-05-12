document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // evita que recargue la página

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    document.getElementById("mensaje").textContent = data.message;
  });

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // Login exitoso — guardas el token y redirigues
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard"; // la página protegida
  } else {
    // Login fallido — muestras el error
    document.getElementById("mensaje-login").textContent = data.message;
  }

  document.getElementById("mensaje-login").textContent = data.message;
});

document
  .getElementById("contact-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("contact-nombre").value;
    const email = document.getElementById("contact-email").value;
    const mensaje = document.getElementById("contact-mensaje").value;

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, mensaje }),
    });

    const data = await response.json();
    document.getElementById("mensaje-contacto").textContent = data.message;
  });
