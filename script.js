let primeraCarga = true;

// ─── NAVEGACIÓN ───────────────────────────────────────────────
function mostrar(seccion, hacerScroll = true) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    const seccionActiva = document.getElementById(seccion);
    if (!seccionActiva) { console.warn("mostrar(): no existe '" + seccion + "'"); return; }
    seccionActiva.classList.add("active");

    if (!primeraCarga && hacerScroll) {
        const topbar = document.querySelector(".topbar");
        const topbarAltura = topbar ? topbar.offsetHeight : 0;
        const y = seccionActiva.getBoundingClientRect().top + window.scrollY - topbarAltura - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
    }
    primeraCarga = false;

    document.querySelectorAll(".nav-links button").forEach(b => b.classList.remove("activo"));
    document.querySelectorAll(".nav-links button").forEach(boton => {
        const oc = boton.getAttribute("onclick");
        if (oc && oc.includes(`'${seccion}'`)) boton.classList.add("activo");
    });

    // Al abrir eventos, renderizar
    if (seccion === "eventos") { renderEventos(); verificarRol(); }
}

// ─── WIFI ─────────────────────────────────────────────────────
const wifiData = {
    estudiante:     { nombre: "Estudiantes",    contraseña: "Escuelas_2025" },
    profesor:       { nombre: "Docentes",       contraseña: "Docentes_2025" },
    video:          { nombre: "Videollamada",   contraseña: "Video_2025"    },
    administrativo: { nombre: "Administracion", contraseña: "Admin_2025"    }
};

const tipoSelect = document.getElementById("tipo");

tipoSelect.addEventListener("change", () => {
    const data = wifiData[tipoSelect.value];
    if (data) {
        document.getElementById("wifiNombre").innerText = "Nombre: "     + data.nombre;
        document.getElementById("wifiPass").innerText   = "Contraseña: " + data.contraseña;
    }
    verificarRol();
    if (document.getElementById("eventos")?.classList.contains("active")) renderEventos();
});

document.getElementById("verPassword").addEventListener("change", function () {
    document.getElementById("passwordLogin").type = this.checked ? "text" : "password";
});

tipoSelect.dispatchEvent(new Event("change"));

// ─── LOGIN ────────────────────────────────────────────────────
function login() {
    const password = document.getElementById("passwordLogin").value;
    if (password === "") {
        document.getElementById("login-container").style.display = "none";
        mostrar("inicio", false);
        actualizarPerfil();
        verificarRol();
        seedEventoDemo();
        marcarCalendario();
    }
}

// ─── CERRAR SESIÓN ────────────────────────────────────────────
function cerrarSesion() {
    document.getElementById("login-container").style.display = "flex";
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    const pN = document.getElementById("perfilNombre");
    const pR = document.getElementById("perfilRango");
    if (pN) pN.textContent = "—";
    if (pR) pR.textContent = "—";
}

// ─── PERFIL ───────────────────────────────────────────────────
function actualizarPerfil() {
    const nombre = document.getElementById("nombreLogin")?.value.trim() || "Usuario";
    const tipo   = tipoSelect?.value || "estudiante";
    const pN = document.getElementById("perfilNombre");
    const pR = document.getElementById("perfilRango");
    if (pN) pN.textContent = nombre;
    if (pR) pR.textContent = tipo === "profesor" ? "Profesor" : tipo === "administrativo" ? "Administrativo" : "Estudiante";
}

function cambiarContrasena() {
    const nueva = prompt("Ingresá tu nueva contraseña:");
    if (!nueva || nueva.trim() === "") return toast("La contraseña no puede estar vacía.", "error");
    toast("Contraseña actualizada correctamente ✅", "success");
}

function iniciarCambioFoto() {
    const input = document.getElementById("cambiarFoto");
    if (!input) return;
    input.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => { const foto = document.getElementById("fotoPerfil"); if (foto) foto.src = e.target.result; };
        reader.readAsDataURL(file);
    });
}

