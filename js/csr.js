// CSR: el navegador carga catalogo.json y pinta las tarjetas
async function cargarCatalogo() {
  const cont = document.getElementById('catalogo');
  try {
    const res = await fetch('catalogo.json');
    const productos = await res.json();
    const categorias = [...new Set(productos.map(p => p.categoria))];
    cont.innerHTML = categorias.map(cat => `
      <div class="categoria">
        <h2>${cat}</h2>
        <div class="grid">
          ${productos.filter(p => p.categoria === cat).map(p => `
            <article class="tarjeta">
              <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
              <div class="info">
                <h3>${p.nombre}</h3>
                <span class="precio">$${p.precio}</span>
                <button class="agregar" data-id="${p.id}">Agregar</button>
              </div>
            </article>`).join('')}
        </div>
      </div>`).join('');
  } catch (e) {
    cont.innerHTML = '<p>No se pudo cargar el catálogo.</p>';
    console.error(e);
  }
}
cargarCatalogo();
