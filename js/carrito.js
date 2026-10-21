    // Carrito: agregar, sumar/restar, quitar y total. Se guarda en localStorage.
    const $ = (id) => document.getElementById(id);
    let carrito = [];
    try { carrito = JSON.parse(localStorage.getItem("carrito")) || []; } catch (e) { carrito = []; }

    function guardar() {
    try { localStorage.setItem("carrito", JSON.stringify(carrito)); } catch (e) { console.error(e); }
    pintarCarrito();
    }

    function agregarAlCarrito(p) {
    const item = carrito.find((i) => i.id === p.id);
    if (item) { if (item.cantidad < item.stock) item.cantidad++; }
    else carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, imagen: p.imagen, stock: p.stock, cantidad: 1 });
    guardar();
    const b = $("carrito-contador");
    b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    if (typeof notificarAgregado === "function") notificarAgregado(p.nombre);   // <-- línea nueva
    }

    function cambiarCantidad(id, delta) {
    const item = carrito.find((i) => i.id === id);
    if (!item) return;
    item.cantidad = Math.min(item.cantidad + delta, item.stock);
    if (item.cantidad <= 0) carrito = carrito.filter((i) => i.id !== id);
    guardar();
    }

    function quitarDelCarrito(id) {
    carrito = carrito.filter((i) => i.id !== id);
    guardar();
    }

    function pintarCarrito() {
    const lista = $("carrito-lista");
    lista.innerHTML = carrito.length ? "" : '<li class="vacio">Tu carrito está vacío 🍦</li>';
    carrito.forEach((i) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <img src="${i.imagen}" alt="${i.nombre}">
        <div class="it"><b>${i.nombre}</b><span>$${i.precio} c/u</span></div>
        <div class="cant">
            <button type="button" data-a="menos" aria-label="Quitar uno">−</button>
            <span>${i.cantidad}</span>
            <button type="button" data-a="mas" aria-label="Agregar uno">+</button>
            <button type="button" data-a="quitar" class="x" aria-label="Eliminar">✕</button>
        </div>`;
        li.addEventListener("click", (e) => {
        const a = e.target.dataset.a;
        if (a === "mas") cambiarCantidad(i.id, 1);
        if (a === "menos") cambiarCantidad(i.id, -1);
        if (a === "quitar") quitarDelCarrito(i.id);
        });
        lista.appendChild(li);
    });
    $("carrito-total").textContent = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
    $("carrito-contador").textContent = carrito.reduce((s, i) => s + i.cantidad, 0);
    }

    function abrirCarrito(abrir) {
    $("carrito").classList.toggle("on", abrir);
    $("overlay").classList.toggle("on", abrir);
    $("carrito").setAttribute("aria-hidden", !abrir);
    }

    $("btn-carrito").addEventListener("click", () => abrirCarrito(true));
    $("cerrar-carrito").addEventListener("click", () => abrirCarrito(false));
    $("overlay").addEventListener("click", () => abrirCarrito(false));
    $("btn-vaciar").addEventListener("click", () => { carrito = []; guardar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") abrirCarrito(false); });
    pintarCarrito();

    // ===== Sincronización (avance 3) =====
    function sincronizarCarrito() {
    const mensaje = $("carrito-mensaje");
    if (!navigator.onLine) {
        mensaje.textContent = "Sin conexión: el carrito se sincronizará cuando vuelva el internet.";
        return;
    }
    // En una app real aquí iría un fetch() con method "POST" al servidor
    mensaje.textContent = carrito.length
        ? "Carrito sincronizado con el servidor (simulado). ✓"
        : "No hay nada que sincronizar.";
    }

    $("btn-sincronizar").addEventListener("click", sincronizarCarrito);
    window.addEventListener("online", sincronizarCarrito);
    window.addEventListener("offline", () => {
    $("carrito-mensaje").textContent = "Se perdió la conexión.";
    });