// ─── ACORDEÓN CORRELATIVAS ────────────────────────────────────
function toggleCorr(btn) {
    const body   = btn.nextElementSibling;
    const isOpen = btn.classList.contains("open");
    document.querySelectorAll(".acord-trigger.open").forEach(b => {
        b.classList.remove("open");
        b.nextElementSibling.classList.remove("open");
    });
    if (!isOpen) { btn.classList.add("open"); body.classList.add("open"); }
}

// ─── INIT ─────────────────────────────────────────────────────
window.onload = function () {
    mostrar("inicio", false);
    iniciarCambioFoto();
    seedEventoDemo();
    marcarCalendario();
};


// ═══════════════════════════════════════════════════════════════
//  MÓDULO DE EVENTOS — completo
// ═══════════════════════════════════════════════════════════════

const EV_KEY = "ce_eventos_v2";

// ── Storage ──────────────────────────────────────────────────
function cargarEventos() {
    try { return JSON.parse(localStorage.getItem(EV_KEY) || "[]"); } catch { return []; }
}
function guardarEventosStorage(lista) { localStorage.setItem(EV_KEY, JSON.stringify(lista)); }

function obtenerInscriptos(id) { try { return JSON.parse(localStorage.getItem("ev_insc_" + id) || "[]"); } catch { return []; } }
function guardarInscriptos(id, lista) { localStorage.setItem("ev_insc_" + id, JSON.stringify(lista)); }
function obtenerEspera(id) { try { return JSON.parse(localStorage.getItem("ev_espera_" + id) || "[]"); } catch { return []; } }
function guardarEspera(id, lista) { localStorage.setItem("ev_espera_" + id, JSON.stringify(lista)); }

// ── Rol ───────────────────────────────────────────────────────
function getRol()  { return tipoSelect ? tipoSelect.value : "estudiante"; }
function esAdmin() { const r = getRol(); return r === "profesor" || r === "administrativo"; }
function getNombreUsuario() { return document.getElementById("nombreLogin")?.value.trim() || "Usuario"; }

function verificarRol() {
    const actions = document.getElementById("evHeaderActions");
    if (actions) actions.style.display = esAdmin() ? "flex" : "none";
}

// ── Estado automático ─────────────────────────────────────────
function calcularEstado(ev) {
    if (ev.estadoManual === "finalizado") return "finalizado";
    if (new Date(ev.fecha).getTime() < Date.now()) return "finalizado";
    if (ev.estadoManual === "cerrado") return "cerrado";
    if (obtenerInscriptos(ev.id).length >= ev.cupo) return "cerrado";
    return "abierto";
}

const ESTADO_LABEL = { abierto: "🟢 Abierto", cerrado: "🟡 Cerrado", finalizado: "🔴 Finalizado" };
const ESTADO_CLASS = { abierto: "ev-estado-abierto", cerrado: "ev-estado-cerrado", finalizado: "ev-estado-finalizado" };

// ── Toasts ────────────────────────────────────────────────────
function toast(msg, tipo = "success") {
    const c = document.getElementById("toastContainer");
    if (!c) return;
    const t = document.createElement("div");
    t.className = "toast toast-" + tipo;
    t.innerHTML = `<span class="toast-icon">${tipo === "success" ? "✅" : tipo === "error" ? "❌" : "ℹ️"}</span><span>${msg}</span>`;
    c.appendChild(t);
    requestAnimationFrame(() => t.classList.add("toast-show"));
    setTimeout(() => { t.classList.remove("toast-show"); setTimeout(() => t.remove(), 350); }, 3500);
}

// ── Tab activo ────────────────────────────────────────────────
let evTabActivo = "todos";

function cambiarTab(tab, btn) {
    evTabActivo = tab;
    document.querySelectorAll(".ev-tab").forEach(b => b.classList.remove("activo"));
    if (btn) btn.classList.add("activo");
    renderEventos();
}

