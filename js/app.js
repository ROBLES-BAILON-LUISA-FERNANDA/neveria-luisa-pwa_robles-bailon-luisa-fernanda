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