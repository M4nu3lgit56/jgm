let contadorColores = 0;
let textos = {};
let ultimoResumen = null;

const STORAGE_KEY = "calcGorrasConfig";
const THEME_KEY = "calcGorrasTheme";

const materialesDefault = {
    tela: { nombre: "Tela principal (mt)", precio: 934, cantidad: 0.1, tipo: "longitud", activo: true },
    lino: { nombre: "Lino Flex", precio: 450, cantidad: 1, tipo: "unitario", activo: true },
    pimpon: { nombre: "Pimpon", precio: 412.5, cantidad: 1, tipo: "unitario", activo: true },
    visera: { nombre: "Visera", precio: 480, cantidad: 1, tipo: "unitario", activo: true },
    correa: { nombre: "Correa", precio: 180, cantidad: 1, tipo: "unitario", activo: true },
    boton: { nombre: "Boton", precio: 65, cantidad: 1, tipo: "unitario", activo: true },
    ojal: { nombre: "Ojal", precio: 25, cantidad: 1, tipo: "unitario", activo: true },
    marquilla: { nombre: "Marquilla", precio: 160, cantidad: 1, tipo: "unitario", activo: true },
    bandera: { nombre: "Bandera", precio: 70, cantidad: 1, tipo: "unitario", activo: true },
    etiqueta: { nombre: "Etiqueta", precio: 70, cantidad: 1, tipo: "unitario", activo: true },
    sesgoE: { nombre: "Sesgo estampado (mt)", precio: 270, cantidad: 1, tipo: "longitud", activo: true },
    sesgoT: { nombre: "Sesgo trasero (mt)", precio: 31, cantidad: 0.25, tipo: "longitud", activo: true },
    tira: { nombre: "Tira (mt)", precio: 168, cantidad: 0.6, tipo: "longitud", activo: true }
};

const costosIndustrialesDefault = {
    precioVenta: 500,
    manoObra: 0,
    costosIndirectos: 0,
    porcentajeDesperdicio: 0,
    margenObjetivo: 30
};

const procesosDefault = {
    costoCorte: 0,
    costoBordado: 0,
    costoConfeccion: 0,
    costoEmpaque: 0
};

const pedidoDefault = {
    cliente: "",
    ordenProduccion: "",
    modeloGorra: "personalizado",
    tiempoEntrega: ""
};

const modelosGorra = {
    personalizado: null,
    trucker: {
        gorraMalla: true,
        partes: {
            coco_cantidad: 1,
            boton_cantidad: 1,
            visera_arriba_cantidad: 1,
            visera_abajo_cantidad: 1,
            ojal_cantidad: 0
        }
    },
    seis_paneles: {
        gorraMalla: false,
        partes: {
            coco_cantidad: 1,
            boton_cantidad: 1,
            visera_arriba_cantidad: 1,
            visera_abajo_cantidad: 1,
            ojal_cantidad: 6
        }
    },
    cinco_paneles: {
        gorraMalla: false,
        partes: {
            coco_cantidad: 1,
            boton_cantidad: 1,
            visera_arriba_cantidad: 1,
            visera_abajo_cantidad: 1,
            ojal_cantidad: 4
        }
    },
    plana: {
        gorraMalla: false,
        partes: {
            coco_cantidad: 1,
            boton_cantidad: 1,
            visera_arriba_cantidad: 1,
            visera_abajo_cantidad: 1,
            ojal_cantidad: 6
        }
    },
    curva: {
        gorraMalla: false,
        partes: {
            coco_cantidad: 1,
            boton_cantidad: 1,
            visera_arriba_cantidad: 1,
            visera_abajo_cantidad: 1,
            ojal_cantidad: 6
        }
    }
};

const partesGorra = [
    { key: "boton", label: "Boton" },
    { key: "coco", label: "Coco" },
    { key: "visera_arriba", label: "Visera arriba" },
    { key: "visera_abajo", label: "Visera abajo" },
    { key: "ojal", label: "Ojal" }
];

let materialesConfig = clonar(materialesDefault);
let coloresGorra = {};
let costosIndustriales = { ...costosIndustrialesDefault };
let procesosProduccion = { ...procesosDefault };
let datosPedido = { ...pedidoDefault };

