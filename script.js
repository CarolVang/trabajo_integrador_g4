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
        const onclick = boton.getAttribute("onclick");
        if (onclick && onclick.includes(seccion)) {
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
    cargarDatosPerfil();
}

/* ================= LOGOUT ================= */
function cerrarSesion() {
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}

/* ================= EVENTOS ================= */
let eventos = [
    {
        id: "evento1",
        titulo: "Fiesta del Instituto",
        fecha: "Viernes 25 - 20:00 hs",
        descripcion: "Celebra el fin de semestre con música, comida y amigos. ¡No te lo pierdas!",
        tipo: "opcional",
        estado: "abierto",
        limite: new Date(2026, 5, 25, 20, 0)
    },
    {
        id: "evento2", 
        titulo: "Presentación de trabajos",
        fecha: "Lunes 28 - 10:00 hs",
        descripcion: "Presentación obligatoria de trabajos finales del semestre.",
        tipo: "obligatorio",
        estado: "abierto",
        limite: new Date(2026, 5, 28, 10, 0)
    }
];

let contadorEventos = 3;
let eventoActual = "";

/* 🔹 RENDERIZAR EVENTOS */
function renderizarEventos() {
    const contenedor = document.getElementById("listaEventos");
    contenedor.innerHTML = "";

    eventos.forEach(evento => {
        const idCapit = evento.id.charAt(0).toUpperCase() + evento.id.slice(1);
        const emojiEstado = evento.estado === "cerrado" ? "⚫" : 
                           evento.tipo === "obligatorio" ? "🔴" : "🟢";

        const divEvento = document.createElement("div");
        divEvento.className = "evento";
        
        // Si está cerrado, aplicar estilo especial
        if (evento.estado === "cerrado") {
            divEvento.style.opacity = "0.6";
            divEvento.style.background = "#f3f4f6";
            divEvento.style.borderLeft = "4px solid #6b7280";
        }

        divEvento.innerHTML = `
            <h3>${evento.titulo}</h3>
            <p><strong>📅 ${evento.fecha}</strong></p>
            <p>${emojiEstado} ${evento.tipo === "obligatorio" ? "Obligatorio" : "Opcional"}</p>
            
            ${evento.descripcion !== "Sin descripción" ? `<p style="font-style:italic; color:#666; margin:8px 0;">${evento.descripcion}</p>` : ""}
            
            <span id="contador${idCapit}" class="contador-evento"></span>
            <div class="evento-botones">
                ${evento.estado === "cerrado" ? 
                    '<button disabled style="background:#6b7280; cursor:not-allowed;">⚫ Evento cerrado</button>' :
                    `<button id="btn${idCapit}" onclick="anotarseEvento('${evento.id}', '${evento.tipo}')">
                        ${evento.tipo === "obligatorio" ? "Confirmar asistencia" : "Anotarse"}
                    </button>`
                }
                <button id="btnCancelar${evento.id.replace('evento', '')}" 
                        class="btn-cancelar" 
                        onclick="cancelarInscripcion('${evento.id}')" 
                        style="display:none;">❌ Cancelar</button>
            </div>
        `;

        contenedor.appendChild(divEvento);
    });
}

/* 🔹 ANOTARSE */
function anotarseEvento(idEvento, tipo) {
    eventoActual = idEvento;

    const titulo = document.getElementById("tituloForm");
    if (titulo) {
        titulo.innerText = (tipo === "obligatorio")
            ? "Confirmar asistencia"
            : "Inscripción al evento";
    }

    // Limpiar campos del formulario
    document.getElementById("formNombre").value   = "";
    document.getElementById("formApellido").value = "";
    document.getElementById("formEmail").value    = "";
    document.getElementById("formTelefono").value = "";

    mostrar('formEvento');
}

/* 🔹 CANCELAR INSCRIPCIÓN */
function cancelarInscripcion(idEvento) {
    const usuario = localStorage.getItem("usuarioActual");
    const clave   = usuario + "_" + idEvento;
    localStorage.removeItem(clave);

    const idCapit = idEvento.charAt(0).toUpperCase() + idEvento.slice(1);
    const btn     = document.getElementById("btn" + idCapit);
    const numEvento = idEvento.replace("evento", "");
    const btnCancelar = document.getElementById("btnCancelar" + numEvento);

    if (btn) {
        const evento = eventos.find(e => e.id === idEvento);
        btn.innerText = (evento.tipo === "obligatorio") ? "Confirmar asistencia" : "Anotarse";
        btn.disabled  = false;
        btn.classList.remove("ya-inscripto");
    }

    if (btnCancelar) {
        btnCancelar.style.display = "none";
    }
}

