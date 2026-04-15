# Documentacion Tecnica

## Proyecto
Calculadora Profesional de Gorras

## Version de la documentacion
1.0

## Ultima actualizacion
2026-04-14

## Descripcion general
La aplicacion es una web estatica construida con:
- `HTML`
- `CSS`
- `JavaScript`

No usa framework frontend ni backend. La persistencia actual se hace con `localStorage`.

## Estructura del proyecto

```text
jgm/
|- index.html
|- script.js
|- styles.css
|- img/
|  |- logo.png
|- docs/
   |- MANUAL_USUARIO.md
   |- DOCUMENTACION_TECNICA.md
```

## Objetivo tecnico
Entregar una herramienta ligera que pueda:
- Ejecutarse sin instalación compleja.
- Abrirse directamente en navegador.
- Mantener datos del pedido en el equipo local.
- Facilitar evolución incremental sin dependencia de frameworks.

## Arquitectura actual

### Capa de presentacion
- Archivo: `index.html`
- Responsabilidad:
  - Estructura de la interfaz.
  - Inputs del pedido.
  - Panel de configuracion.
  - Acciones principales.
  - Contenedores de alertas y resultados.

### Capa de estilos
- Archivo: `styles.css`
- Responsabilidad:
  - Variables visuales.
  - Tema claro.
  - Tema oscuro mediante `body[data-theme="dark"]`.
  - Layout responsive.
  - Componentes visuales reutilizables.

### Capa de logica
- Archivo: `script.js`
- Responsabilidad:
  - Estado de materiales.
  - Estado de referencias.
  - Estado de costos, procesos y pedido.
  - Persistencia en `localStorage`.
  - Reglas de costeo.
  - Render dinamico.
  - Exportacion CSV.
  - Modo oscuro.

## Estado principal de la aplicacion

### Variables globales
El archivo `script.js` usa estado global simple:
- `contadorColores`
- `textos`
- `ultimoResumen`
- `materialesConfig`
- `coloresGorra`
- `costosIndustriales`
- `procesosProduccion`
- `datosPedido`

Este enfoque es correcto para el tamaño actual del proyecto, pero si la app sigue creciendo convendria migrar a una estructura modular.

## Configuracion base

### `materialesDefault`
Define materiales iniciales con:
- nombre
- precio
- cantidad
- tipo
- activo

### `costosIndustrialesDefault`
Define:
- precioVenta
- manoObra
- costosIndirectos
- porcentajeDesperdicio
- margenObjetivo

### `procesosDefault`
Define costos por proceso:
- costoCorte
- costoBordado
- costoConfeccion
- costoEmpaque

### `pedidoDefault`
Define datos base del pedido:
- cliente
- ordenProduccion
- modeloGorra
- tiempoEntrega

### `modelosGorra`
Mapa de presets por modelo:
- `personalizado`
- `trucker`
- `seis_paneles`
- `cinco_paneles`
- `plana`
- `curva`

Cada modelo puede definir:
- `gorraMalla`
- cantidades sugeridas por parte

## Flujo de inicializacion

### `inicializar()`
Responsabilidades:
1. Cargar datos desde `localStorage`.
2. Aplicar tema guardado.
3. Enlazar eventos base.
4. Actualizar nombre del material principal.
5. Renderizar materiales.
6. Renderizar referencias.
7. Verificar bloqueo de cantidad general.
8. Crear referencia inicial si no existe ninguna.

## Persistencia local

### Claves de almacenamiento
- `calcGorrasConfig`
- `calcGorrasTheme`

### Datos guardados
Se almacena:
- configuracion de materiales
- referencias
- contador de referencias
- tipo de gorra malla
- cantidad general
- costos industriales
- procesos de produccion
- datos del pedido

### Tema guardado
El tema se guarda por separado para conservar la preferencia visual incluso si se reinicia el pedido.

## Funciones clave

### Gestion de estado
- `clonar()`
- `crearColorVacio()`
- `sincronizarCostosIndustriales()`
- `sincronizarProcesosProduccion()`
- `sincronizarDatosPedido()`

### Persistencia
- `guardarEnLocalStorage()`
- `cargarDelLocalStorage()`
- `aplicarCostosIndustriales()`
- `aplicarProcesosProduccion()`
- `aplicarDatosPedido()`

### Tema visual
- `aplicarTemaInicial()`
- `alternarTema()`
- `actualizarTextoBotonTema()`

### UI y render
- `toggleAccordion()`
- `actualizarNombreMaterialPrincipal()`
- `renderizarMateriales()`
- `renderizarPartesColores()`
- `mostrarAlerta()`
- `verificarCantidadGorras()`