function clonar(valor) {
    return JSON.parse(JSON.stringify(valor));
}

function crearColorVacio() {
    const color = { cantidad: 1 };
    partesGorra.forEach((parte) => {
        color[`${parte.key}_color`] = "";
        color[`${parte.key}_cantidad`] = parte.key === "ojal" ? 6 : 1;
    });
    return color;
}

function inicializar() {
    cargarDelLocalStorage();
    aplicarTemaInicial();
    enlazarCamposBase();
    enlazarControlesTema();
    actualizarNombreMaterialPrincipal();
    renderizarMateriales();
    renderizarPartesColores();
    verificarCantidadGorras();

    if (contadorColores === 0) {
        agregarOtroColor();
    }
}

function enlazarCamposBase() {
    const ids = [
        "cantidadGorras",
        "cliente",
        "ordenProduccion",
        "modeloGorra",
        "tiempoEntrega",
        "precioVenta",
        "manoObra",
        "costosIndirectos",
        "porcentajeDesperdicio",
        "margenObjetivo",
        "costoCorte",
        "costoBordado",
        "costoConfeccion",
        "costoEmpaque"
    ];

    ids.forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener("change", () => {
            sincronizarDatosPedido();
            sincronizarCostosIndustriales();
            sincronizarProcesosProduccion();
            guardarEnLocalStorage();
            if (id === "cantidadGorras") {
                verificarCantidadGorras();
            }
            if (id === "modeloGorra") {
                aplicarModeloSeleccionado();
            }
        });
    });
}

function enlazarControlesTema() {
    const boton = document.getElementById("toggleTheme");
    if (!boton) return;
    boton.addEventListener("click", alternarTema);
    actualizarTextoBotonTema();
}

function sincronizarCostosIndustriales() {
    costosIndustriales = {
        precioVenta: obtenerNumeroInput("precioVenta", 0),
        manoObra: obtenerNumeroInput("manoObra", 0),
        costosIndirectos: obtenerNumeroInput("costosIndirectos", 0),
        porcentajeDesperdicio: obtenerNumeroInput("porcentajeDesperdicio", 0),
        margenObjetivo: obtenerNumeroInput("margenObjetivo", 30)
    };
}

function sincronizarProcesosProduccion() {
    procesosProduccion = {
        costoCorte: obtenerNumeroInput("costoCorte", 0),
        costoBordado: obtenerNumeroInput("costoBordado", 0),
        costoConfeccion: obtenerNumeroInput("costoConfeccion", 0),
        costoEmpaque: obtenerNumeroInput("costoEmpaque", 0)
    };
}

function sincronizarDatosPedido() {
    datosPedido = {
        cliente: document.getElementById("cliente")?.value?.trim() || "",
        ordenProduccion: document.getElementById("ordenProduccion")?.value?.trim() || "",
        modeloGorra: document.getElementById("modeloGorra")?.value || "personalizado",
        tiempoEntrega: document.getElementById("tiempoEntrega")?.value?.trim() || ""
    };
}

function obtenerNumeroInput(id, fallback = 0) {
    const input = document.getElementById(id);
    if (!input) return fallback;
    const valor = parseFloat(input.value);
    return Number.isFinite(valor) ? valor : fallback;
}

