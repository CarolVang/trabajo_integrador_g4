function mostrar(seccion){
    // oculta todas las secciones
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    // muestra la seleccionada
    const seccionActiva = document.getElementById(seccion);
    seccionActiva.classList.add("active");

    // 👇 ESTO HACE QUE BAJE LA PANTALLA
    seccionActiva.scrollIntoView({ behavior: "smooth" });

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


const wifiData = {
    estudiante: {nombre:"Estudiantes", contraseña:"Escuelas_2025"},
    profesor: {nombre:"Docentes", contraseña:"Docentes_2025"},
    video: {nombre:"Videollamada", contraseña:"Video_2025"},
    administrativo: {nombre:"Administracion", contraseña:"Admin_2025"}
};

const tipoSelect = document.getElementById("tipo");

tipoSelect.addEventListener("change", () => {
    const tipo = tipoSelect.value;
    document.getElementById("wifiNombre").innerText = "Nombre: " + wifiData[tipo].nombre;
    document.getElementById("wifiPass").innerText = "Contraseña: " + wifiData[tipo].contraseña;
});

document.getElementById("verPassword").addEventListener("change", function(){
    const pass = document.getElementById("passwordLogin");
    pass.type = this.checked ? "text" : "password";
});

tipoSelect.dispatchEvent(new Event("change"));

function login(){
    const nombre = document.getElementById("nombreLogin").value;
    const password = document.getElementById("passwordLogin").value;
/*ACA SE CAMBIA LA CONTRASEÑA */
    if(password === ""){
        document.getElementById("login-container").style.display = "none";
        mostrar("novedades");
        
    } }
  window.onload = function() {
    mostrar('inicio');
}
function cerrarSesion(){
    // mostrar login otra vez
    document.getElementById("login-container").style.display = "flex";

    // ocultar todas las secciones
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}