// ── Render principal ──────────────────────────────────────────
function renderEventos() {
    const lista = document.getElementById("listaEventos");
    if (!lista) return;

    const termino  = (document.getElementById("evBuscador")?.value || "").toLowerCase().trim();
    const filtCarr = document.getElementById("evFiltroCarrera")?.value  || "";
    const filtEst  = document.getElementById("evFiltroEstado")?.value   || "";
    const filtMod  = document.getElementById("evFiltroModalidad")?.value || "";
    const usuario  = getNombreUsuario();
    const admin    = esAdmin();

    // Cargar y actualizar estados
    let eventos = cargarEventos().map(ev => ({ ...ev, estadoCalculado: calcularEstado(ev) }));

    // Filtro de tab
    if (evTabActivo === "mis") {
        eventos = eventos.filter(ev => obtenerInscriptos(ev.id).includes(usuario));
    }

    // Filtros
    if (termino)   eventos = eventos.filter(ev => ev.titulo.toLowerCase().includes(termino));
    if (filtCarr)  eventos = eventos.filter(ev => ev.carrera === filtCarr);
    if (filtEst)   eventos = eventos.filter(ev => ev.estadoCalculado === filtEst);
    if (filtMod)   eventos = eventos.filter(ev => ev.modalidad === filtMod);

    // Orden: destacados arriba → por fecha ascendente
    eventos.sort((a, b) => {
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        return new Date(a.fecha) - new Date(b.fecha);
    });

    const contador = document.getElementById("evContador");
    if (contador) contador.textContent = eventos.length ? `${eventos.length} evento${eventos.length !== 1 ? "s" : ""}` : "";

    if (!eventos.length) {
        lista.innerHTML = `<div class="ev-empty"><span>${evTabActivo === "mis" ? "📌" : "📭"}</span><p>${evTabActivo === "mis" ? "No estás anotado a ningún evento todavía." : "No hay eventos que coincidan con los filtros."}</p></div>`;
        return;
    }

    lista.innerHTML = eventos.map(ev => buildCard(ev, usuario, admin)).join("");
}