function guardarEnLocalStorage() {
    sincronizarDatosPedido();
    sincronizarCostosIndustriales();
    sincronizarProcesosProduccion();

    const datos = {
        materialesConfig,
        coloresGorra,
        contadorColores,
        gorraMalla: document.getElementById("gorraMAlla")?.checked || false,
        cantidadGorras: document.getElementById("cantidadGorras")?.value || "",
        costosIndustriales,
        procesosProduccion,
        datosPedido
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function cargarDelLocalStorage() {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) {
        aplicarCostosIndustriales(costosIndustrialesDefault);
        return;
    }

    try {
        const config = JSON.parse(datos);
        materialesConfig = config.materialesConfig || clonar(materialesDefault);
        coloresGorra = config.coloresGorra || {};
        contadorColores = Number.isInteger(config.contadorColores)
            ? config.contadorColores
            : Object.keys(coloresGorra).length;
        costosIndustriales = { ...costosIndustrialesDefault, ...(config.costosIndustriales || {}) };
        procesosProduccion = { ...procesosDefault, ...(config.procesosProduccion || {}) };
        datosPedido = { ...pedidoDefault, ...(config.datosPedido || {}) };

        const gorraMalla = document.getElementById("gorraMAlla");
        const cantidadGorras = document.getElementById("cantidadGorras");

        if (gorraMalla) gorraMalla.checked = !!config.gorraMalla;
        if (cantidadGorras) cantidadGorras.value = config.cantidadGorras || "";
        aplicarCostosIndustriales(costosIndustriales);
        aplicarProcesosProduccion(procesosProduccion);
        aplicarDatosPedido(datosPedido);

        for (let i = 1; i <= contadorColores; i += 1) {
            coloresGorra[i] = { ...crearColorVacio(), ...(coloresGorra[i] || {}) };
            if (!coloresGorra[i].cantidad) coloresGorra[i].cantidad = 1;
        }
    } catch (error) {
        console.error("No se pudo cargar la configuracion guardada:", error);
        materialesConfig = clonar(materialesDefault);
        coloresGorra = {};
        contadorColores = 0;
        costosIndustriales = { ...costosIndustrialesDefault };
        procesosProduccion = { ...procesosDefault };
        datosPedido = { ...pedidoDefault };
        aplicarCostosIndustriales(costosIndustriales);
        aplicarProcesosProduccion(procesosProduccion);
        aplicarDatosPedido(datosPedido);
    }
}

function aplicarCostosIndustriales(config) {
    const campos = {
        precioVenta: config.precioVenta,
        manoObra: config.manoObra,
        costosIndirectos: config.costosIndirectos,
        porcentajeDesperdicio: config.porcentajeDesperdicio,
        margenObjetivo: config.margenObjetivo
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const input = document.getElementById(id);
        if (input) input.value = valor;
    });
}

function aplicarProcesosProduccion(config) {
    Object.entries(config).forEach(([id, valor]) => {
        const input = document.getElementById(id);
        if (input) input.value = valor;
    });
}

function aplicarDatosPedido(config) {
    const campos = {
        cliente: config.cliente,
        ordenProduccion: config.ordenProduccion,
        modeloGorra: config.modeloGorra,
        tiempoEntrega: config.tiempoEntrega
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const input = document.getElementById(id);
        if (input) input.value = valor;
    });
}

function aplicarTemaInicial() {
    const temaGuardado = localStorage.getItem(THEME_KEY) || "light";
    document.body.dataset.theme = temaGuardado;
}

function alternarTema() {
    const actual = document.body.dataset.theme === "dark" ? "dark" : "light";
    const nuevo = actual === "dark" ? "light" : "dark";
    document.body.dataset.theme = nuevo;
    localStorage.setItem(THEME_KEY, nuevo);
    actualizarTextoBotonTema();
}

function actualizarTextoBotonTema() {
    const boton = document.getElementById("toggleTheme");
    if (!boton) return;
    boton.textContent = document.body.dataset.theme === "dark" ? "Modo claro" : "Modo oscuro";
}

function toggleAccordion() {
    const accordion = document.getElementById("configAccordion");
    const header = document.querySelector(".accordion-header");

    accordion?.classList.toggle("active");
    header?.classList.toggle("active");
}

function actualizarNombreMaterialPrincipal() {
    const esGorraMalla = document.getElementById("gorraMAlla")?.checked || false;
    if (!materialesConfig.tela) return;
    materialesConfig.tela.nombre = esGorraMalla ? "Malla principal (mt)" : "Tela principal (mt)";
}

