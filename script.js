let carreraFiltrada = "todos";

// ─── NAVEGACIÓN ───────────────────────────────────────────────
function mostrar(seccion) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(seccion);
    if (target) target.classList.add("active");
}

// ─── LOGIN / SESIÓN ───────────────────────────────────────────
function login() {
    const nombre   = document.getElementById("nombreLogin").value.trim();
    const password = document.getElementById("passwordLogin").value.trim();
    const tipo     = document.getElementById("tipo").value;

    if (!nombre)   return alert("Ingresá tu nombre");
    if (!password) return alert("Ingresá tu contraseña");

    // Contraseña hardcodeada de ejemplo; reemplazá con tu lógica real
    const CONTRASENA_VALIDA = "1234";
    if (password !== CONTRASENA_VALIDA) return alert("Contraseña incorrecta");

    localStorage.setItem("usuarioActual", nombre);
    localStorage.setItem("tipoUsuario",   tipo);          // FIX #5: guardamos el rol

    document.getElementById("login-container").style.display = "none";
    mostrar('inicio');
    verificarRol();
    actualizarPerfil();
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("tipoUsuario");
    location.reload();
}

// ─── ROL ──────────────────────────────────────────────────────
// FIX #5: lee el rol desde localStorage, no del select (que ya cerró)
function verificarRol() {
    const tipo = localStorage.getItem("tipoUsuario") || "estudiante";
    const btn  = document.getElementById("btnCrearEvento");
    if (btn) btn.style.display = (tipo !== "estudiante") ? "block" : "none";
}

// ─── PERFIL ───────────────────────────────────────────────────
function actualizarPerfil() {
    const nombre = localStorage.getItem("usuarioActual") || "Usuario";
    const tipo   = localStorage.getItem("tipoUsuario")   || "estudiante";

    const elNombre = document.getElementById("nombre");
    const elRango  = document.getElementById("rango");
    if (elNombre) elNombre.textContent = nombre;
    if (elRango)  elRango.textContent  =
        tipo === "profesor"       ? "Profesor"       :
        tipo === "administrativo" ? "Administrativo" : "Estudiante";
}

// FIX #3: función que antes no existía
function cambiarContrasena() {
    const nueva = prompt("Ingresá tu nueva contraseña:");
    if (!nueva || nueva.trim() === "") return alert("La contraseña no puede estar vacía");
    // Guardá aquí contra tu backend; por ahora sólo avisamos
    alert("Contraseña actualizada correctamente ✅");
}

// ─── EVENTOS ─────────────────────────────────────────────────
// FIX #6: contador de resultados al buscar
function buscarEventos() {
    const termino  = document.getElementById("buscador").value.toLowerCase();
    const tarjetas = document.querySelectorAll("#listaEventos .evento");
    let visibles   = 0;

    tarjetas.forEach(tarjeta => {
        const titulo   = tarjeta.dataset.titulo.toLowerCase();
        const carrera  = tarjeta.dataset.carrera;
        const coincideTexto   = titulo.includes(termino);
        const coincideCarrera = carreraFiltrada === "todos" || carrera === carreraFiltrada;
        const mostrarTarjeta  = coincideTexto && coincideCarrera;

        tarjeta.style.display = mostrarTarjeta ? "block" : "none";
        if (mostrarTarjeta) visibles++;
    });

    // FIX #6: actualizar contador de resultados
    const contador = document.getElementById("contadorResultados");
    if (contador) {
        contador.textContent = termino || carreraFiltrada !== "todos"
            ? `${visibles} resultado${visibles !== 1 ? "s" : ""}`
            : "";
    }
}

function filtrarCarrera(carrera, elemento) {
    carreraFiltrada = carrera;
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('activo'));
    elemento.classList.add('activo');
    buscarEventos();
}

