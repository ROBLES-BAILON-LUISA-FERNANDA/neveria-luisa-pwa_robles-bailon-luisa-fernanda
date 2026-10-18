// CSR: el navegador descarga catalogo.json y construye las tarjetas
const catalogo = document.getElementById("catalogo");
const revelar = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("ver"); revelar.unobserve(e.target); }
  });
}, { threshold: 0.1 });

fetch("catalogo.json")
  .then((r) => r.json())
  .then((productos) => {
    catalogo.innerHTML = "";
    catalogo.removeAttribute("aria-busy");
    productos.forEach((p, i) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "card";
      tarjeta.dataset.categoria = p.categoria;
      tarjeta.style.setProperty("--i", i % 5);
      tarjeta.innerHTML = `
        <div class="foto"><img src="${p.imagen}" alt="${p.nombre}" loading="lazy"></div>
        <div class="info">
          <small>${p.categoria}</small>
          <h3>${p.nombre}</h3>
          <div class="fila">
            <span class="precio">$${p.precio}</span>
            <button class="agregar" type="button" aria-label="Agregar ${p.nombre} al carrito">+</button>
          </div>
        </div>`;
      tarjeta.querySelector("button").addEventListener("click", () => agregarAlCarrito(p));
      catalogo.appendChild(tarjeta);
      revelar.observe(tarjeta);
    });
    crearFiltros(productos);
  })
  .catch((error) => {
    catalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
    console.error("Error al cargar catálogo:", error);
  });

// Botones de categoría: ocultan las tarjetas que no coinciden
function crearFiltros(productos) {
  const barra = document.getElementById("filtros");
  const categorias = [...new Set(productos.map((p) => p.categoria))];
  ["Todos", ...categorias].forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = cat;
    b.setAttribute("aria-pressed", cat === "Todos");
    b.addEventListener("click", () => {
      barra.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      catalogo.querySelectorAll(".card").forEach((t) => {
        t.hidden = cat !== "Todos" && t.dataset.categoria !== cat;
      });
    });
    barra.appendChild(b);
  });
}