function renderizarMateriales() {
    const container = document.getElementById("materialesConfig");
    if (!container) return;

    container.innerHTML = "";

    Object.entries(materialesConfig).forEach(([key, material]) => {
        const div = document.createElement("div");
        div.className = "material-config-item";

        const unidad = material.tipo === "longitud" ? "mt" : "und";
        const esPersonalizado = !materialesDefault[key];

        div.innerHTML = `
            <div class="material-config-row">
                <div>
                    <label>${material.nombre}</label>
                    <input type="number" class="material-precio" data-key="${key}" value="${material.precio}" placeholder="Precio" min="0" step="0.01">
                </div>
                <div>
                    <label>Cantidad por gorra (${unidad})</label>
                    <input type="number" class="material-cantidad" data-key="${key}" value="${material.cantidad}" placeholder="Cantidad" min="0" step="0.01">
                </div>
            </div>
            <div class="material-toggle">
                <input type="checkbox" class="material-activo" data-key="${key}" ${material.activo ? "checked" : ""}>
                <label style="width: auto; margin: 0;">Usar en el calculo</label>
            </div>
            ${esPersonalizado ? `<button class="delete-material" onclick="eliminarMaterial('${key}')">Eliminar</button>` : ""}
        `;

        container.appendChild(div);

        div.querySelector(".material-precio")?.addEventListener("change", (e) => {
            materialesConfig[key].precio = parseFloat(e.target.value) || 0;
            guardarEnLocalStorage();
        });

        div.querySelector(".material-cantidad")?.addEventListener("change", (e) => {
            materialesConfig[key].cantidad = parseFloat(e.target.value) || 0;
            guardarEnLocalStorage();
        });

        div.querySelector(".material-activo")?.addEventListener("change", (e) => {
            materialesConfig[key].activo = e.target.checked;
            guardarEnLocalStorage();
        });
    });
}

function agregarMaterialPersonalizado() {
    const nombre = prompt("Nombre del material:");
    if (!nombre) return;

    const tipo = confirm("Es de longitud? Aceptar = si, Cancelar = unitario") ? "longitud" : "unitario";
    const precio = parseFloat(prompt("Precio del material:") || "0");
    const cantidad = parseFloat(prompt("Cantidad por gorra:") || "1");

    const key = `custom_${Date.now()}`;
    materialesConfig[key] = {
        nombre,
        precio: Number.isFinite(precio) ? precio : 0,
        cantidad: Number.isFinite(cantidad) ? cantidad : 1,
        tipo,
        activo: true
    };

    guardarEnLocalStorage();
    renderizarMateriales();
}

function eliminarMaterial(key) {
    if (!materialesConfig[key]) return;
    if (!confirm(`Eliminar ${materialesConfig[key].nombre}?`)) return;

    delete materialesConfig[key];
    guardarEnLocalStorage();
    renderizarMateriales();
}

function manejarMalla() {
    actualizarNombreMaterialPrincipal();
    renderizarMateriales();
    guardarEnLocalStorage();
}

function aplicarModeloSeleccionado() {
    sincronizarDatosPedido();
    const modelo = modelosGorra[datosPedido.modeloGorra];
    if (!modelo) return;

    const toggle = document.getElementById("gorraMAlla");
    if (toggle) {
        toggle.checked = !!modelo.gorraMalla;
    }

    Object.values(coloresGorra).forEach((color) => {
        Object.entries(modelo.partes).forEach(([key, value]) => {
            color[key] = value;
        });
    });

    actualizarNombreMaterialPrincipal();
    renderizarMateriales();
    renderizarPartesColores();
    guardarEnLocalStorage();
    mostrarAlerta("Modelo aplicado a las referencias actuales.", "success");
}

