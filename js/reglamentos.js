// js/reglamentos.js - Integración Completa con la API
const seccionReglamentos = document.getElementById("reglamentos");

/**
 * Función principal que inicia la carga de datos
 */
async function cargarReglamentos() {
    if (!seccionReglamentos) return;

    // Mensaje de carga inicial
    seccionReglamentos.innerHTML = `
        <div style="padding:20px; text-align:center;">
            <p>🔄 Cargando documentos oficiales desde la API...</p>
        </div>`;

    // 1. Intentamos obtener los datos reales de la API
    let listaDocumentos = await api.getReglamentacion();

    // 2. Sistema de Respaldo (Si la API no responde o está vacía)
    if (!listaDocumentos || listaDocumentos.length === 0) {
        console.warn("API de reglamentos vacía. Usando datos de respaldo para el TP.");
        listaDocumentos = [
            {
                "tipo": "institucional",
                "titulo": "Estatuto del Centro de Estudiantes",
                "descripcion": "Reglamento base sobre la conformación y fines del centro.",
                "archivo": "#",
                "categoria": "institucional",
                "fecha_publicacion": "2024-03-15",
                "version": "2.1"
            },
            {
                "tipo": "academica",
                "titulo": "Régimen de Correlatividades",
                "descripcion": "Listado oficial de materias y sus requisitos para cursar.",
                "archivo": "correlatividades.pdf",
                "categoria": "academica",
                "fecha_publicacion": "2026-01-10",
                "version": "1.0"
            }
        ];
    }

    // 3. Mandamos la lista a dibujar en la pantalla
    renderizarReglamentos(listaDocumentos);
}

/**
 * Función que construye el HTML agrupando por categorías
 */
function renderizarReglamentos(lista) {
    const categorias = {};

    // Agrupamos los documentos por el campo 'categoria' (o 'tipo' si no tiene)
    lista.forEach(function(doc) {
        const nombreCat = doc.categoria || doc.tipo || "General";
        if (!categorias[nombreCat]) {
            categorias[nombreCat] = [];
        }
        categorias[nombreCat].push(doc);
    });

    // Construimos el encabezado de la sección
    let html = `
        <div style="margin-bottom: 30px;">
            <h2 style="color: #2c3e50; font-size: 28px; margin-bottom: 10px;">Reglamentos y Documentos</h2>
            <p style="color: #7f8c8d;">Consulta y descarga la normativa vigente del Instituto en tiempo real.</p>
        </div>
    `;

    // Recorremos cada categoría encontrada
    for (const cat in categorias) {
        html += `
            <div class="categoria-group" style="margin-bottom: 25px;">
                <h3 style="background: #ecf0f1; padding: 10px 15px; border-radius: 5px; color: #2980b9; text-transform: uppercase; font-size: 16px; border-left: 5px solid #2980b9;">
                    ${cat}
                </h3>
        `;

        // Recorremos los documentos de esa categoría
        categorias[cat].forEach(function(doc) {
            const linkDescarga = doc.archivo || doc.link || "#";
            
            html += `
                <div class="doc-item" style="display:flex; align-items:center; padding:15px; background:white; margin: 10px 0; border-radius:8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: transform 0.2s;">
                    <div class="doc-icon" style="font-size:30px; margin-right:20px; color: #e74c3c;">📄</div>
                    <div class="doc-info" style="flex-grow:1;">
                        <strong style="display:block; font-size:17px; color:#333;">${doc.titulo}</strong>
                        <p style="margin:5px 0; color:#666; font-size:14px;">${doc.descripcion}</p>
                        <div style="margin-top:5px;">
                            <span style="background:#eee; padding:2px 8px; border-radius:10px; font-size:11px; color:#777; margin-right:10px;">Versión ${doc.version}</span>
                            <span style="font-size:11px; color:#999;">Publicado el ${doc.fecha_publicacion}</span>
                        </div>
                    </div>
                    <div class="doc-action">
                        <a href="${linkDescarga}" target="_blank" class="btn-descargar" style="display:inline-block; background:#2980b9; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; font-size:13px; box-shadow: 0 2px 4px rgba(41, 128, 185, 0.3);">
                            ⬇ DESCARGAR
                        </a>
                    </div>
                </div>
            `;
        });

        html += `</div>`; // Cierra el grupo de categoría
    }

    // Insertamos todo el HTML generado en el contenedor
    seccionReglamentos.innerHTML = html;
}

// Iniciamos la carga cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarReglamentos);
