// ─── MOSTRAR SECCIÓN ────────────────────────────────────────────────────────
// Una sola definición, limpia. Acepta nombre de sección y evento opcional.
function mostrar(seccion, event) {

    // Ocultar todas las secciones
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    // Mostrar la seleccionada
    const seccionActiva = document.getElementById(seccion);
    if (!seccionActiva) return;
    seccionActiva.classList.add("active");

    // Bajar suavemente a la sección
    seccionActiva.scrollIntoView({ behavior: "smooth" });

    // Quitar "activo" de todos los botones del menú
    document.querySelectorAll(".btn-menu").forEach(b => b.classList.remove("activo"));

    // Marcar el botón que corresponde (si el evento viene de un botón del menú)
    if (event && event.target && event.target.closest(".btn-menu")) {
        event.target.closest(".btn-menu").classList.add("activo");
    }
}

// ─── WIFI DATA ───────────────────────────────────────────────────────────────

let primeraCarga = true;

function mostrar(seccion, hacerScroll = true) {

    // Oculta todas las secciones
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    // Muestra la sección pedida
    // Usamos un guard para evitar crashes si la sección no existe
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

    // ─── FIX: era ".menu-principal button", ahora es ".nav-links button" ───
    // Quitar clase activo de todos los botones de navegación
    document.querySelectorAll(".nav-links button")
        .forEach(b => b.classList.remove("activo"));

    // Marcar como activo el botón que corresponde a esta sección
    document.querySelectorAll(".nav-links button").forEach(boton => {
        const onclick = boton.getAttribute("onclick");
        if (onclick && onclick.includes(seccion)) {
            boton.classList.add("activo");
        }
}
// ─── WIFI DATA ───────────────────────────────────────────────
const wifiData = {
    estudiante:    { nombre: "Estudiantes",  contraseña: "Escuelas_2025" },
    profesor:      { nombre: "Docentes",     contraseña: "Docentes_2025" },
    video:         { nombre: "Videollamada", contraseña: "Video_2025"    },
   { nombre: "Administracion", contraseña: "Admin_2025"  }
    
    { nombre: "Administracion", contraseña: "Admin_2025"  }

};

// ─── SELECTOR DE TIPO EN EL LOGIN ────────────────────────────────────────────
const tipoSelect = document.getElementById("tipo");

tipoSelect.addEventListener("change", () => {
    const tipo = tipoSelect.value;
    const data = wifiData[tipo];
    if (!data) return;
    document.getElementById("wifiNombre").innerText = "Nombre: " + data.nombre;
    document.getElementById("wifiPass").innerText   = "Contraseña: " + data.contraseña;
});

// Disparar al cargar para mostrar el wifi del tipo por defecto
tipoSelect.dispatchEvent(new Event("change"));

// ─── MOSTRAR / OCULTAR CONTRASEÑA ────────────────────────────────────────────

    if (data) {
        document.getElementById("wifiNombre").innerText = "Nombre: "     + data.nombre;
        document.getElementById("wifiPass").innerText   = "Contraseña: " + data.contraseña;
    }


document.getElementById("verPassword").addEventListener("change", function () {
    const pass = document.getElementById("passwordLogin");
    pass.type = this.checked ? "text" : "password";
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function login() {
    const password = document.getElementById("passwordLogin").value;

    // CAMBIAR LA CONTRASEÑA ACÁ SI HACE FALTA
    // Por ahora entra con contraseña vacía
    if (password === "") {
        document.getElementById("login-container").style.display = "none";
        mostrar("novedades");
    } else {
        alert("Contraseña incorrecta");
    }
}

// ─── CERRAR SESIÓN ───────────────────────────────────────────────────────────

// Disparar el evento para mostrar wifi al cargar
tipoSelect.dispatchEvent(new Event("change"));


// ─── LOGIN ───────────────────────────────────────────────────
function login() {
    // versión correcta
    const password = document.getElementById("passwordLogin").value;

    if (password === "") {
        document.getElementById("login-container").style.display = "none";
        mostrar("inicio", false); // ← ahora queda en inicio
    }
}

window.onload = function () {
    mostrar("inicio", false); // sin scroll al cargar
};


// ─── CERRAR SESIÓN ───────────────────────────────────────────
function cerrarSesion() {
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".btn-menu").forEach(b => b.classList.remove("activo"));

    // Limpiar campos del login
    document.getElementById("nombreLogin").value  = "";
    document.getElementById("passwordLogin").value = "";
    document.getElementById("verPassword").checked = false;
    document.getElementById("passwordLogin").type  = "password";
}

// ─── INICIO ──────────────────────────────────────────────────────────────────
window.onload = function () {
    mostrar("inicio");
};

// ── ACORDEÓN CORRELATIVAS ──
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
