function mostrar(seccion) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    const seccionActiva = document.getElementById(seccion);
    if (seccionActiva) {
        seccionActiva.classList.add("active");
        seccionActiva.scrollIntoView({ behavior: "smooth" });
    }

    document.querySelectorAll(".menu-principal button")
        .forEach(b => b.classList.remove("activo"));

    const botones = document.querySelectorAll(".menu-principal button");
    botones.forEach(boton => {
        if (boton.getAttribute("onclick").includes(seccion)) {
            boton.classList.add("activo");
        }
    });
}

/* ================= WIFI ================= */
const wifiData = {
    estudiante:    { nombre: "Estudiantes",  contraseña: "Escuelas_2025" },
    profesor:      { nombre: "Docentes",     contraseña: "Docentes_2025" },
    video:         { nombre: "Videollamada", contraseña: "Video_2025"    },
    administrativo:{ nombre: "Administracion", contraseña: "Admin_2025" }
};

/* ================= LOGIN ================= */
function login() {
    const nombre = document.getElementById("nombreLogin").value;
    const pass   = document.getElementById("passwordLogin").value;

    if (nombre === "") {
        alert("Ingresá un nombre");
        return;
    }

    const passGuardada = localStorage.getItem("pass_" + nombre);

    // Si es la primera vez que entra, registra la contraseña
    if (!passGuardada) {
        localStorage.setItem("pass_" + nombre, pass);
    } else if (pass !== passGuardada) {
        alert("Contraseña incorrecta");
        return;
    }

    localStorage.setItem("usuarioActual", nombre);
    document.getElementById("login-container").style.display = "none";

    // Restaurar foto de perfil si tiene una guardada
    const fotoGuardada = localStorage.getItem("fotoPerfil_" + nombre);
    if (fotoGuardada) {
        document.getElementById("fotoPerfil").src = fotoGuardada;
    }

    mostrar("inicio");
    verificarRol();
}
/* ================= LOGOUT ================= */
function cerrarSesion() {
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}

/* ================= EVENTOS ================= */

let tiposEventos = {
    evento1: "opcional",
    evento2: "obligatorio"
};

let fechasLimite = {
    evento1: new Date(2026, 3, 25, 20, 0),
    evento2: new Date(2026, 3, 28, 10, 0)
};

let eventoActual = "";
let contadorEventos = 3;

/* 🔹 ANOTARSE */
function anotarseEvento(idEvento, tipo) {
    eventoActual = idEvento;

    const titulo = document.getElementById("tituloForm");
    if (titulo) {
        titulo.innerText = (tipo === "obligatorio")
            ? "Confirmar asistencia"
            : "Inscripción al evento";
    }

    mostrar('formEvento');
}

/* 🔹 ENVIAR FORMULARIO */
function enviarFormulario() {
    const nombre   = document.getElementById("formNombre").value;
    const apellido = document.getElementById("formApellido").value;
    const email    = document.getElementById("formEmail").value;
    const telefono = document.getElementById("formTelefono").value;

    if (nombre && apellido && email && telefono) {

        const usuario = localStorage.getItem("usuarioActual");
        const tipo    = tiposEventos[eventoActual] || "opcional";
        const clave   = usuario + "_" + eventoActual;

        localStorage.setItem(clave, tipo === "obligatorio" ? "confirmado" : "anotado");

        mostrar('eventos');

        const idCapit = eventoActual.charAt(0).toUpperCase() + eventoActual.slice(1);
        const btn = document.getElementById("btn" + idCapit);

        if (btn) {
            btn.innerText = (tipo === "obligatorio") ? "Confirmado" : "Anotado";
            btn.disabled = true;
        }

    } else {
        alert("Completá todos los campos");
    }
}

