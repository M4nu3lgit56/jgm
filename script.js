
let contadorColores = 0;
let textos = {};

// Configuración de materiales por defecto
const materialesDefault = {
    tela: { nombre: 'Tela (mt)', precio: 934, cantidad: 0.1, tipo: 'longitud', activo: true, personalizador: 'Coco' },
    lino: { nombre: 'Lino Flex', precio: 450, cantidad: 1, tipo: 'unitario', activo: true },
    pimpon: { nombre: 'Pimpón', precio: 412.5, cantidad: 1, tipo: 'unitario', activo: true },
    visera: { nombre: 'Visera', precio: 480, cantidad: 1, tipo: 'unitario', activo: true },
    correa: { nombre: 'Correa', precio: 180, cantidad: 1, tipo: 'unitario', activo: true },
    boton: { nombre: 'Botón', precio: 65, cantidad: 1, tipo: 'unitario', activo: true },
    ojal: { nombre: 'Ojal', precio: 25, cantidad: 1, tipo: 'unitario', activo: true },
    marquilla: { nombre: 'Marquilla', precio: 160, cantidad: 1, tipo: 'unitario', activo: true },
    bandera: { nombre: 'Bandera', precio: 70, cantidad: 1, tipo: 'unitario', activo: true },
    etiqueta: { nombre: 'Etiqueta', precio: 70, cantidad: 1, tipo: 'unitario', activo: true },
    sesgoE: { nombre: 'Sesgo estampado (mt)', precio: 270, cantidad: 1, tipo: 'longitud', activo: true },
    sesgoT: { nombre: 'Sesgo trasero (mt)', precio: 31, cantidad: 0.25, tipo: 'longitud', activo: true },
    tira: { nombre: 'Tira (mt)', precio: 168, cantidad: 0.6, tipo: 'longitud', activo: true }
};

const partesGorra = ['Botón', 'Coco', 'Visera Arriba', 'Visera Abajo', 'Ojal'];
let materialesConfig = JSON.parse(JSON.stringify(materialesDefault));
let coloresGorra = {};

// Inicializar
function inicializar() {
    cargarDelLocalStorage();
    renderizarMateriales();
    renderizarPartesColores();
    // Solo agregar el primer color si no hay ninguno
    if (contadorColores === 0) {
        agregarOtroColor();
    }
}

// LocalStorage
function guardarEnLocalStorage() {
    const gorraMAlla = document.getElementById('gorraMAlla');
    const cantidadGorras = document.getElementById('cantidadGorras');
    
    const datos = {
        materialesConfig,
        coloresGorra,
        contadorColores,
        gorraMAlla: gorraMAlla?.checked || false,
        cantidadGorras: cantidadGorras?.value || ''
    };
    localStorage.setItem('calcGorrasConfig', JSON.stringify(datos));
}

function cargarDelLocalStorage() {
    const datos = localStorage.getItem('calcGorrasConfig');
    if (datos) {
        const config = JSON.parse(datos);
        materialesConfig = config.materialesConfig || JSON.parse(JSON.stringify(materialesDefault));
        coloresGorra = config.coloresGorra || {};
    
        
        const gorraMAlla = document.getElementById('gorraMAlla');
        const cantidadGorras = document.getElementById('cantidadGorras');
        
        if (gorraMAlla) gorraMAlla.checked = config.gorraMAlla || false;
        if (cantidadGorras) cantidadGorras.value = config.cantidadGorras || '';
        
        // Asegurar que cada color tenga una cantidad por defecto
        Object.keys(coloresGorra).forEach(key => {
            if (!coloresGorra[key].cantidad) {
                coloresGorra[key].cantidad = 1;
            }
        });
    }
}

function toggleAccordion() {
    const accordion = document.getElementById('configAccordion');
    const header = document.querySelector('.accordion-header');
    
    if (accordion) accordion.classList.toggle('active');
    if (header) header.classList.toggle('active');
}

