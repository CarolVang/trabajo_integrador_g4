function mostrar(seccion){
    // oculta todas las secciones
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    // muestra la seleccionada
    const seccionActiva = document.getElementById(seccion);
    if(seccionActiva){
        seccionActiva.classList.add("active");
        seccionActiva.scrollIntoView({ behavior: "smooth" });
    }

    // quitar activo a todos los botones
    document.querySelectorAll(".menu-principal button")
        .forEach(b => b.classList.remove("activo"));

    // marcar botón activo
    const botones = document.querySelectorAll(".menu-principal button");

    botones.forEach(boton => {
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