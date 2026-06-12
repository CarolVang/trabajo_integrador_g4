// js/api.js
alert("¡Archivo API cargado!");

const API_BASE_URL = 'https://centro-de-estudiantes-api.vercel.app';
const API_USER = 'grupo4';
const API_PASS = 'PassGrupo4';

const api = {
    async getReglamentacion( ) {
        try {
            const authHeader = 'Basic ' + btoa(API_USER + ':' + API_PASS);
            const response = await fetch(`${API_BASE_URL}/reglamentacion`, {
                headers: { 
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }
};
