/* ================= NAVEGACIÓN ================= */
function mostrar(seccion) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    const seccionActiva = document.getElementById(seccion);
    if (seccionActiva) {
        seccionActiva.classList.add("active");
        seccionActiva.scrollIntoView({ behavior: "smooth" });
    }

    document.querySelectorAll(".menu-principal button")
        .forEach(b => b.classList.remove("activo"));

    document.querySelectorAll(".menu-principal button").forEach(boton => {
        const onclick = boton.getAttribute("onclick");
        if (onclick && onclick.includes(seccion)) {
            boton.classList.add("activo");
        }
    });
}

/* ================= WIFI ================= */
const wifiData = {
    estudiante:    { nombre: "Estudiantes",    contraseña: "Escuelas_2025" },
    profesor:      { nombre: "Docentes",       contraseña: "Docentes_2025" },
    video:         { nombre: "Videollamada",   contraseña: "Video_2025"    },
    administrativo:{ nombre: "Administracion", contraseña: "Admin_2025"    }
};

/* ================= LOGIN ================= */
function login() {
    const nombre = document.getElementById("nombreLogin").value;
    const pass   = document.getElementById("passwordLogin").value;

    if (nombre === "") { alert("Ingresá un nombre"); return; }

    const passGuardada = localStorage.getItem("pass_" + nombre);

    if (!passGuardada) {
        localStorage.setItem("pass_" + nombre, pass);
    } else if (pass !== passGuardada) {
        alert("Contraseña incorrecta");
        return;
    }

    localStorage.setItem("usuarioActual", nombre);
    document.getElementById("login-container").style.display = "none";

    const fotoGuardada = localStorage.getItem("fotoPerfil_" + nombre);
    if (fotoGuardada) {
        document.getElementById("fotoPerfil").src = fotoGuardada;
    }

    mostrar("inicio");
    verificarRol();
    cargarDatosPerfil();
}

/* ================= LOGOUT ================= */
function cerrarSesion() {
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}

/* ================= CONTROL DE ROL ================= */
function verificarRol() {
    const tipo = document.getElementById("tipo").value;
    const btn  = document.getElementById("btnCrearEvento");
    if (!btn) return;
    btn.style.display = (tipo === "profesor" || tipo === "administrativo") ? "block" : "none";
}

/* ================= INICIO ================= */
window.onload = function () {
    mostrar('inicio');

    const eventosGuardados = localStorage.getItem("eventosInstituto57");
    if (eventosGuardados) eventos = JSON.parse(eventosGuardados);

    renderizarEventos();

    const tipoSelect = document.getElementById("tipo");
    if (tipoSelect) {
        tipoSelect.addEventListener("change", () => {
            const tipo = tipoSelect.value;
            document.getElementById("wifiNombre").innerText = "Nombre: "     + wifiData[tipo].nombre;
            document.getElementById("wifiPass").innerText   = "Contraseña: " + wifiData[tipo].contraseña;
            verificarRol();
        });
        tipoSelect.dispatchEvent(new Event("change"));
    }

    const verPass = document.getElementById("verPassword");
    if (verPass) {
        verPass.addEventListener("change", function () {
            document.getElementById("passwordLogin").type = this.checked ? "text" : "password";
        });
    }

    const buscador = document.getElementById("buscador");
    if (buscador) {
        buscador.addEventListener("input", function () {
            clearTimeout(window.buscadorTimeout);
            window.buscadorTimeout = setTimeout(buscarEventos, 300);
        });
        buscador.addEventListener("keypress", function (e) {
            if (e.key === "Enter") buscarEventos();
        });
        document.addEventListener("click", function (e) {
            if (!e.target.closest(".buscador-eventos") && buscador.value.trim() === "") {
                renderizarEventos();
            }
        });
    }

    const usuario = localStorage.getItem("usuarioActual");
    if (usuario) {
        eventos.forEach(evento => {
            const clave   = usuario + "_" + evento.id;
            const estado  = localStorage.getItem(clave);
            const idCapit = evento.id.charAt(0).toUpperCase() + evento.id.slice(1);
            const btn     = document.getElementById("btn" + idCapit);

            if (btn && estado && evento.estado !== "cerrado") {
                btn.innerText = (estado === "confirmado") ? "Confirmado" : "Anotado";
                btn.disabled  = true;
                btn.classList.add("ya-inscripto");

                const numEvento   = evento.id.replace("evento", "");
                const btnCancelar = document.getElementById("btnCancelar" + numEvento);
                if (btnCancelar) btnCancelar.style.display = "inline-block";
            }
        });
    }

    iniciarCambioFoto();
    actualizarBotonesFoto();
    actualizarContadores();
    setInterval(actualizarContadores, 1000);
}