from django.shortcuts import render

# Los mismos 15 productos de catalogo.json, escritos aquí para la vista SSR
PRODUCTOS = [
    {"nombre": "Limón", "precio": 35, "stock": 20},
    {"nombre": "Mango", "precio": 35, "stock": 20},
    {"nombre": "Guanábana", "precio": 40, "stock": 20},
    {"nombre": "Queso con zarzamora", "precio": 40, "stock": 20},
    {"nombre": "Coco", "precio": 35, "stock": 20},
    {"nombre": "Fresa con crema", "precio": 30, "stock": 20},
    {"nombre": "Pepino con chile", "precio": 30, "stock": 20},
    {"nombre": "Nuez", "precio": 35, "stock": 20},
    {"nombre": "Chocolate rellena", "precio": 40, "stock": 20},
    {"nombre": "Paleta mangonada", "precio": 40, "stock": 20},
    {"nombre": "Banana split", "precio": 95, "stock": 20},
    {"nombre": "Mangonada en vaso", "precio": 75, "stock": 20},
    {"nombre": "Raspado de tamarindo", "precio": 45, "stock": 20},
    {"nombre": "Malteada", "precio": 65, "stock": 20},
    {"nombre": "Cono doble", "precio": 55, "stock": 20},
]


def vista_ssr(request):
    """Vista SSR: los productos se escriben en el HTML antes de enviarlo al navegador."""
    contexto = {"productos": PRODUCTOS}
    return render(request, 'catalogo/catalogo_ssr.html', contexto)