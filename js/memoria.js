// js/dashboard.js
// Dashboard "Espacio para la Memoria" — usa data/victimas_lista.json

async function inicializarDashboard() {
    try {
        const response = await fetch('data/victimas_lista.json');
        if (!response.ok) throw new Error('No se pudo cargar el JSON de víctimas');
        const datos = await response.json();

        const validos = datos.filter(d => d.nombre_corto && d.anio_monumento);
        const total = validos.length;

        // ── FECHA DE ACTUALIZACIÓN ──
        const fechaEl = document.getElementById('memoria-fecha');
        if (fechaEl) {
            fechaEl.textContent = new Date().toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
        }

        // ── INDICADORES RÁPIDOS ──
        document.getElementById('total-victimas').innerText = total.toLocaleString('es-AR');

        const desaparecidos = validos.filter(d => d.estado === 'Detenido/a desaparecido/a').length;
        document.getElementById('total-desaparecidos').innerText = desaparecidos.toLocaleString('es-AR');
        document.getElementById('pct-desaparecidos').innerText =
            `${((desaparecidos / total) * 100).toFixed(1)}% del total`;

        const asesinados = validos.filter(d => d.estado === 'Asesinado/a').length;
        document.getElementById('total-asesinados').innerText = asesinados.toLocaleString('es-AR');
        document.getElementById('pct-asesinados').innerText =
            `${((asesinados / total) * 100).toFixed(1)}% del total`;

        const embarazadas = validos.filter(d => d.embarazada === 'Si').length;
        document.getElementById('total-embarazadas').innerText = embarazadas;

        // ── GRÁFICO POR AÑO ──
        const aniosValidos = ['1969','1970','1971','1972','1973','1974','1975','1976','1977','1978','1979','1980','1981','1982','1983'];
        const conteoAnios = aniosValidos.map(anio =>
            validos.filter(d => d.anio_monumento === anio).length
        );

        new Chart(document.getElementById('chartAnios'), {
            type: 'line',
            data: {
                labels: aniosValidos,
                datasets: [{
                    label: 'Víctimas',
                    data: conteoAnios,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.15)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: { label: (ctx) => `${ctx.parsed.y.toLocaleString('es-AR')} víctimas` }
                    }
                },
                scales: {
                    x: { ticks: { color: '#64748b' }, grid: { color: '#1f2937' } },
                    y: { ticks: { color: '#64748b' }, grid: { color: '#1f2937' }, beginAtZero: true }
                }
            }
        });

        // ── GRÁFICO POR TIPO ──
        new Chart(document.getElementById('chartEstado'), {
            type: 'doughnut',
            data: {
                labels: ['Detenido/a desaparecido/a', 'Asesinado/a'],
                datasets: [{
                    data: [desaparecidos, asesinados],
                    backgroundColor: ['#3b82f6', '#ef4444'],
                    borderColor: '#111827',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 11 } } }
                }
            }
        });

        // ── MAPA (aproximado por capital — el dataset no trae provincia) ──
        const map = L.map('mapa-victimas').setView([-38.416, -63.616], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap, © CARTO'
        }).addTo(map);

        const puntos = [
            { nombre: "Buenos Aires", coords: [-34.6037, -58.3816], radio: 70000, color: "#ef4444" },
            { nombre: "Córdoba",      coords: [-31.4135, -64.1810], radio: 55000, color: "#f97316" },
            { nombre: "Rosario",      coords: [-32.9468, -60.6393], radio: 45000, color: "#f59e0b" },
            { nombre: "Tucumán",      coords: [-26.8083, -65.2176], radio: 40000, color: "#eab308" },
            { nombre: "Mendoza",      coords: [-32.8908, -68.8272], radio: 35000, color: "#84cc16" },
            { nombre: "La Plata",     coords: [-34.9215, -57.9545], radio: 35000, color: "#f97316" }
        ];

        puntos.forEach(p => {
            L.circle(p.coords, { color: p.color, fillColor: p.color, fillOpacity: 0.45, radius: p.radio, weight: 1 })
                .addTo(map)
                .bindPopup(`<b>${p.nombre}</b><br><span style="font-size:11px;color:#666;">Zona de referencia (capital)</span>`);
        });

    } catch (e) {
        console.error('Error al inicializar el dashboard de Memoria:', e);
        const total = document.getElementById('total-victimas');
        if (total) total.innerText = '—';
    }
}