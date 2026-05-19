let primeraCarga = true;

// ─── NAVEGACIÓN ───────────────────────────────────────────────
function mostrar(seccion, hacerScroll = true) {

    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    const seccionActiva = document.getElementById(seccion);
    if (!seccionActiva) {
        console.warn("mostrar(): no existe la sección con id='" + seccion + "'");
        return;
    }
    seccionActiva.classList.add("active");

    if (!primeraCarga && hacerScroll) {
        const topbar = document.querySelector(".topbar");
        const topbarAltura = topbar ? topbar.offsetHeight : 0;
        const y = seccionActiva.getBoundingClientRect().top + window.scrollY - topbarAltura - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
    }

    primeraCarga = false;

    document.querySelectorAll(".nav-links button")
        .forEach(b => b.classList.remove("activo"));

    document.querySelectorAll(".nav-links button").forEach(boton => {
        const onclick = boton.getAttribute("onclick");
        if (onclick && onclick.includes(seccion)) {
            boton.classList.add("activo");
        }
    });
}


// ─── WIFI DATA ───────────────────────────────────────────────
const wifiData = {
    estudiante:     { nombre: "Estudiantes",   contraseña: "Escuelas_2025" },
    profesor:       { nombre: "Docentes",      contraseña: "Docentes_2025" },
    video:          { nombre: "Videollamada",  contraseña: "Video_2025"    },
    administrativo: { nombre: "Administracion",contraseña: "Admin_2025"   }
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

tipoSelect.dispatchEvent(new Event("change"));


// ─── LOGIN ───────────────────────────────────────────────────
function login() {
    const nombre   = document.getElementById("nombreLogin").value.trim();
    const password = document.getElementById("passwordLogin").value;
    const tipo     = document.getElementById("tipo").value;

    if (password === "") {
        // Guardamos nombre y rol en localStorage
        localStorage.setItem("usuarioActual", nombre || "Usuario");
        localStorage.setItem("tipoUsuario",   tipo);

        document.getElementById("login-container").style.display = "none";
        mostrar("inicio", false);
        verificarRol();
        restaurarEventos();
    }
}

window.onload = function () {
    // Si ya había sesión iniciada, saltamos el login
    if (localStorage.getItem("usuarioActual")) {
        document.getElementById("login-container").style.display = "none";
        verificarRol();
        restaurarEventos();
    }

    mostrar("inicio", false);

    const buscador = document.getElementById("buscador");
    if (buscador) buscador.addEventListener("input", buscarEventos);
};


// ─── CERRAR SESIÓN ───────────────────────────────────────────
function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("tipoUsuario");
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}


// ─── ACORDEÓN CORRELATIVAS ───────────────────────────────────
function toggleCorr(btn) {
    const body   = btn.nextElementSibling;
    const isOpen = btn.classList.contains("open");

    document.querySelectorAll(".acord-trigger.open").forEach(b => {
        b.classList.remove("open");
        b.nextElementSibling.classList.remove("open");
    });

    if (!isOpen) {
        btn.classList.add("open");
        body.classList.add("open");
    }
}


// ─── EVENTOS ─────────────────────────────────────────────────
let carreraFiltrada = "todos";

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
        contador.textContent = termino || carreraFiltrada !== "todos"
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

function anotarseEvento(idEvento, tipo) {
    const usuario = localStorage.getItem("usuarioActual");
    if (!usuario) return alert("Tenés que iniciar sesión primero");

    const clave      = `inscriptos_${idEvento}`;
    let inscriptos   = JSON.parse(localStorage.getItem(clave) || "[]");
    const btn        = document.getElementById(`btn${capitalizar(idEvento)}`);
    const contadorEl = document.getElementById(`contador${capitalizar(idEvento)}`);

    if (inscriptos.includes(usuario)) {
        inscriptos = inscriptos.filter(u => u !== usuario);
        localStorage.setItem(clave, JSON.stringify(inscriptos));
        if (btn)        btn.textContent = "Anotarse";
        if (contadorEl) contadorEl.textContent = inscriptos.length > 0
            ? `✅ ${inscriptos.length} anotado${inscriptos.length !== 1 ? "s" : ""}`
            : "";
        alert("Te desanotaste del evento");
    } else {
        inscriptos.push(usuario);
        localStorage.setItem(clave, JSON.stringify(inscriptos));
        if (btn)        btn.textContent = "Desanotarse";
        if (contadorEl) contadorEl.textContent =
            `✅ ${inscriptos.length} anotado${inscriptos.length !== 1 ? "s" : ""}`;
        alert(`Te anotaste ${tipo === "obligatorio" ? "✅ (obligatorio)" : "🟢 (opcional)"}`);
    }
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function restaurarEventos() {
    const usuario = localStorage.getItem("usuarioActual");
    if (!usuario) return;

    document.querySelectorAll("#listaEventos .evento-card").forEach(tarjeta => {
        const btn = tarjeta.querySelector("button[id^='btnEvento']");
        if (!btn) return;
        const idEvento   = btn.id.replace("btn", "").replace(/^E/, "e");
        const clave      = `inscriptos_${idEvento}`;
        const inscriptos = JSON.parse(localStorage.getItem(clave) || "[]");
        const contadorEl = tarjeta.querySelector("span[id^='contadorEvento']");

        if (inscriptos.includes(usuario)) btn.textContent = "Desanotarse";
        if (contadorEl && inscriptos.length > 0) {
            contadorEl.textContent =
                `✅ ${inscriptos.length} anotado${inscriptos.length !== 1 ? "s" : ""}`;
        }
    });
}

function verificarRol() {
    const tipo = localStorage.getItem("tipoUsuario") || "estudiante";
    const btn  = document.getElementById("btnCrearEvento");
    if (btn) btn.style.display = (tipo !== "estudiante") ? "block" : "none";
}

function crearEvento() {
    const titulo  = document.getElementById("nuevoTitulo").value.trim();
    const carrera = document.getElementById("nuevaCarrera").value;
    const fecha   = document.getElementById("nuevaFecha").value.trim();
    const tipo    = document.getElementById("nuevoTipo").value;

    if (!titulo) return alert("Ingresá un título para el evento");
    if (!fecha)  return alert("Ingresá la fecha del evento");

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

    div.innerHTML = `
        <h3>${titulo}</h3>
        <p class="tag-carrera">${etiquetaCarrera}</p>
        <p>${fecha}</p>
        <p>${tipo === "obligatorio" ? "🔴 Obligatorio" : "🟢 Opcional"}</p>
        <span id="contador${id}" class="contador-evento"></span>
        <div class="evento-botones">
            <button id="btn${id}" onclick="anotarseEvento('${id}', '${tipo}')">Anotarse</button>
        </div>
    `;

    document.getElementById("listaEventos").appendChild(div);
    document.getElementById("nuevoTitulo").value = "";
    document.getElementById("nuevaFecha").value  = "";
    mostrar("calendario");
    alert(`Evento "${titulo}" creado ✅`);
}