// ── Build card ────────────────────────────────────────────────
function buildCard(ev, usuario, admin) {
    const inscriptos    = obtenerInscriptos(ev.id);
    const espera        = obtenerEspera(ev.id);
    const estado        = ev.estadoCalculado;
    const estaInscripto = inscriptos.includes(usuario);
    const estaEnEspera  = espera.includes(usuario);
    const pct           = Math.min(Math.round((inscriptos.length / ev.cupo) * 100), 100);
    const cupoClass     = pct >= 100 ? "ev-cupo-lleno" : pct >= 75 ? "ev-cupo-alto" : "ev-cupo-ok";

    const fecha  = new Date(ev.fecha);
    const dia    = fecha.getDate();
    const mes    = fecha.toLocaleDateString("es-AR", { month: "short" }).replace(".", "").toUpperCase();
    const hora   = fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const diaStr = fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

    const limStr = ev.fechaLimite
        ? "⏰ Inscripción hasta: " + new Date(ev.fechaLimite).toLocaleDateString("es-AR") + " " + new Date(ev.fechaLimite).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
        : "";

    const modIcon  = { presencial: "📍", virtual: "💻", hibrido: "🔀" }[ev.modalidad] || "";
    const modLabel = { presencial: "Presencial", virtual: "Virtual", hibrido: "Híbrido" }[ev.modalidad] || ev.modalidad;
    const carrLabel= { general: "🌎 Para Todos", "Ciencia de Datos": "📊 Ciencia de Datos", Farmacia: "💊 Farmacia", "Trabajo Social": "🤝 Trabajo Social" }[ev.carrera] || ev.carrera;

    // Botón estudiante
    let btnEstudiante = "";
    if (!admin) {
        if (estado === "finalizado") {
            btnEstudiante = `<button class="btn-anotarse ev-btn-disabled" disabled>Finalizado</button>`;
        } else if (estaInscripto) {
            btnEstudiante = `<button class="btn-anotarse ev-btn-desinscribir" onclick="desanotarse('${ev.id}')">✕ Desanotarse</button>`;
        } else if (estado === "cerrado") {
            if (estaEnEspera) {
                btnEstudiante = `<button class="btn-anotarse ev-btn-espera" onclick="salirEspera('${ev.id}')">⏳ En espera — Salir</button>`;
            } else {
                btnEstudiante = `<button class="btn-anotarse ev-btn-espera" onclick="entrarEspera('${ev.id}')">⏳ Unirse a lista de espera</button>`;
            }
        } else {
            btnEstudiante = `<button class="btn-anotarse" onclick="anotarse('${ev.id}')">Anotarse</button>`;
        }
    }

    // Botones admin
    const btnAdmin = admin ? `
        <div class="ev-admin-row">
            <button class="ev-btn-admin" onclick="verInscriptos('${ev.id}')">
                👥 ${inscriptos.length} inscripto${inscriptos.length !== 1 ? "s" : ""}${espera.length > 0 ? " · ⏳ " + espera.length + " en espera" : ""}
            </button>
            ${estado !== "finalizado" ? `<button class="ev-btn-admin ev-btn-cerrar-insc" onclick="toggleCerrarInscripcion('${ev.id}')">
                ${ev.estadoManual === "cerrado" ? "🔓 Reabrir" : "🔒 Cerrar insc."}
            </button>` : ""}
            <button class="ev-btn-admin ev-btn-edit" onclick="editarEvento('${ev.id}')">✏️ Editar</button>
            <button class="ev-btn-admin ev-btn-del" onclick="eliminarEvento('${ev.id}')">🗑</button>
        </div>` : "";

    const banner = ev.imagen
        ? `<div class="ev-card-banner"><img src="${ev.imagen}" alt="Banner" onerror="this.parentElement.style.display='none'"></div>`
        : "";

    return `
<div class="ev-card${ev.destacado ? " ev-card-destacado" : ""}" id="card-${ev.id}">
    ${banner}
    <div class="ev-card-body">
        <div class="ev-card-top">
            <div class="ev-fecha-badge${estado === "finalizado" ? " ev-fb-gris" : " ev-fb-azul"}">
                <span class="ev-fb-dia">${dia}</span>
                <span class="ev-fb-mes">${mes}</span>
            </div>
            <div class="ev-card-main">
                <div class="ev-card-badges">
                    ${ev.destacado ? `<span class="ev-badge ev-badge-pin">📌 Destacado</span>` : ""}
                    <span class="ev-badge ${ESTADO_CLASS[estado]}">${ESTADO_LABEL[estado]}</span>
                    <span class="ev-badge ${ev.tipo === "obligatorio" ? "ev-badge-oblig" : "ev-badge-opc"}">${ev.tipo === "obligatorio" ? "🔴 Obligatorio" : "🟢 Opcional"}</span>
                    <span class="ev-badge ev-badge-carr">${carrLabel}</span>
                    <span class="ev-badge ev-badge-mod">${modIcon} ${modLabel}</span>
                </div>
                <h3 class="ev-card-titulo">${ev.titulo}</h3>
                ${ev.descripcion ? `<p class="ev-card-desc">${ev.descripcion}</p>` : ""}
                <div class="ev-card-meta-row">
                    <span>🕐 ${hora} hs · ${diaStr}</span>
                    <span>${modIcon} ${ev.lugar}</span>
                    ${limStr ? `<span>${limStr}</span>` : ""}
                    ${ev.creadoPor ? `<span>👤 ${ev.creadoPor}</span>` : ""}
                </div>
            </div>
        </div>
        <div class="ev-card-footer">
            <div class="ev-cupo-bloque">
                <div class="ev-cupo-top">
                    <span class="ev-cupo-label">Cupo</span>
                    <strong class="ev-cupo-num">${inscriptos.length}/${ev.cupo}</strong>
                </div>
                <div class="ev-cupo-track">
                    <div class="ev-cupo-fill ${cupoClass}" style="width:${pct}%"></div>
                </div>
                ${espera.length > 0 ? `<span class="ev-espera-chip">⏳ ${espera.length} en lista de espera</span>` : ""}
            </div>
            <div class="ev-card-acciones">
                ${btnEstudiante}
                ${btnAdmin}
            </div>
        </div>
    </div>
</div>`;
}

