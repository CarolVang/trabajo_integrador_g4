// js/api.js - EL MOTOR DE CONEXIÓN PARA TODO EL EQUIPO
const API_BASE_URL = 'https://centro-de-estudiantes-api.vercel.app';
const API_USER = 'grupo4';
const API_PASS = 'PassGrupo4';

const api = {
    // Función interna para realizar las peticiones (no la toquen )
    async _fetch(path) {
        try {
            const authHeader = 'Basic ' + btoa(`${API_USER}:${API_PASS}`);
            const response = await fetch(`${API_BASE_URL}${path}`, {
                headers: { 
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Error en la conexión:", error);
            return null;
        }
    },

    // --- FUNCIONES PARA EL EQUIPO ---

    // Para el compañero de LOGIN
    getUsuarios() { 
        return this._fetch('/usuarios'); 
    },

    // Para vos en REGLAMENTOS
    getReglamentacion() { 
        return this._fetch('/reglamentacion'); 
    },

    // Para el compañero de EVENTOS
    getEventos() { 
        return this._fetch('/eventos'); 
    },

    // Para el compañero de NOVEDADES (Noticias)
    getNovedades() { 
        return this._fetch('/novedades'); 
    }
};