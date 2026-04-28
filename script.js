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
let eventoActual = "";

function anotarseEvento(idEvento){

    eventoActual = idEvento;

    const nombresEventos = {
        evento1: "Fiesta del Instituto"
    };

    // 🔥 ACA usamos el campo oculto
    document.getElementById("eventoSeleccionado").value = nombresEventos[idEvento];

    mostrar('formEvento');
}


function enviarFormulario(){
    const nombre = document.getElementById("formNombre").value;
    const apellido = document.getElementById("formApellido").value;
    const email = document.getElementById("formEmail").value;
    const telefono = document.getElementById("formTelefono").value;

    // 🔥 obtenemos el evento desde el campo oculto
    const evento = document.getElementById("eventoSeleccionado").value;

    if(nombre && apellido && email && telefono){

        console.log("Inscripción:");
        console.log("Nombre:", nombre);
        console.log("Apellido:", apellido);
        console.log("Email:", email);
        console.log("Teléfono:", telefono);
        console.log("Evento:", evento);

        localStorage.setItem(eventoActual, "anotado");

        mostrar('eventos');

        const btn = document.getElementById("btnEvento1");
        if(btn){
            btn.innerText = "Anotado";
            btn.disabled = true;
        }

    } else {
        alert("Completá todos los campos");
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

    // ESTADO EVENTO
    if(localStorage.getItem("evento1") === "anotado"){
        const btn = document.getElementById("btnEvento1");
        if(btn){
            btn.innerText = "Anotado";
            btn.disabled = true;
        }
    }

};

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


/* ================= INICIO ================= */
window.onload = function() {

    mostrar('inicio');

    const tipoSelect = document.getElementById("tipo");

    if(tipoSelect){
        tipoSelect.addEventListener("change", () => {
            const tipo = tipoSelect.value;
            document.getElementById("wifiNombre").innerText = "Nombre: " + wifiData[tipo].nombre;
            document.getElementById("wifiPass").innerText = "Contraseña: " + wifiData[tipo].contraseña;
        });

        tipoSelect.dispatchEvent(new Event("change"));
    }

    const verPass = document.getElementById("verPassword");

    if(verPass){
        verPass.addEventListener("change", function(){
            const pass = document.getElementById("passwordLogin");
            pass.type = this.checked ? "text" : "password";
        });
    }
}


/* ================= LOGOUT ================= */
function cerrarSesion(){
    document.getElementById("login-container").style.display = "flex";

    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}
let eventoActual = "";

function anotarseEvento(idEvento){
    eventoActual = idEvento;
    mostrar('formEvento');
}

function enviarFormulario(){
    const nombre = document.getElementById("formNombre").value;
    const apellido = document.getElementById("formApellido").value;
    const email = document.getElementById("formEmail").value;
    const telefono = document.getElementById("formTelefono").value;

    if(nombre && apellido && email && telefono){
        // Guardamos inscripción
        localStorage.setItem(eventoActual, "anotado");

        // Volver a eventos
        mostrar('eventos');

        // Cambiar botón
        document.getElementById("btnEvento1").innerText = "Anotado";
        document.getElementById("btnEvento1").disabled = true;
    } else {
        alert("Completá todos los campos");
    }
}
window.onload = function(){
    if(localStorage.getItem("evento1") === "anotado"){
        document.getElementById("btnEvento1").innerText = "Anotado";
        document.getElementById("btnEvento1").disabled = true;
    }
}