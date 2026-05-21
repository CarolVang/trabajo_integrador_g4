let primeraCarga = true;

// ─── VARIABLE DE FILTRO DE EVENTOS ───────────────────────────
let carreraFiltrada = "todos";

// ─── NAVEGACIÓN ───────────────────────────────────────────────
function mostrar(seccion, hacerScroll = true) {

    // Oculta todas las secciones
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    // Muestra la sección pedida
    const seccionActiva = document.getElementById(seccion);
    if (!seccionActiva) {
        console.warn("mostrar(): no existe la sección con id='" + seccion + "'");
        return;
    }
    seccionActiva.classList.add("active");

    // Scroll suave, solo después de la primera carga
    if (!primeraCarga && hacerScroll) {
        const topbar = document.querySelector(".topbar");
        const topbarAltura = topbar ? topbar.offsetHeight : 0;
        const y = seccionActiva.getBoundingClientRect().top + window.scrollY - topbarAltura - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
    }

    primeraCarga = false;

    // Quitar clase activo de todos los botones de navegación
    document.querySelectorAll(".nav-links button")
        .forEach(b => b.classList.remove("activo"));

    // Marcar como activo el botón que corresponde a esta sección
    document.querySelectorAll(".nav-links button").forEach(boton => {
        const onclick = boton.getAttribute("onclick");
        if (onclick && onclick.includes(seccion)) {
            boton.classList.add("activo");
        }
    });
}


// ─── WIFI DATA ───────────────────────────────────────────────
const wifiData = {
    estudiante:    { nombre: "Estudiantes",   contraseña: "Escuelas_2025" },
    profesor:      { nombre: "Docentes",      contraseña: "Docentes_2025" },
    video:         { nombre: "Videollamada",  contraseña: "Video_2025"    },
    administrativo:{ nombre: "Administracion",contraseña: "Admin_2025"   }
};

const tipoSelect = document.getElementById("tipo");

tipoSelect.addEventListener("change", () => {
    const tipo = tipoSelect.value;
    const data = wifiData[tipo];
    if (data) {
        document.getElementById("wifiNombre").innerText = "Nombre: "     + data.nombre;
        document.getElementById("wifiPass").innerText   = "Contraseña: " + data.contraseña;
    }
});

document.getElementById("verPassword").addEventListener("change", function () {
    const pass = document.getElementById("passwordLogin");
    pass.type = this.checked ? "text" : "password";
});

// Disparar el evento para mostrar wifi al cargar
tipoSelect.dispatchEvent(new Event("change"));


// ─── LOGIN ───────────────────────────────────────────────────
function login() {
    const password = document.getElementById("passwordLogin").value;

    if (password === "") {
        document.getElementById("login-container").style.display = "none";
        mostrar("inicio", false);
    }
}

window.onload = function () {
    mostrar("inicio", false); // sin scroll al cargar

    // Buscador de eventos
    const buscador = document.getElementById("buscador");
    if (buscador) buscador.addEventListener("input", buscarEventos);

    // Restaurar estado de inscripciones y rol
    restaurarEventos();
    verificarRol();
};


// ─── CERRAR SESIÓN ───────────────────────────────────────────
function cerrarSesion() {
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}

// ─── ACORDEÓN CORRELATIVAS ───────────────────────────────────
function toggleCorr(btn) {
    const body = btn.nextElementSibling;
    const isOpen = btn.classList.contains("open");

    // Cierra todos los que estén abiertos
    document.querySelectorAll(".acord-trigger.open").forEach(b => {
        b.classList.remove("open");
        b.nextElementSibling.classList.remove("open");
    });

    // Si estaba cerrado, lo abre
    if (!isOpen) {
        btn.classList.add("open");
        body.classList.add("open");
    }
}


// ─── ROL (lee el tipo del select de login) ───────────────────
// Muestra el botón "Crear evento" solo para profesores y administrativos
function verificarRol() {
    const tipo = tipoSelect ? tipoSelect.value : "estudiante";
    const btn  = document.getElementById("btnCrearEvento");
    if (btn) btn.style.display = (tipo !== "estudiante") ? "block" : "none";
}

// Re-verificar rol cuando cambia el select (útil si el login ya está cerrado)
if (tipoSelect) {
    tipoSelect.addEventListener("change", verificarRol);
}


// ─── EVENTOS: BUSCAR / FILTRAR ────────────────────────────────
function buscarEventos() {
    const termino  = document.getElementById("buscador").value.toLowerCase();
    const tarjetas = document.querySelectorAll("#listaEventos .evento-card");
    let visibles   = 0;

    tarjetas.forEach(tarjeta => {
        const titulo          = tarjeta.dataset.titulo.toLowerCase();
        const carrera         = tarjeta.dataset.carrera;
        const coincideTexto   = titulo.includes(termino);
        const coincideCarrera = carreraFiltrada === "todos" || carrera === carreraFiltrada;
        const mostrarTarjeta  = coincideTexto && coincideCarrera;

        tarjeta.style.display = mostrarTarjeta ? "block" : "none";
        if (mostrarTarjeta) visibles++;
    });

    const contador = document.getElementById("contadorResultados");
    if (contador) {
        contador.textContent = (termino || carreraFiltrada !== "todos")
            ? `${visibles} resultado${visibles !== 1 ? "s" : ""}`
            : "";
    }
}