/* 🔹 CREAR EVENTO (solo prof/admin) */
function crearEvento() {
    const titulo = document.getElementById("nuevoTitulo").value;
    const fecha  = document.getElementById("nuevaFecha").value;
    const tipo   = document.getElementById("nuevoTipo").value;
    const limite = document.getElementById("nuevoLimite").value;

    if (titulo && fecha) {

        const id = "evento" + contadorEventos++;
        tiposEventos[id] = tipo;

        if (limite) {
            fechasLimite[id] = new Date(limite);
        }

        const contenedor   = document.getElementById("listaEventos");
        const nuevoEvento  = document.createElement("div");
        nuevoEvento.classList.add("evento");

        const idCapit = id.charAt(0).toUpperCase() + id.slice(1);

        nuevoEvento.innerHTML = `
            <h3>${titulo}</h3>
            <p>${fecha}</p>
            <p>${tipo === "obligatorio" ? "🔴 Obligatorio" : "🟢 Opcional"}</p>
            <span id="contador${idCapit}" class="contador-evento"></span>
            <button id="btn${idCapit}" onclick="anotarseEvento('${id}', '${tipo}')">
                ${tipo === "obligatorio" ? "Confirmar asistencia" : "Anotarse"}
            </button>
        `;

        contenedor.appendChild(nuevoEvento);
        mostrar('eventos');

    } else {
        alert("Completá los datos");
    }
}

/* ================= CONTROL DE ROL ================= */
function verificarRol() {
    const tipo = document.getElementById("tipo").value;
    const btn  = document.getElementById("btnCrearEvento");

    if (!btn) return;

    btn.style.display = (tipo === "profesor" || tipo === "administrativo")
        ? "block"
        : "none";
}

/* ================= CONTADOR EN TIEMPO REAL ================= */
function actualizarContadores() {
    const ahora = new Date();

    Object.keys(fechasLimite).forEach(id => {
        const limite  = fechasLimite[id];
        const idCapit = id.charAt(0).toUpperCase() + id.slice(1);
        const contador = document.getElementById("contador" + idCapit);
        const btn      = document.getElementById("btn" + idCapit);

        if (!contador) return;

        const diferencia = limite - ahora;

        if (diferencia <= 0) {
            contador.innerText        = "⛔ Inscripción cerrada";
            contador.style.color      = "red";
            contador.style.fontWeight = "bold";

            if (btn) {
                btn.disabled  = true;
                btn.innerText = "Cerrado";
            }

        } else {
            const dias    = Math.floor(diferencia / 86400000);
            const horas   = Math.floor((diferencia % 86400000) / 3600000);
            const minutos = Math.floor((diferencia % 3600000) / 60000);
            const segs    = Math.floor((diferencia % 60000) / 1000);

            if (diferencia < 3600000) {
                contador.innerText        = `⚠️ Cierra en: ${horas}h ${minutos}m ${segs}s`;
                contador.style.color      = "red";
                contador.style.fontWeight = "bold";
            } else if (diferencia < 86400000) {
                contador.innerText        = `⏳ Cierra en: ${horas}h ${minutos}m`;
                contador.style.color      = "orange";
                contador.style.fontWeight = "bold";
            } else {
                contador.innerText        = `⏳ Cierra en: ${dias}d ${horas}h ${minutos}m`;
                contador.style.color      = "";
                contador.style.fontWeight = "";
            }
        }
    });
}

/* ================= FOTO DE PERFIL ================= */

let fotoTemporal = null; // Guarda la foto seleccionada pero aún no guardada

function iniciarCambioFoto() {
    const inputFoto = document.getElementById("cambiarFoto");

    inputFoto.addEventListener("change", function () {
        const archivo = this.files[0];
        if (!archivo) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            // Mostrar preview pero NO guardar todavía
            fotoTemporal = e.target.result;
            document.getElementById("fotoPerfil").src = fotoTemporal;

            // Mostrar mensaje y botón de guardar
            document.getElementById("fotoAcciones").style.display = "block";
        };
        reader.readAsDataURL(archivo);
    });

    // Mostrar/ocultar botón borrar según si hay foto guardada
    actualizarBotonesFoto();
}