// ── Anotarse / Desanotarse / Espera ───────────────────────────
function anotarse(idEvento) {
    const ev      = cargarEventos().find(e => e.id === idEvento);
    if (!ev) return;
    const usuario    = getNombreUsuario();
    const inscriptos = obtenerInscriptos(idEvento);
    if (inscriptos.includes(usuario)) return toast("Ya estás anotado a este evento.", "info");
    if (calcularEstado(ev) === "finalizado") return toast("Este evento ya finalizó.", "error");
    if (calcularEstado(ev) === "cerrado")    return toast("Las inscripciones están cerradas.", "error");
    if (ev.fechaLimite && new Date(ev.fechaLimite) < new Date()) return toast("La fecha límite de inscripción ya pasó.", "error");
    inscriptos.push(usuario);
    guardarInscriptos(idEvento, inscriptos);
    toast(`✅ Te anotaste a "${ev.titulo}"`, "success");
    renderEventos(); marcarCalendario();
}

function desanotarse(idEvento) {
    const ev         = cargarEventos().find(e => e.id === idEvento);
    const usuario    = getNombreUsuario();
    let inscriptos   = obtenerInscriptos(idEvento).filter(u => u !== usuario);
    guardarInscriptos(idEvento, inscriptos);
    // Promover de lista de espera si hay cupo
    const espera = obtenerEspera(idEvento);
    if (ev && inscriptos.length < ev.cupo && espera.length > 0) {
        const promovido = espera.shift();
        inscriptos.push(promovido);
        guardarInscriptos(idEvento, inscriptos);
        guardarEspera(idEvento, espera);
        toast(`ℹ️ ${promovido} fue promovido desde lista de espera.`, "info");
    }
    toast("Te desanotaste del evento.", "info");
    renderEventos(); marcarCalendario();
}

function entrarEspera(idEvento) {
    const ev     = cargarEventos().find(e => e.id === idEvento);
    const usuario= getNombreUsuario();
    const espera = obtenerEspera(idEvento);
    if (espera.includes(usuario)) return toast("Ya estás en lista de espera.", "info");
    espera.push(usuario);
    guardarEspera(idEvento, espera);
    toast(`⏳ Te agregamos a la lista de espera de "${ev?.titulo}".`, "info");
    renderEventos();
}

function salirEspera(idEvento) {
    const espera = obtenerEspera(idEvento).filter(u => u !== getNombreUsuario());
    guardarEspera(idEvento, espera);
    toast("Saliste de la lista de espera.", "info");
    renderEventos();
}

// ── Admin: cerrar/reabrir inscripción ─────────────────────────
function toggleCerrarInscripcion(idEvento) {
    const eventos = cargarEventos();
    const idx = eventos.findIndex(e => e.id === idEvento);
    if (idx === -1) return;
    const cerrado = eventos[idx].estadoManual === "cerrado";
    eventos[idx].estadoManual = cerrado ? "" : "cerrado";
    guardarEventosStorage(eventos);
    toast(cerrado ? "🔓 Inscripciones reabiertas." : "🔒 Inscripciones cerradas.", "info");
    renderEventos();
}

// ── Admin: ver inscriptos ─────────────────────────────────────
let _modalEvId = null;

function verInscriptos(idEvento) {
    const ev         = cargarEventos().find(e => e.id === idEvento);
    const inscriptos = obtenerInscriptos(idEvento);
    const espera     = obtenerEspera(idEvento);
    _modalEvId       = idEvento;

    document.getElementById("modalInscriptosTitle").textContent = `Inscriptos — ${ev?.titulo || "Evento"}`;

    const mkLista = (arr, titulo, cls) => arr.length ? `
        <p class="ev-modal-group ${cls}">${titulo} (${arr.length})</p>
        <ol class="ev-modal-lista">${arr.map((u, i) => `<li><span class="ev-modal-num">${i + 1}</span>${u}</li>`).join("")}</ol>` : "";

    const body = document.getElementById("modalInscriptosBody");
    body.innerHTML = (inscriptos.length === 0 && espera.length === 0)
        ? `<p class="ev-modal-empty">Sin inscriptos aún.</p>`
        : mkLista(inscriptos, "✅ Inscriptos", "") + mkLista(espera, "⏳ Lista de espera", "ev-modal-group-espera");

    document.getElementById("modalInscriptos").style.display = "flex";
}

