// ==========================================
// 1. VERIFICAR TOKEN AL CARGAR LA PÁGINA
// ==========================================

const token = localStorage.getItem("token");

if (!token) {
  // No hay token, redirige al login
  window.location.href = "/";
}

// ==========================================
// 2. CARGAR DATOS DEL USUARIO
// ==========================================

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

// ==========================================
// 3. CERRAR SESIÓN
// ==========================================

document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/";
});

// ==========================================
// 4. INICIALIZAR
// ==========================================

cargarPerfil();
