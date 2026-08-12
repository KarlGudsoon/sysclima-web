const contactoForm = document.getElementById("contact-form");

if (contactoForm) {
  contactoForm.addEventListener("submit", async (e) => {
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
        mostrarExitoForm();
        document.getElementById("contact-form").reset();
      } else {
        mostrarMensaje(data.message, "error");
      }
    } catch (err) {
      mostrarMensaje("Error de conexión, intenta de nuevo", "error");
    }
  });
}

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

function mostrarExitoForm() {
  const contenedor = document.getElementById("contenedorForm");

  const contenedorExito = document.createElement("div");

  contenedorExito.className =
    "w-full h-full bg-green-600 text-white absolute top-0 left-0 flex justify-center items-center rounded-3xl clip-path";

  contenedorExito.innerHTML = `
    <div class="text-center p-6">
      <div class="text-5xl mb-4 flex justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="currentColor" d="M19 9.09V6c0-.55-.45-1-1-1h-3.09L12.7 2.79a.996.996 0 0 0-1.41 0L9.08 5H5.99c-.55 0-1 .45-1 1v3.09L2.78 11.3a.996.996 0 0 0 0 1.41l2.21 2.21v3.09c0 .55.45 1 1 1h3.09l2.21 2.21c.2.2.45.29.71.29s.51-.1.71-.29l2.21-2.21h3.09c.55 0 1-.45 1-1v-3.09l2.21-2.21a.996.996 0 0 0 0-1.41l-2.21-2.21Zm-8 6.33l-2.71-2.71L9.7 11.3l1.29 1.29l3.29-3.29l1.41 1.41l-4.71 4.71Z" />
      </svg>
      </div>
      <h3 class="text-2xl font-semibold mb-2">
        ¡Formulario enviado!
      </h3>
      <p>
        Hemos recibido tu solicitud correctamente.
      </p>
    </div>
  `;

  contenedor.appendChild(contenedorExito);
}