function guardarFoto() {
    if (!fotoTemporal) return;

    const usuario = localStorage.getItem("usuarioActual");
    localStorage.setItem("fotoPerfil_" + usuario, fotoTemporal);
    fotoTemporal = null;

    // Ocultar mensaje pendiente y mostrar botón borrar
    document.getElementById("fotoAcciones").style.display = "none";
    document.getElementById("btnBorrarFoto").style.display = "inline-block";

    alert("✅ Foto guardada correctamente");
}

function borrarFoto() {
    if (!confirm("¿Borrar la foto de perfil?")) return;

    const usuario = localStorage.getItem("usuarioActual");
    localStorage.removeItem("fotoPerfil_" + usuario);
    fotoTemporal = null;

    document.getElementById("fotoPerfil").src = "https://via.placeholder.com/120";
    document.getElementById("fotoAcciones").style.display = "none";
    document.getElementById("cambiarFoto").value = "";

    actualizarBotonesFoto();
}

function actualizarBotonesFoto() {
    const usuario     = localStorage.getItem("usuarioActual");
    const fotoGuardada = localStorage.getItem("fotoPerfil_" + usuario);
    const btnBorrar   = document.getElementById("btnBorrarFoto");

    if (btnBorrar) {
        btnBorrar.style.display = fotoGuardada ? "inline-block" : "none";
    }
}

/* ================= CAMBIAR CONTRASEÑA ================= */
function cambiarContrasena() {
    const form = document.getElementById("formCambiarPass");
    form.style.display = form.style.display === "none" ? "block" : "none";

    // Limpiar campos cada vez que se abre
    document.getElementById("passActual").value    = "";
    document.getElementById("passNueva").value     = "";
    document.getElementById("passConfirmar").value = "";
}

function cerrarFormPass() {
    document.getElementById("formCambiarPass").style.display = "none";
    document.getElementById("passActual").value    = "";
    document.getElementById("passNueva").value     = "";
    document.getElementById("passConfirmar").value = "";
}

function guardarContrasena() {
    const usuario   = localStorage.getItem("usuarioActual");
    const actual    = document.getElementById("passActual").value;
    const nueva     = document.getElementById("passNueva").value;
    const confirmar = document.getElementById("passConfirmar").value;

    const guardada = localStorage.getItem("pass_" + usuario) || "";

    if (actual !== guardada) {
        alert("La contraseña actual es incorrecta");
        return;
    }
    if (nueva !== confirmar) {
        alert("Las contraseñas nuevas no coinciden");
        return;
    }
    if (nueva.length < 4) {
        alert("La nueva contraseña debe tener al menos 4 caracteres");
        return;
    }

    localStorage.setItem("pass_" + usuario, nueva);
    document.getElementById("formCambiarPass").style.display = "none";
    alert("¡Contraseña cambiada con éxito!");
}

/* ================= INICIO ================= */
window.onload = function () {

    mostrar('inicio');

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
            const pass = document.getElementById("passwordLogin");
            pass.type = this.checked ? "text" : "password";
        });
    }

    // Restaurar estado de inscripción por usuario
    const usuario = localStorage.getItem("usuarioActual");

    Object.keys(tiposEventos).forEach(id => {
        const clave   = usuario + "_" + id;
        const estado  = localStorage.getItem(clave);
        const idCapit = id.charAt(0).toUpperCase() + id.slice(1);
        const btn     = document.getElementById("btn" + idCapit);

        if (btn && estado) {
            btn.innerText = (estado === "confirmado") ? "Confirmado" : "Anotado";
            btn.disabled  = true;
        }
    });

    // Iniciar listener de foto de perfil
    iniciarCambioFoto();
    actualizarBotonesFoto();

    // Contador en tiempo real
    actualizarContadores();
    setInterval(actualizarContadores, 1000);
};