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
const wifiData = {
    estudiante:    { nombre: "Estudiantes",  contraseña: "Escuelas_2025" },
    profesor:      { nombre: "Docentes",     contraseña: "Docentes_2025" },
    video:         { nombre: "Videollamada", contraseña: "Video_2025"    },
    administrativo:{ nombre: "Administracion", contraseña: "Admin_2025"  }
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