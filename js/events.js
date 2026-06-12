// js/eventos.js - Lógica para la rama de Eventos

async function cargarEventosDesdeAPI() {
    // 1. Buscamos el contenedor donde se mostrarán los eventos
    const contenedorEventos = document.getElementById("eventos-container"); // Asegurate que este ID exista en el HTML
    
    if (!contenedorEventos) return;

    contenedorEventos.innerHTML = "<p>Cargando eventos...</p>";

    // 2. Llamamos a la API (usando tu api.js)
    const eventos = await api.getEventos();

    if (!eventos || eventos.length === 0) {
        contenedorEventos.innerHTML = "<p>No hay eventos programados por ahora.</p>";
        return;
    }

    // 3. Limpiamos y renderizamos
    contenedorEventos.innerHTML = "";
    
    eventos.forEach(evento => {
        const card = `
            <div class="evento-card">
                <h4>${evento.titulo}</h4>
                <p><strong>Fecha:</strong> ${evento.fecha}</p>
                <p>${evento.descripcion}</p>
                ${evento.lugar ? <p>📍 ${evento.lugar}</p> : ''}
            </div>
        `;
        contenedorEventos.innerHTML += card;
    });
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', cargarEventosDesdeAPI);