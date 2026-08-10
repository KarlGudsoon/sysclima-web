document
  .getElementById("contact-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("contact-nombre").value;
    const email = document.getElementById("contact-email").value;
    const mensaje = document.getElementById("contact-mensaje").value;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje(data.message, "exito");
        document.getElementById("contact-form").reset();
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
