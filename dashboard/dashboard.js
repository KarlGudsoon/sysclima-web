async function cargarPerfil() {
  try {
    const response = await fetch("/api/users/perfil");

    if (response.status === 401 || response.status === 403) {
      window.location.href = "/";
      return;
    }

    const data = await response.json();
    const usuario = data.usuario;

    document.getElementById("nav-username").textContent = usuario.username;
    document.getElementById("user-email").textContent = usuario.email;
    document.getElementById("user-rol").textContent = usuario.rol;
  } catch (err) {
    window.location.href = "/";
  }
}

async function cargarMensajes() {
  const contenedor = document.getElementById("lista-mensajes");
  contenedor.textContent = "";

  let mensajes = [];
  try {
    const response = await fetch("/api/contact/mensajes");

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = "/";
        return;
      }
      throw new Error("Error al cargar mensajes");
    }

    const data = await response.json();
    mensajes = data.mensajes || [];
  } catch (err) {
    contenedor.textContent = "No se pudieron cargar los mensajes.";
    return;
  }

  if (mensajes.length === 0) {
    contenedor.textContent = "No hay mensajes aún.";
    return;
  }

  mensajes.forEach((m) => {
    const card = document.createElement("div");
    card.className = "mensaje-card";

    const cabecera = document.createElement("p");
    const nombre = document.createElement("strong");
    nombre.textContent = m.nombre;
    cabecera.appendChild(nombre);
    cabecera.appendChild(document.createTextNode(" — " + m.email));

    const cuerpo = document.createElement("p");
    cuerpo.textContent = m.mensaje;

    const fecha = document.createElement("small");
    fecha.textContent = new Date(m.fecha).toLocaleString("es-CL");

    const acciones = document.createElement("div");
    const btn = document.createElement("button");
    btn.className = "btn-eliminar";
    btn.textContent = "Eliminar";
    btn.dataset.id = m.id;
    acciones.appendChild(btn);

    card.append(cabecera, cuerpo, fecha, acciones);
    contenedor.appendChild(card);
  });
}

async function eliminarMensaje(id) {
  try {
    const response = await fetch(`/api/contact/mensajes/${id}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      cargarMensajes();
    } else {
      const data = await response.json();
      console.error("Error al eliminar mensaje:", data.message);
    }
  } catch (err) {
    console.error("Error al eliminar mensaje:", err);
  }
}

document.getElementById("lista-mensajes").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar")) {
    eliminarMensaje(e.target.dataset.id);
  }
});

document.getElementById("btn-logout").addEventListener("click", async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (err) {
    // se cierra la sesión igual
  }
  window.location.href = "/";
});

cargarPerfil();
cargarMensajes();
