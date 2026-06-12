// js/reglamentos.js

// 1. Buscamos el contenedor en el HTML
const seccionReglamentos = document.getElementById("reglamentos");

// 2. Función principal para cargar los datos desde la API
async function cargarReglamentosDesdeAPI() {
    if (!seccionReglamentos) return;

    seccionReglamentos.innerHTML = "<p style='padding:20px;'>Cargando documentos desde la API...</p>";

    // Llamamos a la función que creamos en api.js
    const datos = await api.getReglamentacion();

    if (!datos) {
        seccionReglamentos.innerHTML = "<p style='padding:20px;'>Error al conectar con la API.</p>";
        return;
    }

    // 3. Renderizamos los datos recibidos
    renderizarReglamentos(datos);
}

// 4. Tu función de renderizado (actualizada para la API)
function renderizarReglamentos(lista) {
    const categorias = {};

    // Agrupamos por categoría (si no tiene, va a "General")
    lista.forEach(function(doc) {
        const cat = doc.categoria || "General";
        if (!categorias[cat]) {
            categorias[cat] = [];
        }
        categorias[cat].push(doc);
    });

    let html = "<h2>Reglamentos y documentos</h2>";
    html += "<p>Documentos oficiales obtenidos de la API en tiempo real.</p>";

    for (const categoria in categorias) {
        html += `<h3>${categoria.toUpperCase()}</h3>`;

        categorias[categoria].forEach(function(doc) {
            // Usamos el archivo o el link de la API
            const link = doc.archivo || doc.link || "#";
            
            html += `
                <div class="doc-item">
                    <span class="doc-icon">📄</span>
                    <div class="doc-info">
                        <strong>${doc.titulo}</strong>
                        <p>${doc.descripcion}</p>
                        <small>Versión: ${doc.version} | Publicado: ${doc.fecha_publicacion}</small>
                    </div>
                    <a href="${link}" target="_blank" class="btn-descargar" style="text-decoration:none;">
                        ⬇ DESCARGAR
                    </a>
                </div>
            `;
        });
    }

    seccionReglamentos.innerHTML = html;
}

// 5. Ejecutamos la carga al iniciar
document.addEventListener('DOMContentLoaded', cargarReglamentosDesdeAPI);
