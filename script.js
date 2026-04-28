function mostrar(seccion){
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    const seccionActiva = document.getElementById(seccion);
    if(seccionActiva){
        seccionActiva.classList.add("active");
        seccionActiva.scrollIntoView({ behavior: "smooth" });
    }

    document.querySelectorAll(".menu-principal button")
        .forEach(b => b.classList.remove("activo"));

    document.querySelectorAll(".menu-principal button")
        .forEach(boton => {
            if (boton.getAttribute("onclick").includes(seccion)) {
                boton.classList.add("activo");
            }
        });
}


/* ================= WIFI ================= */
const wifiData = {
    estudiante: {nombre:"Estudiantes", contraseña:"Escuelas_2025"},
    profesor: {nombre:"Docentes", contraseña:"Docentes_2025"},
    video: {nombre:"Videollamada", contraseña:"Video_2025"},
    administrativo: {nombre:"Administracion", contraseña:"Admin_2025"}
};


/* ================= LOGIN ================= */
function login(){
    const nombre = document.getElementById("nombreLogin").value;

    if(nombre === ""){
        alert("Ingresá un nombre");
        return;
    }

    document.getElementById("login-container").style.display = "none";
    mostrar("inicio");
}


/* ================= LOGOUT ================= */
function cerrarSesion(){
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}


/* ================= EVENTOS ================= */
/* ================= EVENTOS ================= */

// Lista de eventos (base)
let eventos = [
    {id:"evento1", titulo:"Fiesta del Instituto", fecha:"Viernes 25 - 20:00", tipo:"opcional"},
    {id:"evento2", titulo:"Presentación de trabajos", fecha:"Lunes 28 - 10:00", tipo:"obligatorio"}
];

let eventoActual = "";


/* 🔽 MOSTRAR EVENTOS DINÁMICOS */
function renderEventos(){
    const contenedor = document.getElementById("listaEventos");

    if(!contenedor) return;

    contenedor.innerHTML = "";

    eventos.forEach(e => {

        const estado = localStorage.getItem(e.id);

        let boton = "";

        if(e.tipo === "opcional"){
            boton = (estado === "anotado")
                ? `<button disabled>Anotado</button>`
                : `<button onclick="abrirFormulario('${e.id}')">Anotarse</button>`;
        }

        if(e.tipo === "obligatorio"){
            boton = (estado === "confirmado")
                ? `<button disabled>Confirmado</button>`
                : `<button onclick="abrirFormulario('${e.id}')">Confirmar asistencia</button>`;
        }

        contenedor.innerHTML += `
            <div class="evento">
                <h3>${e.titulo}</h3>
                <p>${e.fecha}</p>
                <p>${e.tipo === "obligatorio" ? "🔴 Obligatorio" : "🟢 Opcional"}</p>
                ${boton}
            </div>
        `;
    });
}


/* 🔽 ABRIR FORMULARIO */
function abrirFormulario(idEvento){

    eventoActual = idEvento;

    const evento = eventos.find(e => e.id === idEvento);

    document.getElementById("eventoSeleccionado").value = evento.titulo;

    document.getElementById("tituloForm").innerText =
        evento.tipo === "obligatorio"
        ? "Confirmar asistencia"
        : "Inscripción al evento";

    mostrar('formEvento');
}


/* 🔽 ENVIAR FORMULARIO */
function enviarFormulario(){
    const nombre = document.getElementById("formNombre").value;
    const apellido = document.getElementById("formApellido").value;
    const email = document.getElementById("formEmail").value;
    const telefono = document.getElementById("formTelefono").value;

    if(nombre && apellido && email && telefono){

        const evento = eventos.find(e => e.id === eventoActual);

        if(evento.tipo === "obligatorio"){
            localStorage.setItem(eventoActual, "confirmado");
        } else {
            localStorage.setItem(eventoActual, "anotado");
        }

        mostrar('eventos');
        renderEventos();

    } else {
        alert("Completá todos los campos");
    }
}


/* 🔽 CREAR EVENTO (SOLO ADMIN/PROFE) */
function crearEvento(){

    const titulo = document.getElementById("nuevoTitulo").value;
    const fecha = document.getElementById("nuevaFecha").value;
    const tipo = document.getElementById("nuevoTipo").value;

    if(titulo && fecha){

        const id = "evento" + (eventos.length + 1);

        eventos.push({id, titulo, fecha, tipo});

        mostrar('eventos');
        renderEventos();

    } else {
        alert("Completá los datos");
    }
}


/* 🔽 CONTROL DE ROLES */
function verificarRol(){

    const tipo = document.getElementById("tipo").value;

    const btn = document.getElementById("btnCrearEvento");

    if(!btn) return;

    if(tipo === "profesor" || tipo === "administrativo"){
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}
/* ================= INICIO GENERAL ================= */
window.onload = function() {

    mostrar('inicio');

    // WIFI
    const tipoSelect = document.getElementById("tipo");

    if(tipoSelect){
        tipoSelect.addEventListener("change", () => {
            const tipo = tipoSelect.value;
            document.getElementById("wifiNombre").innerText = "Nombre: " + wifiData[tipo].nombre;
            document.getElementById("wifiPass").innerText = "Contraseña: " + wifiData[tipo].contraseña;
        });

        tipoSelect.dispatchEvent(new Event("change"));
    }

    // VER PASSWORD
    const verPass = document.getElementById("verPassword");

    if(verPass){
        verPass.addEventListener("change", function(){
            const pass = document.getElementById("passwordLogin");
            pass.type = this.checked ? "text" : "password";
        });
    }

    // ESTADO EVENTO GUARDADO
    if(localStorage.getItem("evento1") === "anotado"){
        const btn = document.getElementById("btnEvento1");
        if(btn){
            btn.innerText = "Anotado";
            btn.disabled = true;
        }
    }

};