function renderizarPartesColores() {
    const container = document.getElementById("partesColores");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 1; i <= contadorColores; i += 1) {
        coloresGorra[i] = { ...crearColorVacio(), ...(coloresGorra[i] || {}) };

        const card = document.createElement("div");
        card.className = "card color-card";

        card.innerHTML = `
            <div class="color-card-head">
                <div>
                    <h4>Referencia de color ${i}</h4>
                    <p class="info-text">Cada bloque representa una combinacion o referencia de produccion.</p>
                </div>
                <div class="color-head-actions">
                    <div class="color-qty-box">
                        <label>Cantidad</label>
                        <input type="number" class="cantidad-color" data-color="${i}" value="${coloresGorra[i].cantidad || 1}" min="1" step="1">
                    </div>
                    <button class="delete-color" onclick="eliminarColor(${i})" ${contadorColores === 1 ? "disabled" : ""}>Eliminar</button>
                </div>
            </div>
        `;

        const grid = document.createElement("div");
        grid.className = "color-part-container";

        partesGorra.forEach((parte) => {
            const item = document.createElement("div");
            item.className = "color-part-item";
            item.innerHTML = `
                <label>${parte.label}</label>
                <input type="text" class="color-input" data-color="${i}" data-parte="${parte.key}" value="${coloresGorra[i][`${parte.key}_color`] || ""}" placeholder="Ej: negro, rojo, camuflado">
                <input type="number" class="cantidad-parte" data-color="${i}" data-parte="${parte.key}" value="${coloresGorra[i][`${parte.key}_cantidad`] || 0}" min="0" step="0.1" placeholder="Cantidad de piezas">
            `;
            grid.appendChild(item);
        });

        card.appendChild(grid);
        container.appendChild(card);
    }

    document.querySelectorAll(".color-input").forEach((input) => {
        input.addEventListener("change", (e) => {
            const numColor = Number.parseInt(e.target.dataset.color, 10);
            const parte = e.target.dataset.parte;
            coloresGorra[numColor][`${parte}_color`] = e.target.value.trim();
            guardarEnLocalStorage();
            verificarCantidadGorras();
        });
    });

    document.querySelectorAll(".cantidad-parte").forEach((input) => {
        input.addEventListener("change", (e) => {
            const numColor = Number.parseInt(e.target.dataset.color, 10);
            const parte = e.target.dataset.parte;
            coloresGorra[numColor][`${parte}_cantidad`] = parseFloat(e.target.value) || 0;
            guardarEnLocalStorage();
        });
    });

    document.querySelectorAll(".cantidad-color").forEach((input) => {
        input.addEventListener("change", (e) => {
            const numColor = Number.parseInt(e.target.dataset.color, 10);
            coloresGorra[numColor].cantidad = Math.max(1, parseInt(e.target.value, 10) || 1);
            guardarEnLocalStorage();
        });
    });
}

function hayColoresDefinidos() {
    return Object.values(coloresGorra).some((color) =>
        partesGorra.some((parte) => (color?.[`${parte.key}_color`] || "").trim() !== "")
    );
}

function verificarCantidadGorras() {
    const inputCantidad = document.getElementById("cantidadGorras");
    if (!inputCantidad) return;

    const bloquear = hayColoresDefinidos();
    inputCantidad.disabled = bloquear;
}

function agregarOtroColor() {
    contadorColores += 1;
    coloresGorra[contadorColores] = crearColorVacio();
    renderizarPartesColores();
    guardarEnLocalStorage();
    verificarCantidadGorras();
}

function eliminarColor(index) {
    if (contadorColores === 1) return;

    const nuevosColores = {};
    let nuevoIndice = 0;

    for (let i = 1; i <= contadorColores; i += 1) {
        if (i === index) continue;
        nuevoIndice += 1;
        nuevosColores[nuevoIndice] = { ...crearColorVacio(), ...(coloresGorra[i] || {}) };
    }

    coloresGorra = nuevosColores;
    contadorColores = nuevoIndice;
    renderizarPartesColores();
    guardarEnLocalStorage();
    verificarCantidadGorras();
}