function filtrarCarrera(carrera, elemento) {
    carreraFiltrada = carrera;
    document.querySelectorAll(".btn-filtro").forEach(btn => btn.classList.remove("activo"));
    elemento.classList.add("activo");
    buscarEventos();
}


// ─── EVENTOS: INSCRIPCIÓN ────────────────────────────────────
function anotarseEvento(idEvento, tipo) {
    // En este proyecto el nombre de usuario viene del input de login
    const usuario = document.getElementById("nombreLogin")
        ? document.getElementById("nombreLogin").value.trim() || "Usuario"
        : "Usuario";

    const clave      = `inscriptos_${idEvento}`;
    let inscriptos   = JSON.parse(localStorage.getItem(clave) || "[]");

    const btn        = document.getElementById(`btn${capitalizar(idEvento)}`);
    const contadorEl = document.getElementById(`contador${capitalizar(idEvento)}`);

    if (inscriptos.includes(usuario)) {
        // Des-anotarse
        inscriptos = inscriptos.filter(u => u !== usuario);
        localStorage.setItem(clave, JSON.stringify(inscriptos));
        if (btn)        btn.textContent = "Anotarse";
        if (contadorEl) contadorEl.textContent = inscriptos.length > 0
            ? `✅ ${inscriptos.length} anotado${inscriptos.length !== 1 ? "s" : ""}`
            : "";
        alert("Te desanotaste del evento.");
    } else {
        // Anotarse
        inscriptos.push(usuario);
        localStorage.setItem(clave, JSON.stringify(inscriptos));
        if (btn)        btn.textContent = "Desanotarse";
        if (contadorEl) contadorEl.textContent =
            `✅ ${inscriptos.length} anotado${inscriptos.length !== 1 ? "s" : ""}`;
        alert(`Te anotaste al evento ${tipo === "obligatorio" ? "✅ (obligatorio)" : "🟢 (opcional)"}`);
    }
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Restaura el estado visual de los botones al recargar
function restaurarEventos() {
    // Intentamos recuperar el nombre del campo de login (puede estar vacío si ya se cerró el modal)
    const nombreInput = document.getElementById("nombreLogin");
    const usuario     = nombreInput ? nombreInput.value.trim() : "";
    if (!usuario) return;

    document.querySelectorAll("#listaEventos .evento-card").forEach(tarjeta => {
        const btn = tarjeta.querySelector("button[id^='btnEvento']");
        if (!btn) return;
        const idEvento   = btn.id.replace("btn", "").replace(/^E/, "e"); // btnEvento1 → evento1
        const clave      = `inscriptos_${idEvento}`;
        const inscriptos = JSON.parse(localStorage.getItem(clave) || "[]");
        const contadorEl = tarjeta.querySelector("span[id^='contadorEvento']");

        if (inscriptos.includes(usuario)) {
            btn.textContent = "Desanotarse";
        }
        if (contadorEl && inscriptos.length > 0) {
            contadorEl.textContent =
                `✅ ${inscriptos.length} anotado${inscriptos.length !== 1 ? "s" : ""}`;
        }
    });
}


// ─── EVENTOS: CREAR ──────────────────────────────────────────
function crearEvento() {
    const titulo  = document.getElementById("nuevoTitulo").value.trim();
    const carrera = document.getElementById("nuevaCarrera").value;
    const fecha   = document.getElementById("nuevaFecha").value.trim();
    const tipo    = document.getElementById("nuevoTipo").value;

    if (!titulo) return alert("Ingresá un título para el evento.");
    if (!fecha)  return alert("Ingresá la fecha del evento.");

    const id  = "evento" + Date.now();
    const div = document.createElement("div");
    div.className = "evento-card";
    div.dataset.titulo  = titulo;
    div.dataset.carrera = carrera;
    div.dataset.fecha   = fecha;
    div.dataset.tipo    = tipo;

    const etiquetaCarrera = {
        "general":          "🌎 Para: Todas las carreras",
        "Ciencia de Datos": "📊 Ciencia de Datos",
        "Farmacia":         "💊 Farmacia",
        "Trabajo Social":   "🤝 Trabajo Social"
    }[carrera] || carrera;

    const tipoLabel = tipo === "obligatorio" ? "🔴 Obligatorio" : "🟢 Opcional";
    const tipoClass = tipo === "obligatorio" ? "obligatorio" : "opcional";

    div.innerHTML = `
        <div class="evento-card-header">
            <div class="evento-fecha-badge navy">
                <span class="dia">—</span>
                <span class="mes">NEW</span>
            </div>
            <div class="evento-card-info">
                <h3>${titulo}</h3>
                <p class="tag-carrera">${etiquetaCarrera}</p>
                <p>${fecha}</p>
            </div>
            <span class="evento-tipo ${tipoClass}">${tipoLabel}</span>
        </div>
        <div class="evento-card-footer">
            <span id="contador${id}" class="contador-evento"></span>
            <button id="btn${id}" class="btn-anotarse" onclick="anotarseEvento('${id}', '${tipo}')">Anotarse</button>
        </div>
    `;

    document.getElementById("listaEventos").appendChild(div);

    // Limpiar formulario
    document.getElementById("nuevoTitulo").value = "";
    document.getElementById("nuevaFecha").value  = "";

    mostrar("eventos");
    alert(`Evento "${titulo}" creado correctamente ✅`);
}