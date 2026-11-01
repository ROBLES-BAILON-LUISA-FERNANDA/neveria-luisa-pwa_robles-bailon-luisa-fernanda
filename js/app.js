    // app.js — muestra si hay o no conexión (el Service Worker se registrará en index.html)
    function actualizarPildoraConexion() {
    const pildora = document.getElementById("estado-conexion");
    if (navigator.onLine) {
        pildora.textContent = "conectado";
        pildora.classList.remove("sin-conexion");
    } else {
        pildora.textContent = "sin conexión";
        pildora.classList.add("sin-conexion");
    }
    }

    document.addEventListener("DOMContentLoaded", actualizarPildoraConexion);
    window.addEventListener("online", actualizarPildoraConexion);
    window.addEventListener("offline", actualizarPildoraConexion);

    // Fondo decorativo: helados que caen suavemente
    (function () {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const helados = ["🍦", "🍧", "🍨", "🍦"];
    const capa = document.createElement("div");
    capa.className = "lluvia";
    capa.setAttribute("aria-hidden", "true");
    const total = window.innerWidth < 700 ? 8 : 8;
    for (let i = 0; i < total; i++) {
        const h = document.createElement("span");
        h.textContent = helados[i % helados.length];
        h.style.left = Math.random() * 100 + "%";
        h.style.fontSize = 18 + Math.random() * 22 + "px";
        h.style.animationDuration = 9 + Math.random() * 9 + "s";
        h.style.animationDelay = -Math.random() * 15 + "s";
        capa.appendChild(h);
    }
    document.body.prepend(capa);
    })();

    