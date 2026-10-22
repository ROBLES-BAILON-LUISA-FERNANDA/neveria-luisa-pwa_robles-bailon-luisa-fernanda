    // geolocalizacion.js — ubicación del cliente y ruta hasta Nevería Luisa
    // La ubicación solo funciona en https:// o en localhost, y el navegador pide permiso.

    // ⚠️ CAMBIA estas coordenadas por las de tu local (ver "Cómo sacar tus coordenadas")
    const SUCURSAL = {
    nombre: "Nevería Luisa",
    lat: 29.0729,
    lon: -110.9559,
    };

    // Distancia en línea recta (km): respaldo si no se puede calcular la ruta por calles
    function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const rad = (g) => (g * Math.PI) / 180;
    const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Pide la ruta real por calles al servicio público OSRM (gratuito, sin API key)
    async function obtenerRuta(origenLat, origenLon) {
    const url = "https://router.project-osrm.org/route/v1/driving/" +
        `${origenLon},${origenLat};${SUCURSAL.lon},${SUCURSAL.lat}?overview=full&geometries=geojson`;
    try {
        const datos = await (await fetch(url)).json();
        if (datos.code !== "Ok") return null;
        const ruta = datos.routes[0];
        return {
        coords: ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]), // Leaflet usa [lat, lon]
        distanciaKm: ruta.distance / 1000,
        duracionMin: ruta.duration / 60,
        };
    } catch (error) {
        console.error("No se pudo calcular la ruta:", error);
        return null;
    }
    }

    let mapa;

    function dibujarMapa(origenLat, origenLon, coordsRuta) {
    const contenedor = document.getElementById("mapa-ruta");
    contenedor.hidden = false;

    if (!mapa) {
        mapa = L.map(contenedor);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; colaboradores de OpenStreetMap",
        maxZoom: 19,
        }).addTo(mapa);
    } else {
        mapa.eachLayer((capa) => {
        if (capa instanceof L.Marker || capa instanceof L.Polyline) mapa.removeLayer(capa);
        });
    }

    const puntoUsuario = [origenLat, origenLon];
    const puntoSucursal = [SUCURSAL.lat, SUCURSAL.lon];
    L.marker(puntoUsuario).addTo(mapa).bindPopup("Tú estás aquí").openPopup();
    L.marker(puntoSucursal).addTo(mapa).bindPopup(SUCURSAL.nombre);

    const hayRuta = Array.isArray(coordsRuta) && coordsRuta.length > 0;
    const estilo = hayRuta ? { color: "#1800AD", weight: 5 } : { color: "#F472B6", weight: 3, dashArray: "6 6" };
    L.polyline(hayRuta ? coordsRuta : [puntoUsuario, puntoSucursal], estilo).addTo(mapa);
    mapa.fitBounds(L.latLngBounds([puntoUsuario, puntoSucursal]), { padding: [30, 30] });
    setTimeout(() => mapa.invalidateSize(), 0); // evita que el mapa salga mal dimensionado
    }

    document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-ubicacion");
    const mensaje = document.getElementById("ubicacion-mensaje");

    boton.addEventListener("click", () => {
        if (!("geolocation" in navigator)) {
        mensaje.textContent = "Este dispositivo no reporta ubicación.";
        return;
        }
        mensaje.textContent = "Buscando tu ubicación…";

        navigator.geolocation.getCurrentPosition(
        async (posicion) => {
            const { latitude, longitude } = posicion.coords;
            const mapaUrl = `https://www.openstreetmap.org/directions?from=${latitude}%2C${longitude}&to=${SUCURSAL.lat}%2C${SUCURSAL.lon}`;

            mensaje.textContent = "Calculando la ruta hasta la nevería…";
            const ruta = await obtenerRuta(latitude, longitude);
            dibujarMapa(latitude, longitude, ruta ? ruta.coords : null);

            if (ruta) {
            mensaje.innerHTML = `Estás a <strong>${ruta.distanciaKm.toFixed(1)} km</strong> de ${SUCURSAL.nombre} · ` +
                `~${Math.round(ruta.duracionMin)} min en auto. <a href="${mapaUrl}" target="_blank" rel="noopener">Abrir en el mapa</a>`;
            } else {
            const km = calcularDistanciaKm(latitude, longitude, SUCURSAL.lat, SUCURSAL.lon);
            mensaje.innerHTML = `No se pudo calcular la ruta por calles; en línea recta estás a <strong>${km.toFixed(1)} km</strong> ` +
                `de ${SUCURSAL.nombre}. <a href="${mapaUrl}" target="_blank" rel="noopener">Abrir en el mapa</a>`;
            }
        },
        (error) => {
            mensaje.textContent = "No se pudo obtener tu ubicación: " + error.message;
        }
        );
    });
    });