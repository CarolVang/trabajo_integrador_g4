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
    });
}


// ─── WIFI DATA ───────────────────────────────────────────────
const wifiData = {
    estudiante:    { nombre: "Estudiantes",  contraseña: "Escuelas_2025" },
    profesor:      { nombre: "Docentes",     contraseña: "Docentes_2025" },
    video:         { nombre: "Videollamada", contraseña: "Video_2025"    },
    administrativo:{ nombre: "Administracion",contraseña: "Admin_2025"  }
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

    /* ACÁ SE CAMBIA LA CONTRASEÑA */
    if (password === "") {
        document.getElementById("login-container").style.display = "none";
        mostrar("novedades", false); // sin scroll al entrar
    }
}

window.onload = function () {
    mostrar("inicio", false); // sin scroll al cargar
};


// ─── CERRAR SESIÓN ───────────────────────────────────────────
function cerrarSesion() {
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}