function formato(num) {
    return Number(num || 0).toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function obtenerCantidadGeneral() {
    return Math.max(0, parseInt(document.getElementById("cantidadGorras")?.value || "0", 10) || 0);
}

function mostrarAlerta(mensaje, tipo = "warning") {
    const alertas = document.getElementById("alertas");
    if (!alertas) return;

    if (!mensaje) {
        alertas.innerHTML = "";
        return;
    }

    alertas.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
}

function construirDescripcionColores(color) {
    const partesConColor = partesGorra
        .map((parte) => {
            const valor = (color[`${parte.key}_color`] || "").trim();
            return valor ? `${parte.label}: ${valor}` : null;
        })
        .filter(Boolean);

    return partesConColor.join(" | ");
}

function construirLotesCalculo() {
    if (hayColoresDefinidos()) {
        return Object.entries(coloresGorra)
            .map(([id, color]) => ({
                id: Number(id),
                cantidad: Math.max(1, parseInt(color.cantidad, 10) || 1),
                color
            }))
            .filter((lote) => lote.cantidad > 0 && construirDescripcionColores(lote.color));
    }

    const cantidadGeneral = obtenerCantidadGeneral();
    if (!cantidadGeneral) return [];

    return [
        {
            id: 1,
            cantidad: cantidadGeneral,
            color: { ...crearColorVacio(), ...(coloresGorra[1] || {}) }
        }
    ];
}

function calcularConsumos(color) {
    const cocoCantidad = parseFloat(color.coco_cantidad) || 0;
    const viseraArribaCantidad = parseFloat(color.visera_arriba_cantidad) || 0;
    const viseraAbajoCantidad = parseFloat(color.visera_abajo_cantidad) || 0;
    const botonCantidad = parseFloat(color.boton_cantidad) || 0;
    const ojalCantidad = parseFloat(color.ojal_cantidad) || 0;

    return {
        telaMt: cocoCantidad * 0.1 + viseraArribaCantidad * 0.0182 + viseraAbajoCantidad * 0.0182,
        viseraCantidad: viseraArribaCantidad + viseraAbajoCantidad,
        botonCantidad,
        ojalCantidad
    };
}

function calcularCostoProcesos() {
    return Object.values(procesosProduccion).reduce((acc, valor) => acc + (parseFloat(valor) || 0), 0);
}

function calcular() {
    mostrarAlerta("");
    sincronizarDatosPedido();
    sincronizarCostosIndustriales();
    sincronizarProcesosProduccion();

    const lotes = construirLotesCalculo();
    if (!lotes.length) {
        mostrarAlerta("Debes ingresar una cantidad general o definir referencias de color con su cantidad.", "error");
        document.getElementById("resultado").innerHTML = "";
        return;
    }

    const precioVenta = costosIndustriales.precioVenta;
    const manoObra = costosIndustriales.manoObra;
    const indirectos = costosIndustriales.costosIndirectos;
    const costoProcesos = calcularCostoProcesos();
    const desperdicioFactor = 1 + (costosIndustriales.porcentajeDesperdicio / 100);
    const margenObjetivo = costosIndustriales.margenObjetivo / 100;

    let totalCantidad = 0;
    let totalInversion = 0;
    let totalGanancia = 0;
    let html = "";
    textos = {};

    lotes.forEach((lote, index) => {
        const descripcion = construirDescripcionColores(lote.color) || `Referencia ${index + 1}`;
        const consumos = calcularConsumos(lote.color);

        let costoMaterialesUnitario = 0;
        const materialesUsados = {};

        Object.entries(materialesConfig).forEach(([key, material]) => {
            if (!material.activo) return;

            let cantidadMaterial = material.cantidad;
            if (key === "tela") cantidadMaterial = consumos.telaMt;
            if (key === "visera") cantidadMaterial = consumos.viseraCantidad;
            if (key === "boton") cantidadMaterial = consumos.botonCantidad;
            if (key === "ojal") cantidadMaterial = consumos.ojalCantidad;

            const costo = material.precio * cantidadMaterial;
            costoMaterialesUnitario += costo;
            materialesUsados[key] = {
                cantidad: cantidadMaterial,
                costo,
                nombre: material.nombre,
                tipo: material.tipo
            };
        });

        const costoBaseUnitario = costoMaterialesUnitario + manoObra + indirectos + costoProcesos;
        const costoFinalUnitario = costoBaseUnitario * desperdicioFactor;
        const precioSugerido = margenObjetivo >= 1 ? costoFinalUnitario : costoFinalUnitario / (1 - margenObjetivo);
        const inversion = costoFinalUnitario * lote.cantidad;
        const gananciaUnit = precioVenta - costoFinalUnitario;
        const ganancia = gananciaUnit * lote.cantidad;
        const margenReal = precioVenta > 0 ? (gananciaUnit / precioVenta) * 100 : 0;

        totalCantidad += lote.cantidad;
        totalInversion += inversion;
        totalGanancia += ganancia;

        const textoMateriales = Object.values(materialesUsados)
            .map((mat) => `- ${mat.nombre}: ${mat.cantidad.toFixed(2)} ${mat.tipo === "longitud" ? "mt" : "und"}`)
            .join("\n");

        textos[lote.id] = [
            descripcion,
            `Cantidad: ${lote.cantidad}`,
            "",
            "Materiales:",
            textoMateriales,
            "",
            `Costo materiales unitario: $${formato(costoMaterialesUnitario)}`,
            `Costo procesos unitario: $${formato(costoProcesos)}`,
            `Costo total unitario: $${formato(costoFinalUnitario)}`,
            `Precio venta unitario: $${formato(precioVenta)}`,
            `Precio sugerido por margen: $${formato(precioSugerido)}`,
            `Inversion lote: $${formato(inversion)}`,
            `Ganancia lote: $${formato(ganancia)}`,
            `Margen real: ${formato(margenReal)}%`
        ].join("\n");

        const materialesHtml = Object.values(materialesUsados)
            .map((mat) => `<li>${mat.nombre}: ${mat.cantidad.toFixed(2)} ${mat.tipo === "longitud" ? "mt" : "und"}</li>`)
            .join("");

        html += `
            <div class="result" id="bloque${lote.id}">
                <h3>${descripcion}</h3>
                <p><b>Cantidad:</b> ${lote.cantidad}</p>
                <p><b>Materiales:</b></p>
                <ul>${materialesHtml}</ul>
                <div class="result-grid">
                    <p><b>Costo materiales unitario:</b> $${formato(costoMaterialesUnitario)}</p>
                    <p><b>Mano de obra:</b> $${formato(manoObra)}</p>
                    <p><b>Indirectos:</b> $${formato(indirectos)}</p>
                    <p><b>Procesos:</b> $${formato(costoProcesos)}</p>
                    <p><b>Costo final unitario:</b> $${formato(costoFinalUnitario)}</p>
                    <p><b>Precio venta unitario:</b> $${formato(precioVenta)}</p>
                    <p><b>Precio sugerido:</b> $${formato(precioSugerido)}</p>
                    <p><b>Margen real:</b> ${formato(margenReal)}%</p>
                    <p><b>Ganancia lote:</b> $${formato(ganancia)}</p>
                </div>
                <div class="actions">
                    <button class="copy" onclick="copiarBloque(${lote.id})">Copiar</button>
                    <button class="img" onclick="descargarBloque(${lote.id})">Imagen</button>
                </div>
            </div>
        `;
    });

    const utilidadPromedio = totalCantidad > 0 ? totalGanancia / totalCantidad : 0;
    const costoPromedio = totalCantidad > 0 ? totalInversion / totalCantidad : 0;
    const margenTotal = precioVenta > 0 ? (utilidadPromedio / precioVenta) * 100 : 0;
    const etiquetaPedido = [
        datosPedido.cliente ? `Cliente: ${datosPedido.cliente}` : null,
        datosPedido.ordenProduccion ? `OP: ${datosPedido.ordenProduccion}` : null,
        datosPedido.modeloGorra && datosPedido.modeloGorra !== "personalizado" ? `Modelo: ${document.getElementById("modeloGorra")?.selectedOptions?.[0]?.textContent || datosPedido.modeloGorra}` : "Modelo: Personalizado",
        datosPedido.tiempoEntrega ? `Entrega: ${datosPedido.tiempoEntrega}` : null
    ].filter(Boolean).join(" | ");

    html = `
        <div class="result result-total">
            <h2>Resumen del pedido</h2>
            ${etiquetaPedido ? `<p class="summary-meta">${etiquetaPedido}</p>` : ""}
            <div class="summary-kpis">
                <div><span>Total gorras</span><strong>${formato(totalCantidad)}</strong></div>
                <div><span>Costo promedio</span><strong>$${formato(costoPromedio)}</strong></div>
                <div><span>Ganancia unitaria</span><strong>$${formato(utilidadPromedio)}</strong></div>
                <div><span>Margen estimado</span><strong>${formato(margenTotal)}%</strong></div>
            </div>
            <p><b>Inversion total:</b> $${formato(totalInversion)}</p>
            <p><b>Ganancia total:</b> $${formato(totalGanancia)}</p>
        </div>
    ` + html;

    document.getElementById("resultado").innerHTML = html;
    ultimoResumen = {
        cliente: datosPedido.cliente,
        ordenProduccion: datosPedido.ordenProduccion,
        modelo: document.getElementById("modeloGorra")?.selectedOptions?.[0]?.textContent || "Personalizado",
        entrega: datosPedido.tiempoEntrega,
        totalCantidad,
        costoPromedio,
        utilidadPromedio,
        margenTotal,
        totalInversion,
        totalGanancia,
        precioVenta,
        costoProcesos
    };

    if (totalGanancia < 0) {
        mostrarAlerta("La cotizacion esta dando perdida. Revisa precio de venta, desperdicio o costos indirectos.", "warning");
    } else if (margenTotal < costosIndustriales.margenObjetivo) {
        mostrarAlerta("La utilidad es positiva, pero el margen real quedo por debajo del objetivo configurado.", "warning");
    } else {
        mostrarAlerta("Calculo actualizado correctamente.", "success");
    }
}

function exportarResumen() {
    if (!ultimoResumen) {
        mostrarAlerta("Primero calcula el pedido para poder exportar el resumen.", "warning");
        return;
    }

    const filas = [
        ["Cliente", ultimoResumen.cliente || ""],
        ["Orden de produccion", ultimoResumen.ordenProduccion || ""],
        ["Modelo", ultimoResumen.modelo],
        ["Entrega", ultimoResumen.entrega || ""],
        ["Total gorras", ultimoResumen.totalCantidad],
        ["Precio venta unitario", ultimoResumen.precioVenta],
        ["Costo procesos unitario", ultimoResumen.costoProcesos],
        ["Costo promedio unitario", ultimoResumen.costoPromedio],
        ["Ganancia unitaria", ultimoResumen.utilidadPromedio],
        ["Margen estimado (%)", ultimoResumen.margenTotal],
        ["Inversion total", ultimoResumen.totalInversion],
        ["Ganancia total", ultimoResumen.totalGanancia]
    ];

    const csv = filas.map(([clave, valor]) => `"${String(clave).replace(/"/g, '""')}","${String(valor).replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `resumen_gorras_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarAlerta("Resumen exportado en CSV.", "success");
}

function reiniciarApp() {
    if (!confirm("Se borrara la configuracion guardada y el pedido actual. Deseas continuar?")) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);
    ultimoResumen = null;
    materialesConfig = clonar(materialesDefault);
    coloresGorra = {};
    contadorColores = 0;
    costosIndustriales = { ...costosIndustrialesDefault };
    procesosProduccion = { ...procesosDefault };
    datosPedido = { ...pedidoDefault };

    const cantidadGorras = document.getElementById("cantidadGorras");
    const gorraMalla = document.getElementById("gorraMAlla");
    if (cantidadGorras) cantidadGorras.value = "";
    if (gorraMalla) gorraMalla.checked = false;

    aplicarCostosIndustriales(costosIndustriales);
    aplicarProcesosProduccion(procesosProduccion);
    aplicarDatosPedido(datosPedido);
    actualizarNombreMaterialPrincipal();
    renderizarMateriales();
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("alertas").innerHTML = "";
    agregarOtroColor();
    guardarEnLocalStorage();
    mostrarAlerta("La app se reinicio a valores base.", "success");
}

function copiarBloque(i) {
    const texto = textos[i] || document.getElementById(`bloque${i}`)?.innerText;
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    mostrarAlerta("Bloque copiado al portapapeles.", "success");
}

function descargarBloque(i) {
    const bloque = document.getElementById(`bloque${i}`);
    if (!bloque) return;

    const botonImg = bloque.querySelector(".img");
    const botonCopy = bloque.querySelector(".copy");

    if (botonImg) botonImg.style.display = "none";
    if (botonCopy) botonCopy.style.display = "none";

    html2canvas(bloque).then((canvas) => {
        const link = document.createElement("a");
        link.download = `referencia_${i}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }).finally(() => {
        if (botonImg) botonImg.style.display = "inline-block";
        if (botonCopy) botonCopy.style.display = "inline-block";
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
} else {
    inicializar();
}
