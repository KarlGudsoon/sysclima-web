const TRABAJOS_URL = "/data/trabajos.json";
let trabajosPromise = null;

function cargarTrabajos() {
  if (!trabajosPromise) {
    trabajosPromise = fetch(TRABAJOS_URL)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar los trabajos");
        return res.json();
      })
      .then((data) => data.trabajos || []);
  }
  return trabajosPromise;
}

function crearTarjetaTrabajo(trabajo) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "item-trabajo";

  const img = document.createElement("img");
  img.className = "aspect-3/2 w-full rounded-2xl object-cover object-center";
  img.src = trabajo.imagenPortada;
  img.alt = trabajo.titulo;

  const cuerpo = document.createElement("div");
  cuerpo.className = "my-4 px-2";

  const titulo = document.createElement("span");
  titulo.className = "block w-full text-center font-bold";
  titulo.textContent = trabajo.titulo;

  const resumen = document.createElement("p");
  resumen.className = "text-center text-sm";
  resumen.textContent = trabajo.resumen;

  cuerpo.append(titulo, resumen);
  boton.append(img, cuerpo);

  boton.addEventListener("click", () => mostrarTrabajoEnModal(trabajo));

  return boton;
}

function mostrarTrabajoEnModal(trabajo) {
  const modal = document.getElementById("trabajoModal");
  if (!modal) return;

  const imagenPrincipal = document.getElementById("trabajo-modal-imagen");
  imagenPrincipal.src = trabajo.imagenPortada;
  imagenPrincipal.alt = trabajo.titulo;

  document.getElementById("trabajo-modal-titulo").textContent = trabajo.titulo;
  document.getElementById("trabajo-modal-ubicacion").textContent = [
    trabajo.ubicacion,
    trabajo.fecha,
  ]
    .filter(Boolean)
    .join(" · ");
  document.getElementById("trabajo-modal-descripcion").textContent =
    trabajo.descripcion;
  document.getElementById("trabajo-modal-link").href =
    `/pages/trabajo.html?id=${trabajo.id}`;

  const miniaturas = document.getElementById("trabajo-modal-miniaturas");
  miniaturas.innerHTML = "";
  for (const img of trabajo.galeria) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className =
      "size-16 overflow-hidden rounded-lg border-2 border-transparent transition hover:border-brand cursor-pointer";
    boton.innerHTML = `<img class="h-full w-full object-cover" src="${img}" alt="${trabajo.titulo}" />`;
    boton.addEventListener("click", () => {
      imagenPrincipal.src = img;
    });
    miniaturas.appendChild(boton);
  }

  document.getElementById("trabajo-modal-servicios").innerHTML =
    "<h4 class='font-bold'>Servicios realizados</h4><ul class='mt-2 space-y-1'>" +
    trabajo.servicios.map((s) => `<li>• ${s}</li>`).join("") +
    "</ul>";

  document.getElementById("trabajo-modal-detalles").innerHTML =
    "<h4 class='font-bold'>Detalles técnicos</h4><ul class='mt-2 space-y-1'>" +
    trabajo.detalles.map((d) => `<li>• ${d}</li>`).join("") +
    "</ul>";

  modal.showModal();
}

function initTrabajos() {
  const grid = document.getElementById("trabajos-grid");
  if (!grid) return;

  const modal = document.getElementById("trabajoModal");
  if (modal) {
    const cerrar = modal.querySelector('[command="close"]');
    if (cerrar) {
      cerrar.addEventListener("click", () => modal.close());
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.close();
    });
  }

  cargarTrabajos()
    .then((trabajos) => {
      grid.innerHTML = "";
      for (const trabajo of trabajos) {
        grid.appendChild(crearTarjetaTrabajo(trabajo));
      }
    })
    .catch(() => {
      grid.innerHTML =
        "<p class='text-center text-brand/60 col-span-full'>No se pudieron cargar los proyectos.</p>";
    });
}

function renderPaginaTrabajo(trabajo) {
  document.getElementById("trabajo-cargando").classList.add("hidden");
  document.getElementById("trabajo-contenido").classList.remove("hidden");

  document.title = `${trabajo.titulo} - SyS Climatización`;
  document.getElementById("trabajo-titulo").textContent = trabajo.titulo;
  document.getElementById("trabajo-ubicacion").textContent = [
    trabajo.ubicacion,
    trabajo.fecha,
  ]
    .filter(Boolean)
    .join(" · ");
  document.getElementById("trabajo-descripcion").textContent =
    trabajo.descripcion;

  document.getElementById("trabajo-servicios").innerHTML =
    "<h3 class='text-xl font-bold mb-3'>Servicios realizados</h3><ul class='space-y-1'>" +
    trabajo.servicios.map((s) => `<li>• ${s}</li>`).join("") +
    "</ul>";

  document.getElementById("trabajo-detalles").innerHTML =
    "<h3 class='text-xl font-bold mb-3'>Detalles técnicos</h3><ul class='space-y-1'>" +
    trabajo.detalles.map((d) => `<li>• ${d}</li>`).join("") +
    "</ul>";

  const galeria = document.getElementById("trabajo-galeria");
  galeria.innerHTML = "";
  for (const img of trabajo.galeria) {
    const contenedor = document.createElement("div");
    contenedor.className = "galeria-img";

    const imagen = document.createElement("img");
    imagen.src = img;
    imagen.alt = trabajo.titulo;

    contenedor.appendChild(imagen);
    galeria.appendChild(contenedor);
  }
}

function initPaginaTrabajo() {
  const detalle = document.getElementById("trabajo-detalle");
  if (!detalle) return;

  const id = Number(new URLSearchParams(location.search).get("id"));

  cargarTrabajos()
    .then((trabajos) => {
      const trabajo = trabajos.find((t) => t.id === id);
      if (!trabajo) throw new Error("Proyecto no encontrado");
      renderPaginaTrabajo(trabajo);
    })
    .catch(() => {
      document.getElementById("trabajo-cargando").classList.add("hidden");
      document.getElementById("trabajo-error").classList.remove("hidden");
    });
}

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

initTrabajos();
initPaginaTrabajo();