function renderizarMateriales() {
    const container = document.getElementById('materialesConfig');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(materialesConfig).forEach(([key, material]) => {
        const div = document.createElement('div');
        div.className = 'material-config-item';
        
        const unidad = material.tipo === 'longitud' ? 'mt' : 'und';
        
        div.innerHTML = `
            <div class="material-config-row">
                <div>
                    <label>${material.nombre}</label>
                    <input type="number" class="material-precio" data-key="${key}" value="${material.precio}" placeholder="Precio">
                </div>
                <div>
                    <label>Cantidad/Gorra (${unidad})</label>
                    <input type="number" class="material-cantidad" data-key="${key}" value="${material.cantidad}" placeholder="Cantidad" step="0.01">
                </div>
            </div>
            <div class="material-toggle">
                <input type="checkbox" class="material-activo" data-key="${key}" ${material.activo ? 'checked' : ''}>
                <label style="width: auto; margin: 0;">Usar en gorras</label>
            </div>
            ${Object.keys(materialesConfig).length > Object.keys(materialesDefault).length && !materialesDefault[key] ? `
                <button class="delete-material" onclick="eliminarMaterial('${key}')">Eliminar</button>
            ` : ''}
        `;
        
        container.appendChild(div);
        
        const precioInput = div.querySelector('.material-precio');
        const cantidadInput = div.querySelector('.material-cantidad');
        const activoCheckbox = div.querySelector('.material-activo');
        
        if (precioInput) {
            precioInput.addEventListener('change', (e) => {
                materialesConfig[key].precio = parseFloat(e.target.value) || 0;
                guardarEnLocalStorage();
            });
        }
        
        if (cantidadInput) {
            cantidadInput.addEventListener('change', (e) => {
                materialesConfig[key].cantidad = parseFloat(e.target.value) || 0;
                guardarEnLocalStorage();
            });
        }
        
        if (activoCheckbox) {
            activoCheckbox.addEventListener('change', (e) => {
                materialesConfig[key].activo = e.target.checked;
                guardarEnLocalStorage();
            });
        }
    });
}

function agregarMaterialPersonalizado() {
    const nombre = prompt('Nombre del material:');
    if (!nombre) return;
    
    const tipo = confirm('¿Es de medida de longitud? (OK = sí, Cancelar = unitario)') ? 'longitud' : 'unitario';
    const precio = parseFloat(prompt('Precio del material:') || 0);
    const cantidad = parseFloat(prompt('Cantidad por gorra:') || 1);
    
    const key = `custom_${Date.now()}`;
    materialesConfig[key] = {
        nombre,
        precio,
        cantidad,
        tipo,
        activo: true,
        personalizador: null
    };
    
    guardarEnLocalStorage();
    renderizarMateriales();
}

function eliminarMaterial(key) {
    if (confirm(`¿Eliminar ${materialesConfig[key].nombre}?`)) {
        delete materialesConfig[key];
        guardarEnLocalStorage();
        renderizarMateriales();
    }
}

function manejarMalla() {
    guardarEnLocalStorage();
}