### Modelos y referencias
- `aplicarModeloSeleccionado()`
- `agregarOtroColor()`
- `eliminarColor()`
- `hayColoresDefinidos()`
- `construirDescripcionColores()`
- `construirLotesCalculo()`

### Costeo
- `calcularConsumos()`
- `calcularCostoProcesos()`
- `calcular()`

### Exportacion y utilidades
- `copiarBloque()`
- `descargarBloque()`
- `exportarResumen()`
- `reiniciarApp()`

## Logica de negocio actual

### Cantidad general vs referencias
La app opera con dos modos:

#### Modo general
Si no hay colores definidos por referencia:
- Usa `cantidadGorras`.

#### Modo por referencias
Si existen colores definidos:
- Ignora la cantidad general.
- Usa la cantidad de cada referencia.

Esto evita duplicar unidades.

### Consumo estimado de materiales
La logica actual calcula:
- `telaMt` en funcion de coco y viseras.
- `viseraCantidad` en funcion de visera arriba y abajo.
- `botonCantidad`
- `ojalCantidad`

Los demas materiales usan la cantidad configurada por gorra.

### Costo unitario final
La formula actual es:

```text
costoMaterialesUnitario
+ manoObra
+ costosIndirectos
+ costoProcesos
= costoBaseUnitario

costoBaseUnitario * factorDesperdicio
= costoFinalUnitario
```

Donde:

```text
factorDesperdicio = 1 + (porcentajeDesperdicio / 100)
```

### Precio sugerido
Se calcula con base en el margen objetivo:

```text
precioSugerido = costoFinalUnitario / (1 - margenObjetivo)
```

Nota:
`margenObjetivo` se usa como decimal internamente.

### Ganancia

```text
gananciaUnitaria = precioVenta - costoFinalUnitario
gananciaLote = gananciaUnitaria * cantidad
```

## Exportacion

### CSV
`exportarResumen()` genera un archivo `.csv` con:
- cliente
- orden
- modelo
- entrega
- total de gorras
- precio de venta
- costo de procesos
- costo promedio
- ganancia unitaria
- margen estimado
- inversion total
- ganancia total

## Modo oscuro
La interfaz usa variables CSS y alterna el atributo:

```html
body[data-theme="dark"]
```

Ventajas:
- No requiere hoja de estilos separada.
- Facilita mantener consistencia visual.
- Reduce duplicacion de reglas.

## Riesgos y limites tecnicos actuales

### 1. Estado global
La app usa variables globales. Esto es simple, pero puede volverse frágil al crecer.

### 2. Sin backend
No hay sincronizacion multiusuario, auditoria ni base historica compartida.

### 3. Sin validacion profunda
Todavia no hay reglas avanzadas como:
- limites por capacidad de planta
- alertas por costos fuera de rango
- validacion por modelo y numero de paneles

### 4. Persistencia limitada
`localStorage` funciona para uso local, pero no para equipos grandes o trabajo colaborativo.

## Recomendaciones de evolucion

### Corto plazo
- Crear `README.md` principal.
- Agregar PDF de cotizacion y orden de produccion.
- Documentar formulas por modelo.
- Agregar campo de observaciones del pedido.

### Mediano plazo
- Separar `script.js` en modulos:
  - estado
  - persistencia
  - render
  - calculos
  - exportacion
- Centralizar constantes y presets.
- Crear pruebas de calculo.

### Largo plazo
- Integrar base de datos.
- Soportar multiples pedidos.
- Gestion de usuarios y permisos.
- Integracion con inventario, compras y produccion.

## Estrategia para mantener esta documentacion viva
Cada vez que cambie el proyecto, se deben revisar estos bloques:
- Interfaz visible al usuario.
- Nuevos campos o formularios.
- Formulas de costeo.
- Persistencia.
- Exportaciones.
- Tema visual.

Regla recomendada:
- Si cambia el flujo del operario, actualizar `MANUAL_USUARIO.md`.
- Si cambia logica, estructura o almacenamiento, actualizar `DOCUMENTACION_TECNICA.md`.
- Si cambia ambos, actualizar ambos documentos el mismo dia.

## Convencion de actualizacion
Al final de cada cambio relevante:
1. Incrementar `Ultima actualizacion`.
2. Agregar una linea en `Historial de cambios`.
3. Revisar si el manual y la documentacion siguen alineados.

## Historial de cambios de la documentacion

### 2026-04-14
- Se crea la documentacion tecnica inicial.
- Se documenta estructura del proyecto.
- Se documenta la logica de costeo actual.
- Se documenta persistencia local, modo oscuro, reinicio y exportacion CSV.
