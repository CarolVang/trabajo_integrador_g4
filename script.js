let carreraFiltrada = "todos";

function mostrar(seccion) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(seccion);
    if (target) target.classList.add("active");
}

function login() {
    const nombre = document.getElementById("nombreLogin").value;
    if (!nombre) return alert("Ingresá tu nombre");
    localStorage.setItem("usuarioActual", nombre);
    document.getElementById("login-container").style.display = "none";
    mostrar('inicio');
    verificarRol();
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    location.reload();
}

function filtrarCarrera(carrera, elemento) {
    carreraFiltrada = carrera;
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('activo'));
    elemento.classList.add('activo');
    buscarEventos();
}

function buscarEventos() {
    const termino = document.getElementById("buscador").value.toLowerCase();
    const tarjetas = document.querySelectorAll("#listaEventos .evento");

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta.dataset.titulo.toLowerCase();
        const carrera = tarjeta.dataset.carrera;
        const coincideTexto = titulo.includes(termino);
        const coincideCarrera = carreraFiltrada === "todos" || carrera === carreraFiltrada;

        tarjeta.style.display = (coincideTexto && coincideCarrera) ? "block" : "none";
    });
}

function verificarRol() {
    const tipo = document.getElementById("tipo").value;
    const btn = document.getElementById("btnCrearEvento");
    if (btn) btn.style.display = (tipo !== "estudiante") ? "block" : "none";
}

window.onload = () => {
    if (localStorage.getItem("usuarioActual")) {
        document.getElementById("login-container").style.display = "none";
        mostrar('inicio');
    }
    document.getElementById("buscador").addEventListener("input", buscarEventos);
};