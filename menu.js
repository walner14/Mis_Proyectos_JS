

function mostrarProyecto(rutaHTML) {
  const contenido = document.getElementById('contenido');
  contenido.innerHTML = `
    <button onclick="volverAlMenu()">🔙 Volver</button>
    <iframe src="${rutaHTML}" loading="lazy"></iframe>
  `;
}

function volverAlMenu() {
  const contenido = document.getElementById('contenido');
  contenido.innerHTML = `<p>Selecciona un proyecto para cargarlo aquí 👇</p>`;
}