function renderizarPartesColores() {
    const container = document.getElementById('partesColores');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= contadorColores; i++) {
        if (!coloresGorra[i]) {
            coloresGorra[i] = {
                cantidad: 1,
                boton_color: '',
                boton_cantidad: 1,
                coco_color: '',
                coco_cantidad: 1,
                visera_arriba_color: '',
                visera_arriba_cantidad: 1,
                visera_abajo_color: '',
                visera_abajo_cantidad: 1,
                ojal_color: '',
                ojal_cantidad: 1
            };
        }
        
        const parteDiv = document.createElement('div');
        parteDiv.className = 'card';
        parteDiv.style.marginBottom = '20px';
        
        const cantidadActual = coloresGorra[i].cantidad || 1;
        parteDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                <h4>Color ${i}</h4>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <label style="font-size: 0.9em; color: #cbd5e1;">Cantidad total de gorras:</label>
                    <input type="number" class="cantidad-color" data-color="${i}" value="${cantidadActual}" min="1" style="width: 90px; font-size: 14px;">
                </div>
            </div>
        `;
        
        const colorContainer = document.createElement('div');
        colorContainer.className = 'color-part-container';
        
        partesGorra.forEach(parte => {
            const keyParte = parte.toLowerCase().replace(/\s+/g, '_');
            const valorActual = coloresGorra[i][`${keyParte}_color`] || '';
            const cantidadParte = coloresGorra[i][`${keyParte}_cantidad`] || 1;
            
            const colorItem = document.createElement('div');
            colorItem.className = 'color-part-item';
            colorItem.innerHTML = `
                <label>${parte}</label>
                <input type="text" class="color-input" data-color="${i}" data-parte="${keyParte}" value="${valorActual}" placeholder="Color">
                <input type="number" class="cantidad-parte" data-color="${i}" data-parte="${keyParte}" value="${cantidadParte}" min="0" step="0.1" placeholder="Cantidad">
            `;
            
            colorContainer.appendChild(colorItem);
        });
        
        parteDiv.appendChild(colorContainer);
        container.appendChild(parteDiv);
    }
    
    document.querySelectorAll('.color-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const numColor = parseInt(e.target.dataset.color);
            const parte = e.target.dataset.parte;
            coloresGorra[numColor][`${parte}_color`] = e.target.value;
            guardarEnLocalStorage();
            verificarCantidadGorras();
        });
    });
    
    document.querySelectorAll('.cantidad-parte').forEach(input => {
        input.addEventListener('change', (e) => {
            const numColor = parseInt(e.target.dataset.color);
            const parte = e.target.dataset.parte;
            coloresGorra[numColor][`${parte}_cantidad`] = parseFloat(e.target.value) || 0;
            guardarEnLocalStorage();
        });
    });
    
    document.querySelectorAll('.cantidad-color').forEach(input => {
        input.addEventListener('change', (e) => {
            const numColor = parseInt(e.target.dataset.color);
            coloresGorra[numColor].cantidad = parseInt(e.target.value) || 1;
            guardarEnLocalStorage();
        });
    });
}

function verificarCantidadGorras() {
    const inputCantidad = document.getElementById('cantidadGorras');
    if (!inputCantidad) return;
    
    // Si hay colores específicos con cantidades definidas, deshabilitar el input general
    const hayColoresEspecificos = Object.values(coloresGorra).some(colores => 
        colores && Object.keys(colores).some(key => key !== 'cantidad' && colores[key])
    );
    inputCantidad.disabled = hayColoresEspecificos;
}

function agregarOtroColor() {
    contadorColores++;
    coloresGorra[contadorColores] = {
        cantidad: 1,
        boton_color: '',
        boton_cantidad: 1,
        coco_color: '',
        coco_cantidad: 1,
        visera_arriba_color: '',
        visera_arriba_cantidad: 1,
        visera_abajo_color: '',
        visera_abajo_cantidad: 1,
        ojal_color: '',
        ojal_cantidad: 1
    };
    renderizarPartesColores();
    guardarEnLocalStorage();
    verificarCantidadGorras();
}

function formato(num) {
    return num.toLocaleString('es-CO');
}

function medida(valor) {
    if (valor < 1) {
        return (valor * 100).toFixed(0) + " cm";
    }
    return valor.toFixed(2) + " mt";
}

function calcular() {
    let totalInv = 0;
    let totalGan = 0;
    let html = "";
    textos = {};

    const precioVenta = parseFloat(prompt('Precio de venta por gorra:', '500') || 500);
    const esGorraMalla = document.getElementById('gorraMAlla')?.checked || false;
    
    // Calcular por cada color
    for (let i = 1; i <= contadorColores; i++) {
        const colores = coloresGorra[i];
        if (!colores) continue;
        
        const cantidad = colores.cantidad || 1;
        const tieneColores = Object.keys(colores).some(key => key !== 'cantidad' && key.endsWith('_color') && colores[key]);
        
        if (!cantidad) continue;
        
        // Construir descripción de colores
        let descripcionColores = '';
        if (tieneColores) {
            const coloresArray = Object.entries(colores)
                .filter(([k, v]) => k.endsWith('_color') && v)
                .map(([k, v]) => `${k.replace(/_/g, ' ').replace(' color', '')}: ${v}`);
            descripcionColores = coloresArray.join(' | ');
        }
        
        const cocoCantidad = parseFloat(colores.coco_cantidad) || 0;
        const viseraArribaCantidad = parseFloat(colores.visera_arriba_cantidad) || 0;
        const viseraAbajoCantidad = parseFloat(colores.visera_abajo_cantidad) || 0;
        const botonCantidad = parseFloat(colores.boton_cantidad) || 0;
        const ojalCantidad = parseFloat(colores.ojal_cantidad) || 0;
        
        const viseraCantidad = viseraArribaCantidad + viseraAbajoCantidad;
        const telaMt = cocoCantidad * 0.1 + viseraArribaCantidad * 0.0182 + viseraAbajoCantidad * 0.0182;
        
        let costoUnitario = 0;
        let materialesUsados = {};
        
        Object.entries(materialesConfig).forEach(([key, material]) => {
            if (!material.activo) return;
            
            let cantidadMaterial = material.cantidad;
            
            if (key === 'tela') {
                cantidadMaterial = telaMt;
            } else if (key === 'visera') {
                cantidadMaterial = viseraCantidad;
            } else if (key === 'boton') {
                cantidadMaterial = botonCantidad;
            } else if (key === 'ojal') {
                cantidadMaterial = ojalCantidad;
            }
            
            const costo = material.precio * cantidadMaterial;
            costoUnitario += costo;
            materialesUsados[key] = { cantidad: cantidadMaterial, costo, nombre: material.nombre, tipo: material.tipo };
        });
        
        const inversion = costoUnitario * cantidad;
        const precioVentaTotal = precioVenta;
        const ganancia = (precioVentaTotal - costoUnitario) * cantidad;
        
        totalInv += inversion;
        totalGan += ganancia;
        
        let textMateriales = `\nMateriales:\n`;
        Object.entries(materialesUsados).forEach(([key, mat]) => {
            const unidad = mat.tipo === 'longitud' ? 'mt' : 'und';
            textMateriales += `- ${mat.nombre}: ${mat.cantidad.toFixed(2)} ${unidad}\n`;
        });
        
        textos[i] = `
Color: ${descripcionColores || 'Sin especificar'}
Cantidad: ${cantidad}
${textMateriales}
Inversión: $${formato(inversion)}
Precio unitario: $${formato(costoUnitario)}
Precio venta: $${formato(precioVentaTotal)}
Ganancia: $${formato(ganancia)}
`;
        
        html += `
<div class="result" id="bloque${i}">
<h3>${descripcionColores || `Color ${i}`}</h3>
<p><b>Cantidad:</b> ${cantidad}</p>
<p><b>Materiales:</b></p>
<ul>
`;
        
        Object.entries(materialesUsados).forEach(([key, mat]) => {
            const unidad = mat.tipo === 'longitud' ? 'mt' : 'und';
            html += `<li>${mat.nombre}: ${mat.cantidad.toFixed(2)} ${unidad}</li>`;
        });
        
        html += `
</ul>
<p><b>Inversión:</b> $${formato(inversion)}</p>
<p><b>Precio unitario:</b> $${formato(costoUnitario)}</p>
<p><b>Precio de venta:</b> $${formato(precioVentaTotal)}</p>
<p><b>Ganancia:</b> $${formato(ganancia)}</p>

<div class="actions">
<button class="copy" onclick="copiarBloque(${i})">Copiar</button>
<button class="img" onclick="descargarBloque(${i})">Imagen</button>
</div>

</div>
`;
    }
    
    html += `
<div class="result">
<h2>Total</h2>
<p><b>Inversión total:</b> $${formato(totalInv)}</p>
<p><b>Ganancia total:</b> $${formato(totalGan)}</p>
</div>
`;
    
    document.getElementById('resultado').innerHTML = html;
}

function copiarBloque(i) {
    const bloque = document.getElementById(`bloque${i}`);
    navigator.clipboard.writeText(bloque.innerText);
    alert("Copiado");
}

function descargarBloque(i) {
    let boton1 = document.querySelector(`#bloque${i} .img`);
    let boton2 = document.querySelector(`#bloque${i} .copy`);
    boton1.style.display = 'none';
    boton2.style.display = 'none';
    html2canvas(document.getElementById(`bloque${i}`)).then(canvas => {
        let link = document.createElement('a');
        link.download = `color_${i}.png`;
        link.href = canvas.toDataURL();
        link.click();
        boton1.style.display = 'inline-block';
        boton2.style.display = 'inline-block';
    });
}

document.getElementById('cantidadGorras')?.addEventListener('change', () => {
    guardarEnLocalStorage();
});

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}
