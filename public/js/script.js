const boton = document.getElementById("btnMensaje");

boton.addEventListener("click", function () {
  alert("Este sitio aplica buenas prácticas de optimización y usabilidad.");
});

const botonComentario = document.getElementById("btnComentario");

botonComentario.addEventListener("click", mostrarComentario);

function mostrarComentario() {
  // Obtenemos el valor ingresado por el usuario

  const comentario = document.getElementById("comentario").value;

  // Usamos textContent en lugar de innerHTML.

  // textContent muestra el texto como texto plano,

  // evitando que se ejecute código HTML o JavaScript malicioso.

  document.getElementById("resultado").textContent = comentario;
}
