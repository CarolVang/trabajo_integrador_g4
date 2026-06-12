// js/api.js
const API_BASE_URL = 'https://centro-de-estudiantes-api.vercel.app';
const API_USER = 'grupo4';
const API_PASS = 'PassGrupo4';

const api = {
    async getUsuarios( ) {
        try {
            const authHeader = 'Basic ' + btoa(`${API_USER}:${API_PASS}`);
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                headers: { 
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Error al conectar:", error);
            return null;
        }
    }
};