function cerrarModalInscriptos(e) {
    if (e && e.target !== document.getElementById("modalInscriptos")) return;
    document.getElementById("modalInscriptos").style.display = "none";
}

function exportarInscriptos() {
    if (!_modalEvId) return;
    const ev         = cargarEventos().find(e => e.id === _modalEvId);
    const inscriptos = obtenerInscriptos(_modalEvId);
    const espera     = obtenerEspera(_modalEvId);
    let csv = `Evento:,${ev?.titulo || _modalEvId}\nFecha:,${ev ? new Date(ev.fecha).toLocaleString("es-AR") : ""}\n\nN,Nombre,Estado\n`;
    inscriptos.forEach((u, i) => csv += `${i + 1},${u},Inscripto\n`);
    espera.forEach((u, i) => csv += `${inscriptos.length + i + 1},${u},Lista de espera\n`);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: `inscriptos_${(ev?.titulo || _modalEvId).replace(/\s+/g, "_")}.csv` });
    a.click(); URL.revokeObjectURL(url);
    toast("⬇ Lista exportada correctamente.", "success");
}

// ── Admin: crear / editar ─────────────────────────────────────
function abrirFormEvento(id = null) {
    const elTit = document.getElementById("formEventoTitulo");
    const elSub = document.getElementById("formEventoSubtitulo");
    const elId  = document.getElementById("fEditandoId");

    const campos = ["fTitulo","fDescripcion","fFecha","fFechaLimite","fLugar","fImagen","fCupo"];

    if (id) {
        const ev = cargarEventos().find(e => e.id === id);
        if (!ev) return;
        elTit.textContent = "✏️ Editar evento";
        elSub.textContent = "Modificá los datos del evento.";
        elId.value = id;
        document.getElementById("fTitulo").value       = ev.titulo;
        document.getElementById("fDescripcion").value  = ev.descripcion || "";
        document.getElementById("fFecha").value        = (ev.fecha || "").slice(0, 16);
        document.getElementById("fFechaLimite").value  = (ev.fechaLimite || "").slice(0, 16);
        document.getElementById("fModalidad").value    = ev.modalidad;
        document.getElementById("fLugar").value        = ev.lugar;
        document.getElementById("fCarrera").value      = ev.carrera;
        document.getElementById("fTipo").value         = ev.tipo;
        document.getElementById("fCupo").value         = ev.cupo;
        document.getElementById("fDestacado").checked  = !!ev.destacado;
        document.getElementById("fImagen").value       = ev.imagen || "";
    } else {
        elTit.textContent = "➕ Nuevo evento";
        elSub.textContent = "Completá todos los campos para publicar el evento.";
        elId.value = "";
        campos.forEach(fid => { const el = document.getElementById(fid); if (el) el.value = ""; });
        document.getElementById("fModalidad").value   = "presencial";
        document.getElementById("fCarrera").value     = "general";
        document.getElementById("fTipo").value        = "opcional";
        document.getElementById("fDestacado").checked = false;
    }
    mostrar("formEvento");
}

function editarEvento(id) { abrirFormEvento(id); }

