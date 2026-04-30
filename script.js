function mostrar(seccion){
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    const seccionActiva = document.getElementById(seccion);
    if(seccionActiva){
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

    verificarRol(); // 🔥 mostrar botón crear evento
}

/* ================= LOGOUT ================= */
function cerrarSesion(){
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}

/* ================= EVENTOS ================= */

let tiposEventos = {
    evento1: "opcional",
    evento2: "obligatorio"
};

let eventoActual = "";
let contadorEventos = 3;

/* 🔹 ANOTARSE */
function anotarseEvento(idEvento, tipo){
    eventoActual = idEvento;

    const titulo = document.getElementById("tituloForm");
    if(titulo){
        titulo.innerText = (tipo === "obligatorio")
            ? "Confirmar asistencia"
            : "Inscripción al evento";
    }

    mostrar('formEvento');
}

/* 🔹 ENVIAR */
function enviarFormulario(){
    const nombre = document.getElementById("formNombre").value;
    const apellido = document.getElementById("formApellido").value;
    const email = document.getElementById("formEmail").value;
    const telefono = document.getElementById("formTelefono").value;

    if(nombre && apellido && email && telefono){

        const tipo = tiposEventos[eventoActual] || "opcional";

        if(tipo === "obligatorio"){
            localStorage.setItem(eventoActual, "confirmado");
        } else {
            localStorage.setItem(eventoActual, "anotado");
        }

        mostrar('eventos');

        const btn = document.getElementById("btn" + eventoActual.charAt(0).toUpperCase() + eventoActual.slice(1));

        if(btn){
            btn.innerText = (tipo === "obligatorio") ? "Confirmado" : "Anotado";
            btn.disabled = true;
        }

    } else {
        alert("Completá todos los campos");
    }
}

/* 🔹 CREAR EVENTO */
function crearEvento(){
    const titulo = document.getElementById("nuevoTitulo").value;
    const fecha = document.getElementById("nuevaFecha").value;
    const tipo = document.getElementById("nuevoTipo").value;

    if(titulo && fecha){

        const id = "evento" + contadorEventos++;

        tiposEventos[id] = tipo;

        const contenedor = document.getElementById("listaEventos");

        const nuevoEvento = document.createElement("div");
        nuevoEvento.classList.add("evento");

        nuevoEvento.innerHTML = `
            <h3>${titulo}</h3>
            <p>${fecha}</p>
            <p>${tipo === "obligatorio" ? "🔴 Obligatorio" : "🟢 Opcional"}</p>
            <button id="btn${id.charAt(0).toUpperCase() + id.slice(1)}"
                onclick="anotarseEvento('${id}', '${tipo}')">
                ${tipo === "obligatorio" ? "Confirmar asistencia" : "Anotarse"}
            </button>
        `;

        contenedor.appendChild(nuevoEvento);

        mostrar('eventos');

    } else {
        alert("Completá los datos");
    }
}

/* 🔹 CONTROL DE ROL */
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

/* ================= INICIO ================= */
window.onload = function() {

    mostrar('inicio');

    const tipoSelect = document.getElementById("tipo");

    if(tipoSelect){
        tipoSelect.addEventListener("change", () => {
            const tipo = tipoSelect.value;

            document.getElementById("wifiNombre").innerText = "Nombre: " + wifiData[tipo].nombre;
            document.getElementById("wifiPass").innerText = "Contraseña: " + wifiData[tipo].contraseña;

            verificarRol(); // 🔥 cada vez que cambia el rol
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

    // 🔥 restaurar estado eventos
    Object.keys(tiposEventos).forEach(id => {
        const estado = localStorage.getItem(id);
        const btn = document.getElementById("btn" + id.charAt(0).toUpperCase() + id.slice(1));

        if(btn && estado){
            btn.innerText = (estado === "confirmado") ? "Confirmado" : "Anotado";
            btn.disabled = true;
        }
    });

};