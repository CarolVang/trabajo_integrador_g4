// js/login.js - Versión conectada a la API
async function login() {
    const tipo = document.getElementById('tipo').value;
    const nombre = document.getElementById('nombreLogin').value.trim();
    const password = document.getElementById('passwordLogin').value.trim();

    if (!nombre || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // 1. Llamamos a la API a través del puente que creamos
    // (Asegurate de tener el archivo js/api.js creado con el código que te pasé)
    const usuarios = await api.getUsuarios();

    if (!usuarios) {
        alert("Error al conectar con la API. Verifica tu conexión a internet.");
        return;
    }

    // 2. Buscamos al usuario en la base de datos real de la API
    // Usamos 'usuario' para el nombre y 'dni' para la contraseña
    const encontrado = usuarios.find(u => u.usuario === nombre && u.dni === password);

    if (encontrado) {
        alert("¡Bienvenido/a " + encontrado.nombre + "!");
        
        // Guardamos la sesión en el navegador
        localStorage.setItem('usuarioLogueado', JSON.stringify(encontrado));

        // 3. Tu lógica de interfaz original
        document.getElementById('login-container').style.display = 'none';
        
        // Si tenés la función mostrar('inicio'), la llamamos
        if (typeof mostrar === 'function') {
            mostrar('inicio');
        }
        
        // Mostramos los datos del WiFi
        document.getElementById('wifiNombre').innerText = "Red: Estudiantes_Libre";
        document.getElementById('wifiPass').innerText = "Pass: Instituto57";
        document.getElementById('wifi').style.display = 'block';

    } else {
        alert("Usuario o contraseña (DNI) incorrectos. \n\nPrueba con: \nUsuario: admin \nContraseña: 1234");
    }
}
