const seccionCorrelativas = document.getElementById("correlativas");

fetch("data/correlativas.json")
  .then(function(respuesta) {
    return respuesta.json();
  })
  .then(function(datos) {
    renderizarCorrelativas(datos.correlativas);
  });

function renderizarCorrelativas(lista) {
  let html = "<h2>Correlativas</h2>";
  html += "<p>Las correlativas son requisitos académicos que establecen un orden obligatorio para cursar o rendir las materias.</p>";

  html += `
    <h3>¿Cómo funcionan?</h3>
    <div class="cards">
      <div class="card"><h3>Para cursar</h3><p>Necesitás tener <strong>aprobada</strong> la correlativa antes de inscribirte.</p></div>
      <div class="card"><h3>Para rendir</h3><p>En algunos casos alcanza con tenerla <strong>regularizada</strong> para poder rendir el final.</p></div>
      <div class="card"><h3>Efecto encadenado</h3><p>No aprobar una materia puede bloquearte <strong>varias materias</strong> a la vez.</p></div>
      <div class="card"><h3>Planificación</h3><p>Revisar las correlativas te permite organizar tu <strong>cursada anual</strong> sin sorpresas.</p></div>
    </div>
  `;

  html += "<h3>Tabla de correlativas</h3>";

  lista.forEach(function(materia) {
    const tieneRequisitos = materia.requiere.length > 0;
    const badgeClass = tieneRequisitos ? "badge-req" : "badge-libre";
    const badgeTexto = tieneRequisitos ? materia.requiere.length + " requerida/s" : "Sin correlativas";
    const numClass = tieneRequisitos ? "" : "libre";

    let pillsHTML = "";
    if (tieneRequisitos) {
      pillsHTML = `<p class="corr-label">Necesitás tener aprobada</p>`;
      materia.requiere.forEach(function(req) {
        pillsHTML += `<div class="corr-pill">🔓 ${req}</div>`;
      });
    } else {
      pillsHTML = `<p>Materia de primer año, podés inscribirte libremente.</p>`;
    }

    html += `
      <div class="acord-item">
        <button class="acord-trigger" type="button" onclick="toggleCorr(this)">
          <div class="acord-num ${numClass}">${materia.id}</div>
          <span class="acord-title">${materia.nombre}</span>
          <span class="acord-badge ${badgeClass}">${badgeTexto}</span>
          <span class="acord-chevron">▼</span>
        </button>
        <div class="acord-body">
          ${pillsHTML}
        </div>
      </div>
    `;
  });

  html += `
    <h3>Consejos para no atrasarte</h3>
    <ul>
      <li>Revisá las correlativas al inicio de cada cuatrimestre antes de inscribirte.</li>
      <li>Si tenés dudas, consultá en secretaría académica antes de que cierre la inscripción.</li>
      <li>Priorizá aprobar las materias que desbloquean más correlativas.</li>
      <li>No dejes finales pendientes, pueden bloquearte materias que querés cursar.</li>
    </ul>
  `;

  seccionCorrelativas.innerHTML = html;
}