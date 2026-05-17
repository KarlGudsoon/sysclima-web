const token = localStorage.getItem("token");

if (!token) {
  // No hay token, redirige al login
  window.location.href = "/";
}

async function cargarPerfil() {
  const response = await fetch("/api/users/perfil", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    // Token expirado o inválido
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }

  const data = await response.json();
  const usuario = data.usuario;

  // Rellenas el HTML con los datos del usuario
  document.getElementById("nav-username").textContent = usuario.username;
  document.getElementById("user-email").textContent = usuario.email;
  document.getElementById("user-rol").textContent = usuario.rol;
}

async function cargarMensajes() {
  const response = await fetch("/api/contact/mensajes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  // Procesar los mensajes y mostrarlos en el dashboard

  const contenedor = document.getElementById("lista-mensajes");

  if (data.mensajes.length === 0) {
    contenedor.innerHTML = "<p>No hay mensajes aún.</p>";
    return;
  }

  // Genera un bloque HTML por cada mensaje
  contenedor.innerHTML = data.mensajes
    .map(
      (m) => `
    <div class="mensaje-card">
      <p><strong>${m.nombre}</strong> — ${m.email}</p>
      <p>${m.mensaje}</p>
      <small>${new Date(m.fecha).toLocaleString("es-CL")}</small>
      <div class="mensaje-actions">
        <button class="btn-eliminar" data-index="${data.mensajes.indexOf(m)}">Eliminar</button>
      </div>
    </div>
  `,
    )
    .join("");
}

async function eliminarMensaje(index) {
  const response = await fetch(`/api/contact/mensajes/${index}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 200) {
    // Mensaje eliminado con éxito
    cargarMensajes(); // Recargar la lista de mensajes
  } else {
    // Manejar error
    const data = await response.json();
    console.error("Error al eliminar mensaje:", data.message);
  }
}

document.getElementById("lista-mensajes").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar")) {
    const index = e.target.getAttribute("data-index");
    eliminarMensaje(index);
  }
});

document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/";
});

cargarPerfil();
cargarMensajes();