function guardarEvento() {
    const titulo      = document.getElementById("fTitulo").value.trim();
    const descripcion = document.getElementById("fDescripcion").value.trim();
    const fecha       = document.getElementById("fFecha").value;
    const fechaLimite = document.getElementById("fFechaLimite").value;
    const modalidad   = document.getElementById("fModalidad").value;
    const lugar       = document.getElementById("fLugar").value.trim();
    const carrera     = document.getElementById("fCarrera").value;
    const tipo        = document.getElementById("fTipo").value;
    const cupo        = parseInt(document.getElementById("fCupo").value);
    const destacado   = document.getElementById("fDestacado").checked;
    const imagen      = document.getElementById("fImagen").value.trim();
    const editId      = document.getElementById("fEditandoId").value;

    if (!titulo)                                             return toast("El título es obligatorio.", "error");
    if (!fecha)                                              return toast("La fecha del evento es obligatoria.", "error");
    if (!editId && new Date(fecha) < new Date())             return toast("La fecha del evento no puede ser en el pasado.", "error");
    if (!fechaLimite)                                        return toast("La fecha límite de inscripción es obligatoria.", "error");
    if (new Date(fechaLimite) >= new Date(fecha))            return toast("La fecha límite debe ser anterior a la fecha del evento.", "error");
    if (!lugar)                                              return toast("El lugar o link es obligatorio.", "error");
    if (isNaN(cupo) || cupo < 1)                             return toast("El cupo debe ser al menos 1.", "error");
    if (cupo > 500)                                          return toast("El cupo no puede superar 500.", "error");

    const eventos = cargarEventos();

    if (editId) {
        const idx = eventos.findIndex(e => e.id === editId);
        if (idx === -1) return toast("Evento no encontrado.", "error");
        Object.assign(eventos[idx], { titulo, descripcion, fecha, fechaLimite, modalidad, lugar, carrera, tipo, cupo, destacado, imagen });
        guardarEventosStorage(eventos);
        toast(`✅ "${titulo}" actualizado.`, "success");
    } else {
        eventos.push({
            id: "ev_" + Date.now(), titulo, descripcion, fecha, fechaLimite,
            modalidad, lugar, carrera, tipo, cupo, destacado, imagen,
            estadoManual: "", estadoCalculado: "abierto", creadoPor: getNombreUsuario()
        });
        guardarEventosStorage(eventos);
        toast(`✅ "${titulo}" publicado.`, "success");
    }

    mostrar("eventos");
    renderEventos();
    marcarCalendario();
}

function eliminarEvento(idEvento) {
    const ev = cargarEventos().find(e => e.id === idEvento);
    if (!confirm(`¿Eliminar "${ev?.titulo}"? Esta acción no se puede deshacer.`)) return;
    guardarEventosStorage(cargarEventos().filter(e => e.id !== idEvento));
    localStorage.removeItem("ev_insc_" + idEvento);
    localStorage.removeItem("ev_espera_" + idEvento);
    toast("🗑 Evento eliminado.", "info");
    renderEventos(); marcarCalendario();
}

// ── Integración calendario ────────────────────────────────────
function marcarCalendario() {
    const dias = [...new Set(cargarEventos().map(ev => {
        const d = new Date(ev.fecha);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }))];
    localStorage.setItem("ce_dias_con_eventos", JSON.stringify(dias));
    if (typeof actualizarWidgetCalendario === "function") actualizarWidgetCalendario(dias);
}

// ── Seed demo ─────────────────────────────────────────────────
function seedEventoDemo() {
    if (cargarEventos().length > 0) return;
    const hoy    = new Date();
    const fecha  = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 7, 18, 0);
    const limite = new Date(fecha.getTime() - 2 * 86400000);
    const fecha2 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 14, 10, 0);
    const limite2= new Date(fecha2.getTime() - 86400000);
    guardarEventosStorage([
        {
            id: "ev_demo1", titulo: "Fiesta de fin de cuatrimestre",
            descripcion: "La fiesta anual del Instituto. Música en vivo, food trucks, sorteos y stands de cada carrera.",
            fecha: fecha.toISOString().slice(0, 16), fechaLimite: limite.toISOString().slice(0, 16),
            modalidad: "presencial", lugar: "Patio central — Planta baja",
            carrera: "general", tipo: "opcional", cupo: 150,
            destacado: true, imagen: "", estadoManual: "", estadoCalculado: "abierto", creadoPor: "Administración"
        },
        {
            id: "ev_demo2", titulo: "Charla: Introducción a Machine Learning",
            descripcion: "Charla introductoria sobre ML dictada por docentes de la carrera.",
            fecha: fecha2.toISOString().slice(0, 16), fechaLimite: limite2.toISOString().slice(0, 16),
            modalidad: "virtual", lugar: "meet.google.com/demo-link",
            carrera: "Ciencia de Datos", tipo: "obligatorio", cupo: 40,
            destacado: false, imagen: "", estadoManual: "", estadoCalculado: "abierto", creadoPor: "Prof. García"
        }
    ]);
}