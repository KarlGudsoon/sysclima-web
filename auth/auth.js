document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      mostrarMensaje(data.message, response.status === 201 ? "exito" : "error");
      document.getElementById("register-form").reset();
    } catch (err) {
      mostrarMensaje("Error de conexión, intenta de nuevo", "error");
    }
  });

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      mostrarMensaje(data.message, "error");
    }
  } catch (err) {
    mostrarMensaje("Error de conexión, intenta de nuevo", "error");
  }
});

function mostrarMensaje(mensaje, tipo) {
  const mensajeElement = document.getElementById("mensaje");
  mensajeElement.textContent = mensaje;
  mensajeElement.classList.add("mostrar");
  mensajeElement.classList.add(tipo);
  setTimeout(() => {
    mensajeElement.classList.remove("mostrar");
    mensajeElement.classList.remove(tipo);
  }, 2000);
}
