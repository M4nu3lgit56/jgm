# Manual de Usuario

## Proyecto
Calculadora Profesional de Gorras

## Version del manual
1.0

## Ultima actualizacion
2026-04-14

## Objetivo
Este manual explica como usar la aplicacion para cotizar, costear y revisar pedidos de gorras en talleres y fabricas de produccion.

La herramienta permite:
- Configurar materiales y sus costos.
- Definir referencias o combinaciones de color.
- Calcular costo unitario y total.
- Incluir mano de obra, indirectos, procesos y desperdicio.
- Estimar ganancia y margen.
- Exportar un resumen del pedido.

## Perfil de usuario
Este sistema esta pensado para:
- Personal comercial que cotiza pedidos.
- Encargados de produccion.
- Supervisores de planta.
- Personal administrativo que necesita validar costos.

## Pantalla principal
La aplicacion se divide en estas zonas:

### 1. Encabezado
En la parte superior encuentras:
- Boton `Modo oscuro`: cambia entre tema claro y oscuro.
- Boton `Reiniciar`: borra la configuracion guardada del pedido actual y vuelve a valores base.

### 2. Datos del pedido
Aqui se registran datos generales del cliente y del trabajo:
- `Cliente`
- `Orden de produccion`
- `Modelo de gorra`
- `Entrega estimada`

Estos datos aparecen luego en el resumen del pedido.

### 3. Configuracion de materiales y costos
Este bloque se abre y se cierra como acordeon.

Incluye:
- Tipo de gorra.
- Materiales configurables.
- Costos industriales.
- Procesos de produccion.

### 4. Cantidad total del pedido
Sirve para pedidos generales cuando no se desea separar por referencias o combinaciones de color.

### 5. Referencias y colores de partes
Permite crear varias referencias del mismo pedido.

Cada referencia tiene:
- Cantidad.
- Color de boton.
- Color de coco.
- Color de visera arriba.
- Color de visera abajo.
- Color de ojal.

### 6. Resultados
Cuando se presiona `Calcular pedido`, la app muestra:
- Resumen del pedido.
- Costo promedio.
- Ganancia unitaria.
- Margen estimado.
- Resultado por referencia.

## Flujo recomendado de uso

### Opcion 1. Pedido general
Usa esta opcion cuando todo el pedido tiene una sola configuracion general.

Pasos:
1. Ingresa los datos del pedido.
2. Configura materiales y costos.
3. Escribe la `Cantidad total de gorras`.
4. Presiona `Calcular pedido`.

### Opcion 2. Pedido por referencias
Usa esta opcion cuando el pedido tiene varias combinaciones de color.

Pasos:
1. Ingresa los datos del pedido.
2. Selecciona el modelo de gorra si aplica.
3. Crea una o varias referencias con `Agregar otra referencia`.
4. Define la cantidad de cada referencia.
5. Escribe los colores de las partes.
6. Presiona `Calcular pedido`.

Nota:
Si defines colores por referencia, el campo de cantidad general se bloquea para evitar duplicidad de cantidades.

## Modelos de gorra
La aplicacion incluye modelos base:
- Personalizado
- Trucker / malla
- 6 paneles clasica
- 5 paneles
- Visera plana
- Visera curva premium

Al seleccionar un modelo:
- Se ajusta el tipo de gorra cuando corresponde.
- Se cargan cantidades sugeridas para las piezas base.

Importante:
Los modelos sirven como punto de partida. Si en tu fabrica una referencia usa otro rendimiento o armado, debes ajustar los valores manualmente.

## Configuracion de materiales
Cada material tiene:
- Nombre.
- Precio.
- Cantidad por gorra.
- Estado activo o inactivo.

### Materiales base
Por defecto la app trae materiales comunes como:
- Tela o malla principal.
- Lino flex.
- Pimpon.
- Visera.
- Correa.
- Boton.
- Ojal.
- Marquilla.
- Bandera.
- Etiqueta.
- Sesgos.
- Tira.

