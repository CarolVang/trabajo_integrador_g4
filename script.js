/* ================= VARIABLES GLOBALES ================= */
let tiposEventos = { evento1: "opcional", evento2: "obligatorio" };
let fechasLimite = { 
    evento1: new Date(2026, 4, 25, 20, 0), 
    evento2: new Date(2026, 4, 28, 10, 0) 
};
let carreraFiltrada = "todos";
let eventoActual = "";
let contadorEventos = 3;

/* ================= NAVEGACIÓN ================= */
function mostrar(seccion) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    const seccionActiva = document.getElementById(seccion);
    if (seccionActiva) {
        seccionActiva.classList.add("active");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    document.querySelectorAll(".btn-menu").forEach(b => {
        b.classList.remove("activo");
        if (b.getAttribute("onclick").includes(seccion)) b.classList.add("activo");
    });
}

/* ================= LOGIN & WIFI ================= */
const wifiData = {
    estudiante: { nombre: "Estudiantes", contraseña: "Escuelas_2025" },
    profesor: { nombre: "Docentes", contraseña: "Docentes_2025" },
    administrativo: { nombre: "Administracion", contraseña: "Admin_2025" }
};

function login() {
    const nombre = document.getElementById("nombreLogin").value;
    const pass = document.getElementById("passwordLogin").value;
    if (!nombre) return alert("Ingresá un nombre");

    const passGuardada = localStorage.getItem("pass_" + nombre);
    if (!passGuardada) localStorage.setItem("pass_" + nombre, pass);
    else if (pass !== passGuardada) return alert("Contraseña incorrecta");

    localStorage.setItem("usuarioActual", nombre);
    document.getElementById("login-container").style.display = "none";
    mostrar("inicio");
    verificarRol();
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    location.reload();
}

/* ================= FILTROS Y BUSCADOR ================= */
function filtrarCarrera(carrera, elemento) {
    carreraFiltrada = carrera;
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('activo'));
    elemento.classList.add('activo');
    buscarEventos();
}

function buscarEventos() {
    const termino = document.getElementById("buscador").value.toLowerCase().trim();
    const tarjetas = document.querySelectorAll("#listaEventos .evento");
    let visibles = 0;

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta.dataset.titulo.toLowerCase();
        const carrera = tarjeta.dataset.carrera;

        const coincideTexto = termino === "" || titulo.includes(termino);
        const coincideCarrera = carreraFiltrada === "todos" || carrera === carreraFiltrada;

        if (coincideTexto && coincideCarrera) {
            tarjeta.style.display = "block";
            visibles++;
        } else {
            tarjeta.style.display = "none";
        }
    });

    document.getElementById("contadorResultados").innerText = (termino || carreraFiltrada !== "todos") ? `${visibles} resultados` : "";
}

/* ================= GESTIÓN DE EVENTOS ================= */
function anotarseEvento(idEvento, tipo) {
    eventoActual = idEvento;
    mostrar('formEvento');
}

function crearEvento() {
    const titulo = document.getElementById("nuevoTitulo").value;
    const fecha = document.getElementById("nuevaFecha").value;
    const carrera = document.getElementById("nuevaCarrera").value;
    const tipo = document.getElementById("nuevoTipo").value;
    const limite = document.getElementById("nuevoLimite").value;

    if (!titulo || !fecha) return alert("Completá los datos");

    const id = "evento" + contadorEventos++;
    tiposEventos[id] = tipo;
    if (limite) fechasLimite[id] = new Date(limite);

    const contenedor = document.getElementById("listaEventos");
    const div = document.createElement("div");
    div.className = "evento";
    div.dataset.titulo = titulo;
    div.dataset.carrera = carrera;

    const idCapit = id.charAt(0).toUpperCase() + id.slice(1);
    const labelCarrera = carrera === "general" ? "Todas las carreras" : carrera;

    div.innerHTML = `
        <h3>${titulo}</h3>
        <p class="tag-carrera">📍 Para: ${labelCarrera}</p>
        <p>${fecha}</p>
        <p>${tipo === "obligatorio" ? "🔴 Obligatorio" : "🟢 Opcional"}</p>
        <span id="contador${idCapit}" class="contador-evento"></span>
        <div class="evento-botones">
            <button id="btn${idCapit}" onclick="anotarseEvento('${id}', '${tipo}')">Anotarse</button>
        </div>
    `;

    contenedor.prepend(div);
    mostrar('eventos');
    buscarEventos();
}

function verificarRol() {
    const tipo = document.getElementById("tipo").value;
    const btn = document.getElementById("btnCrearEvento");
    if (btn) btn.style.display = (tipo === "profesor" || tipo === "administrativo") ? "block" : "none";
}

/* ================= INICIO ================= */
window.onload = function() {
    mostrar('inicio');
    
    // Listener buscador
    document.getElementById("buscador").addEventListener("input", buscarEventos);

    // Listener Wifi
    document.getElementById("tipo").addEventListener("change", function() {
        const val = this.value;
        document.getElementById("wifiNombre").innerText = "Red: " + wifiData[val].nombre;
        document.getElementById("wifiPass").innerText = "Pass: " + wifiData[val].contraseña;
    });

    // Mostrar password
    document.getElementById("verPassword").addEventListener("change", function() {
        document.getElementById("passwordLogin").type = this.checked ? "text" : "password";
    });

    setInterval(actualizarContadores, 1000);
};

function actualizarContadores() {
    const ahora = new Date();
    Object.keys(fechasLimite).forEach(id => {
        const idCapit = id.charAt(0).toUpperCase() + id.slice(1);
        const span = document.getElementById("contador" + idCapit);
        if (!span) return;
        const dif = fechasLimite[id] - ahora;
        if (dif <= 0) span.innerText = "Cerrado";
        else span.innerText = "Cierra en: " + Math.floor(dif/1000/60) + "m";
    });
}