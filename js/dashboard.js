async function inicializarDashboard() {
    try {
        const response = await fetch('data/Victimas_dashboard.json');
        const datos = await response.json();

        // 1. Actualizar números rápidos
        document.getElementById('total-victimas').innerText = datos.length;

        // 2. Gráfico de Años (Estilo Dark)
        new Chart(document.getElementById('chartAnios'), {
            type: 'line', // Cambiamos a línea para que sea más elegante
            data: {
                labels: ['1975', '1976', '1977', '1978'],
                datasets: [{
                    label: 'Víctimas por Año',
                    data: [756, 3688, 2726, 717],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { plugins: { legend: { labels: { color: '#fff' } } } }
        });

        // 3. Inicializar Mapa
        const map = L.map('mapa-victimas').setView([-38.416, -63.616], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' ).addTo(map);

        // Ejemplo de puntos críticos (Podés agregar más según tu JSON)
        const puntos = [
            { nombre: "Buenos Aires", coords: [-34.6037, -58.3816], color: "red", cant: "4000+" },
            { nombre: "Córdoba", coords: [-31.4135, -64.1810], color: "orange", cant: "1000+" },
            { nombre: "Tucumán", coords: [-26.8083, -65.2176], color: "yellow", cant: "500+" }
        ];

        puntos.forEach(p => {
            L.circle(p.coords, { color: p.color, radius: 50000 }).addTo(map)
                .bindPopup(`<b>${p.nombre}</b>  
Víctimas: ${p.cant}`);
        });

    } catch (e) { console.error(e); }
}
