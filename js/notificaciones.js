    // notificaciones.js — Notification API del navegador
    document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-notificar");
    const mensaje = document.getElementById("notificaciones-mensaje");

    boton.addEventListener("click", () => {
        if (!("Notification" in window)) {
        mensaje.textContent = "Este navegador no soporta notificaciones.";
        return;
        }
        // Abre el diálogo del navegador para permitir o bloquear
        Notification.requestPermission().then((permiso) => {
        if (permiso === "granted") {
            try {
            new Notification("Nevería Luisa", {
                body: "¡Listo! Te avisaremos cuando haya nuevas ofertas.",
                icon: "icons/logo.png",
            });
            } catch (e) { console.error(e); }
            mensaje.textContent = "Notificaciones activadas.";
        } else {
            mensaje.textContent = "No diste permiso para notificaciones.";
        }
        });
    });
    });

    // Notificación útil: se llama desde carrito.js cuando agregas un producto
    function notificarAgregado(nombre) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try {
        new Notification("Pedido agregado", { body: nombre + " se agregó a tu carrito.", icon: "icons/logo.png" });
    } catch (e) { console.error(e); }
    }