// FIX #2: función que antes no existía
function anotarseEvento(idEvento, tipo) {
    const usuario = localStorage.getItem("usuarioActual");
    if (!usuario) return alert("Tenés que iniciar sesión primero");

    // Clave única por evento en localStorage
    const clave    = `inscriptos_${idEvento}`;
    let inscriptos = JSON.parse(localStorage.getItem(clave) || "[]");

    const btn      = document.getElementById(`btn${capitalizar(idEvento)}`);
    const contador = document.getElementById(`contador${capitalizar(idEvento)}`);

    if (inscriptos.includes(usuario)) {
        // Des-anotarse
        inscriptos = inscriptos.filter(u => u !== usuario);
        localStorage.setItem(clave, JSON.stringify(inscriptos));
        if (btn)      btn.textContent = "Anotarse";
        if (contador) contador.textContent = inscriptos.length > 0
            ? `✅ ${inscriptos.length} anotado${inscriptos.length !== 1 ? "s" : ""}`
            : "";
        alert("Te desanotaste del evento");
    } else {
        // Anotarse
        inscriptos.push(usuario);
        localStorage.setItem(clave, JSON.stringify(inscriptos));
        if (btn)      btn.textContent = "Desanotarse";
        if (contador) contador.textContent =
            `✅ ${inscriptos.length} anotado${inscriptos.length !== 1 ? "s" : ""}`;
        alert(`Te anotaste al evento ${tipo === "obligatorio" ? "✅ (obligatorio)" : "🟢 (opcional)"}`);
    }
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Restaura estado de botones de eventos al cargar
function restaurarEventos() {
    const usuario = localStorage.getItem("usuarioActual");
    if (!usuario) return;

    document.querySelectorAll("#listaEventos .evento").forEach(tarjeta => {
        // Buscamos el botón dentro de la tarjeta
        const btn = tarjeta.querySelector("button[id^='btnEvento']");
        if (!btn) return;
        const idEvento = btn.id.replace("btn", "").replace(/^E/, "e"); // btnEvento1 → evento1
        const clave    = `inscriptos_${idEvento}`;
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

// ─── FOTO DE PERFIL ───────────────────────────────────────────
function iniciarCambioFoto() {
    const input = document.getElementById("cambiarFoto");
    if (!input) return;
    input.addEventListener("change", function () {
        const file   = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const foto = document.getElementById("fotoPerfil");
            if (foto) foto.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ─── CREAR EVENTO ────────────────────────────────────────────
function crearEvento() {
    const titulo  = document.getElementById("nuevoTitulo").value.trim();
    const carrera = document.getElementById("nuevaCarrera").value;
    const fecha   = document.getElementById("nuevaFecha").value.trim();
    const tipo    = document.getElementById("nuevoTipo").value;

    if (!titulo) return alert("Ingresá un título para el evento");
    if (!fecha)  return alert("Ingresá la fecha del evento");

    const id  = "evento" + Date.now();
    const div = document.createElement("div");
    div.className = "evento";
    div.dataset.titulo  = titulo;
    div.dataset.carrera = carrera;
    div.dataset.fecha   = fecha;
    div.dataset.tipo    = tipo;

    const etiquetaCarrera = {
        "general":         "🌎 Para: Todas las carreras",
        "Ciencia de Datos":"📊 Ciencia de Datos",
        "Farmacia":        "💊 Farmacia",
        "Trabajo Social":  "🤝 Trabajo Social"
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

    // Limpiar formulario
    document.getElementById("nuevoTitulo").value = "";
    document.getElementById("nuevaFecha").value  = "";

    mostrar('eventos');
    alert(`Evento "${titulo}" creado correctamente ✅`);
}

// ─── INIT ─────────────────────────────────────────────────────
window.onload = () => {
    if (localStorage.getItem("usuarioActual")) {
        document.getElementById("login-container").style.display = "none";
        mostrar('inicio');
        verificarRol();       // FIX #5: se llama también al recargar
        actualizarPerfil();
        restaurarEventos();
    }

    const buscador = document.getElementById("buscador");
    if (buscador) buscador.addEventListener("input", buscarEventos);

    iniciarCambioFoto();
}