### Agregar material personalizado
Usa `Agregar material personalizado` si tu proceso requiere insumos adicionales como:
- Entretela.
- Espuma.
- Forro especial.
- Caja individual.
- Sticker.

## Costos industriales
Estos campos ayudan a pasar de un calculo basico de materiales a un costeo mas real:
- `Precio de venta por gorra`
- `Mano de obra por gorra`
- `Indirectos por gorra`
- `Desperdicio (%)`
- `Margen objetivo (%)`

### Recomendacion
Si la fabrica ya tiene costos estandar por area, usa esos valores oficiales. No conviene que cada operario invente costos diferentes.

## Procesos de produccion
La app separa costos por proceso:
- Corte
- Bordado / estampado
- Armado / confeccion
- Empaque

Esto es util cuando:
- El bordado lo hace un tercero.
- El empaque cambia segun el cliente.
- El corte tiene costo distinto por modelo.

## Botones principales

### `Agregar otra referencia`
Crea un nuevo bloque de color y cantidad.

### `Calcular pedido`
Procesa toda la informacion y genera el resumen.

### `Exportar resumen CSV`
Descarga un archivo resumido del pedido para compartir o llevar a otra herramienta.

### `Modo oscuro`
Cambia el tema visual de la aplicacion y guarda la preferencia.

### `Reiniciar`
Borra la configuracion guardada del pedido actual.

## Interpretacion de resultados

### Resumen del pedido
Muestra:
- Total de gorras.
- Costo promedio unitario.
- Ganancia unitaria.
- Margen estimado.
- Inversion total.
- Ganancia total.

### Resultado por referencia
Cada bloque muestra:
- Cantidad de gorras de esa referencia.
- Materiales usados.
- Costo de materiales unitario.
- Costos de procesos.
- Costo final unitario.
- Precio sugerido por margen.
- Ganancia del lote.

## Alertas del sistema
La aplicacion puede mostrar mensajes como:
- Pedido calculado correctamente.
- Margen por debajo del objetivo.
- Cotizacion con perdida.
- Falta calcular antes de exportar.

Estas alertas ayudan a evitar errores comerciales.

## Buenas practicas de uso
- Revisa siempre que el precio de venta este actualizado.
- No mezcles referencias distintas dentro del mismo bloque de color.
- Ajusta el desperdicio si trabajas materiales delicados o estampados.
- Usa costos de procesos reales de planta.
- Reinicia la app si vas a iniciar un pedido completamente nuevo.

## Limitaciones actuales
Por ahora la app:
- No guarda una base historica de muchos pedidos.
- No genera PDF de orden de produccion.
- No tiene usuarios ni permisos.
- No integra inventario ni compras.
- No valida capacidades de planta o tiempos por operacion.

## Solucion de problemas

### El total no coincide con mi pedido
Revisa:
- Si usaste cantidad general o cantidades por referencia.
- Si alguna referencia quedo vacia.
- Si el modelo cargo cantidades base distintas a las que usa tu fabrica.

### El costo esta muy alto o muy bajo
Revisa:
- Precio de materiales.
- Costos de procesos.
- Mano de obra.
- Indirectos.
- Desperdicio.

### El resumen no exporta
Primero debes calcular el pedido. Luego usa el boton `Exportar resumen CSV`.

### Se perdio la informacion del pedido
Si presionaste `Reiniciar`, la app limpia los datos guardados del pedido actual.

## Mantenimiento del manual
Este documento debe actualizarse cada vez que cambie alguna de estas areas:
- Pantallas visibles al usuario.
- Botones o flujos principales.
- Logica de calculo que afecte el resultado mostrado.
- Nuevos modulos como PDF, inventario o historial.

## Historial de cambios del manual

### 2026-04-14
- Se crea el manual inicial.
- Se documentan datos del pedido, modelos, costos industriales, procesos, modo oscuro, reinicio y exportacion CSV.