/* 🔹 ENVIAR FORMULARIO */
function enviarFormulario() {
    const nombre   = document.getElementById("formNombre").value;
    const apellido = document.getElementById("formApellido").value;
    const email    = document.getElementById("formEmail").value;
    const telefono = document.getElementById("formTelefono").value;

    if (nombre && apellido && email && telefono) {
        const usuario = localStorage.getItem("usuarioActual");
        const evento = eventos.find(e => e.id === eventoActual);
        const clave   = usuario + "_" + eventoActual;

        localStorage.setItem(clave, evento.tipo === "obligatorio" ? "confirmado" : "anotado");

        mostrar('eventos');

        const idCapit = eventoActual.charAt(0).toUpperCase() + eventoActual.slice(1);
        const btn = document.getElementById("btn" + idCapit);

        if (btn) {
            btn.innerText = (evento.tipo === "obligatorio") ? "Confirmado" : "Anotado";
            btn.disabled = true;
            btn.classList.add("ya-inscripto");
        }

        const numEvento = eventoActual.replace("evento", "");
        const btnCancelar = document.getElementById("btnCancelar" + numEvento);
        if (btnCancelar) btnCancelar.style.display = "inline-block";

    } else {
        alert("Completá todos los campos");
    }
}

/* 🔹 CREAR EVENTO (solo prof/admin) */
function crearEvento() {
    const titulo = document.getElementById("nuevoTitulo").value;
    const fecha  = document.getElementById("nuevaFecha").value;
    const descripcion = document.getElementById("nuevaDescripcion").value;
    const tipo   = document.getElementById("nuevoTipo").value;
    const estado = document.getElementById("nuevoEstado").value;
    const limite = document.getElementById("nuevoLimite").value;

    if (titulo && fecha) {
        const id = "evento" + contadorEventos++;
        
        // Nuevo evento
        const nuevoEvento = {
            id: id,
            titulo: titulo,
            fecha: fecha,
            descripcion: descripcion || "Sin descripción",
            tipo: tipo,
            estado: estado,
            limite: limite ? new Date(limite) : new Date(2026, 11, 31)
        };

        eventos.push(nuevoEvento);

        // Guardar en localStorage
        localStorage.setItem("eventosInstituto57", JSON.stringify(eventos));

        renderizarEventos();
        mostrar('eventos');
        alert("✅ Evento creado exitosamente");

        // Limpiar formulario
        document.getElementById("nuevoTitulo").value = "";
        document.getElementById("nuevaFecha").value = "";
        document.getElementById("nuevaDescripcion").value = "";
        document.getElementById("nuevoLimite").value = "";
        document.getElementById("nuevoTipo").value = "opcional";
        document.getElementById("nuevoEstado").value = "abierto";

    } else {
        alert("Completá al menos título y fecha");
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

    eventos.forEach(evento => {
        const idCapit = evento.id.charAt(0).toUpperCase() + evento.id.slice(1);
        const contador = document.getElementById("contador" + idCapit);
        
        if (!contador || evento.estado === "cerrado") return;

        const diferencia = evento.limite - ahora;

        if (diferencia <= 0) {
            contador.innerText        = "⛔ Inscripción cerrada";
            contador.style.color      = "red";
            contador.style.fontWeight = "bold";

            const btn = document.getElementById("btn" + idCapit);
            if (btn && !btn.classList.contains("ya-inscripto")) {
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
let fotoTemporal = null;

function iniciarCambioFoto() {
    const inputFoto = document.getElementById("cambiarFoto");

    inputFoto.addEventListener("change", function () {
        const archivo = this.files[0];
        if (!archivo) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            fotoTemporal = e.target.result;
            document.getElementById("fotoPerfil").src = fotoTemporal;
            document.getElementById("fotoAcciones").style.display = "block";
        };
        reader.readAsDataURL(archivo);
    });

    actualizarBotonesFoto();
}

function guardarFoto() {
    if (!fotoTemporal) return;

    const usuario = localStorage.getItem("usuarioActual");
    localStorage.setItem("fotoPerfil_" + usuario, fotoTemporal);
    fotoTemporal = null;

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

function cargarDatosPerfil() {
    const usuario = localStorage.getItem("usuarioActual");
    if (usuario) {
        document.getElementById("nombre").textContent = usuario;
        document.getElementById("email").textContent = usuario + "@instituto57.edu";
        const tipo = document.getElementById("tipo").value;
        document.getElementById("rango").textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    }
}

/* ================= CAMBIAR CONTRASEÑA ================= */
function cambiarContrasena() {
    const form = document.getElementById("formCambiarPass");
    form.style.display = form.style.display === "none" ? "block" : "none";

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

    // Cargar eventos desde localStorage o usar los por defecto
    const eventosGuardados = localStorage.getItem("eventosInstituto57");
    if (eventosGuardados) {
        eventos = JSON.parse(eventosGuardados);
    }

    // Renderizar eventos al cargar
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
            const pass = document.getElementById("passwordLogin");
            pass.type = this.checked ? "text" : "password";
        });
    }

    // Restaurar estado de inscripción por usuario
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

                const numEvento = evento.id.replace("evento", "");
                const btnCancelar = document.getElementById("btnCancelar" + numEvento);
                if (btnCancelar) btnCancelar.style.display = "inline-block";
            }
        });
    }

    // Iniciar listener de foto de perfil
    iniciarCambioFoto();
    actualizarBotonesFoto();

    // Contador en tiempo real
    actualizarContadores();
    setInterval(actualizarContadores, 1000);
}