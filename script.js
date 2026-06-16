let primeraCarga = true;

function mostrar(seccion, hacerScroll = true) {

    // Oculta todas las secciones
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));

    // Muestra la sección pedida
    // Usamos un guard para evitar crashes si la sección no existe
    const seccionActiva = document.getElementById(seccion);
    if (!seccionActiva) {
        console.warn("mostrar(): no existe la sección con id='" + seccion + "'");
        return;
    }
    seccionActiva.classList.add("active");

    // Scroll suave, solo después de la primera carga
   if (!primeraCarga && hacerScroll) {
    const topbar = document.querySelector(".topbar");
    const topbarAltura = topbar ? topbar.offsetHeight : 0;
    const y = seccionActiva.getBoundingClientRect().top + window.scrollY - topbarAltura - 16;
    window.scrollTo({ top: y, behavior: "smooth" });
}

    primeraCarga = false;

    // ─── FIX: era ".menu-principal button", ahora es ".nav-links button" ───
    // Quitar clase activo de todos los botones de navegación
    document.querySelectorAll(".nav-links button")
        .forEach(b => b.classList.remove("activo"));

    // Marcar como activo el botón que corresponde a esta sección
    document.querySelectorAll(".nav-links button").forEach(boton => {
        const onclick = boton.getAttribute("onclick");
        if (onclick && onclick.includes(seccion)) {
            boton.classList.add("activo");
        }
    });
}


// ─── WIFI DATA ───────────────────────────────────────────────
const wifiData = {
    estudiante:    { nombre: "Estudiantes",  contraseña: "Escuelas_2025" },
    profesor:      { nombre: "Docentes",     contraseña: "Docentes_2025" },
    video:         { nombre: "Videollamada", contraseña: "Video_2025"    },
    administrativo:{ nombre: "Administracion",contraseña: "Admin_2025"  }
};

const tipoSelect = document.getElementById("tipo");

tipoSelect.addEventListener("change", () => {
    const tipo = tipoSelect.value;
    const data = wifiData[tipo];
    if (data) {
        document.getElementById("wifiNombre").innerText = "Nombre: "     + data.nombre;
        document.getElementById("wifiPass").innerText   = "Contraseña: " + data.contraseña;
    }
});

document.getElementById("verPassword").addEventListener("change", function () {
    const pass = document.getElementById("passwordLogin");
    pass.type = this.checked ? "text" : "password";
});

// Disparar el evento para mostrar wifi al cargar
tipoSelect.dispatchEvent(new Event("change"));


// ─── LOGIN ───────────────────────────────────────────────────
function login() {
    
    const password = document.getElementById("passwordLogin").value;

    if (password === "") {
        document.getElementById("login-container").style.display = "none";
        mostrar("inicio", false); // ← ahora queda en inicio
    }
}

window.onload = function () {
    mostrar("inicio", false); // sin scroll al cargar
};


// ─── CERRAR SESIÓN ───────────────────────────────────────────
function cerrarSesion() {
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
}
function renderEventosLista() {
    
    const contenedor = document.getElementById('cal-eventos-lista');
    const lista = allEventosDelMes(currentYear, currentMonth);
    if (lista.length === 0) {
        contenedor.innerHTML = '<p style="padding:12px 16px; font-size:0.88rem; color:#888;">Sin eventos este mes.</p>';
        return;
    }
    contenedor.innerHTML = lista.map(ev => `
        <div class="cal-evento">
            <span class="dot ${ev.color}"></span>
            <strong>${String(ev.dia).padStart(2,'0')} ${MESES[ev.mes].slice(0,3)}</strong>
            &nbsp;${ev.desc}
        </div>
    `).join('');
}
// ── ACORDEÓN CORRELATIVAS ──
function toggleCorr(btn) {
    const body = btn.nextElementSibling;
    const isOpen = btn.classList.contains("open");

    // Cierra todos los que estén abiertos
    document.querySelectorAll(".acord-trigger.open").forEach(b => {
        b.classList.remove("open");
        b.nextElementSibling.classList.remove("open");
    });

    // Si estaba cerrado, lo abre
    if (!isOpen) {
        btn.classList.add("open");
        body.classList.add("open");
    }
}
// mas actividades calendario
function toggleTodosEventos(e) {
    e.preventDefault();
    const div = document.getElementById('todos-eventos');
    const lista = document.getElementById('todos-eventos-lista');
    const link = document.getElementById('ver-mas-cal');

    if (div.style.display === 'none') {
        // Construir lista de todos los años y meses
        let html = '';
        for (const year in eventos) {
            for (const month in eventos[year]) {
                const evs = allEventosDelMes(Number(year), Number(month));
                if (evs.length > 0) {
                    html += `<p style="font-size:0.8rem; font-weight:700; text-transform:uppercase; color:#888; margin:12px 0 6px;">${MESES[month]} ${year}</p>`;
                    html += evs.map(ev => `
                        <div class="cal-evento">
                            <span class="dot ${ev.color}"></span>
                            <strong>${String(ev.dia).padStart(2,'0')} ${MESES[month].slice(0,3)}</strong>
                            &nbsp;${ev.desc}
                        </div>
                    `).join('');
                }
            }
        }
        lista.innerHTML = html || '<p style="color:#888; font-size:0.88rem;">No hay eventos cargados.</p>';
        div.style.display = 'block';
        link.textContent = '- Ocultar actividades';
    } else {
        div.style.display = 'none';
        link.textContent = '+ Ver más actividades';
    }
}
// memoria

function mostrar(id) {
    // Agregamos 'memoria' a la lista para que el script sepa que existe
    const secciones = ['inicio', 'novedades', 'eventos', 'reglamentos', 'correlativas', 'calendario', 'memoria'];
    
    secciones.forEach(s => {
        const elemento = document.getElementById(s);
        if (elemento) {
            elemento.style.display = 'none';
        }
    });

    const seccionAMostrar = document.getElementById(id);
    if (seccionAMostrar) {
        seccionAMostrar.style.display = 'block';
    }
}
