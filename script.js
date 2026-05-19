let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [

    {
        dni: "35111222",
        nombre: "Juan Pérez",
        usuario: "jperez",
        email: "juan.perez@alumno.isfdyt57.edu.ar",
        rol: "alumno"
    },

    {
        dni: "40123456",
        nombre: "Profesor",
        usuario: "profe",
        email: "profe@isfdyt57.edu.ar",
        rol: "profesor"
    },

    {
        dni: "99999999",
        nombre: "Administrador",
        usuario: "admin",
        email: "admin@isfdyt57.edu.ar",
        rol: "admin"
    }

];

let usuarioActivo = null;

/* =========================
   LOGIN
========================= */

function login() {

    const usuario =
        document.getElementById("loginUsuario").value;

    const dni =
        document.getElementById("loginDni").value;

    const encontrado = usuarios.find(u =>

        u.usuario === usuario &&
        u.dni === dni

    );

    if (!encontrado) {

        alert("Usuario o DNI incorrecto");
        return;
    }

    usuarioActivo = encontrado;

    localStorage.setItem(
        "usuarioActivo",
        JSON.stringify(encontrado)
    );

    document.getElementById("auth")
        .style.display = "none";

    aplicarPermisos();
}

/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("usuarioActivo");

    location.reload();
}

/* =========================
   REGISTRO
========================= */

function registrar() {

    const nuevo = {

        nombre:
            document.getElementById("regNombre").value,

        usuario:
            document.getElementById("regUsuario").value,

        email:
            document.getElementById("regEmail").value,

        dni:
            document.getElementById("regDni").value,

        rol:
            document.getElementById("regRol").value
    };

    if (usuarios.some(u =>
        u.usuario === nuevo.usuario
    )) {

        alert("El usuario ya existe");
        return;
    }

    usuarios.push(nuevo);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    alert("Registrado correctamente");

    mostrarLogin();
}

/* =========================
   PERMISOS
========================= */

function aplicarPermisos() {

    const info =
        document.getElementById("info-usuario");

    const btnAdmin =
        document.getElementById("btnAdmin");

    const btnCargarNotas =
        document.getElementById("btnCargarNotas");

    // RESET

    btnAdmin.style.display = "none";
    btnCargarNotas.style.display = "none";

    // INFO USUARIO

    info.textContent =
        `${usuarioActivo.nombre} | ${usuarioActivo.rol.toUpperCase()}`;

    // ALUMNO

    if (usuarioActivo.rol === "alumno") {

        info.style.background = "#2563eb";
    }

    // PROFESOR

    if (usuarioActivo.rol === "profesor") {

        info.style.background = "#059669";

        btnCargarNotas.style.display = "block";
    }

    // ADMIN

    if (usuarioActivo.rol === "admin") {

        info.style.background = "#dc2626";

        btnAdmin.style.display = "block";

        btnCargarNotas.style.display = "block";
    }
}

/* =========================
   CAMBIAR SECCIONES
========================= */

function mostrar(seccion) {

    document.querySelectorAll("section")
        .forEach(s => s.classList.remove("active"));

    const sec = document.getElementById(seccion);

    if (sec) {

        sec.classList.add("active");
    }
}

/* =========================
   LOGIN / REGISTRO
========================= */

function mostrarRegistro() {

    document.getElementById("loginBox")
        .classList.add("hidden");

    document.getElementById("registroBox")
        .classList.remove("hidden");
}

function mostrarLogin() {

    document.getElementById("registroBox")
        .classList.add("hidden");

    document.getElementById("loginBox")
        .classList.remove("hidden");
}

/* =========================
   AUTO LOGIN
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const guardado =
        localStorage.getItem("usuarioActivo");

    if (guardado) {

        usuarioActivo = JSON.parse(guardado);

        document.getElementById("auth")
            .style.display = "none";

        aplicarPermisos();
    }
});