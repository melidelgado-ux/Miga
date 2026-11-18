# PRD — Flujo para recibir una receta

## 1. Resumen del producto

Miga es un recetario personal y colaborativo. Permite que la dueña del recetario pida una receta mediante un enlace y que otra persona la envíe sin tener que instalar ni usar Miga.

### Intención de producto

Permitir que alguien comparta una receta con la persona dueña del recetario, aunque no tenga la app.

## 2. Objetivo y métricas

### Objetivo principal

Completar el recorrido desde la creación del enlace hasta la recepción visible de una receta.

### Indicadores de éxito

- Enlaces de solicitud generados.
- Enlaces copiados correctamente.
- Recetas enviadas desde el formulario invitado.
- Recetas recibidas visibles en el recetario.

## 3. Usuarios y casos de uso

### Dueña del recetario

- Quiere pedir una receta a un familiar o amigo.
- Genera y comparte un enlace.
- Consulta la receta recibida desde su biblioteca.

### Persona invitada

- Recibe un enlace.
- Completa una receta sin crear una cuenta.
- Envía la receta a la dueña del recetario.

## 4. Flujo principal

1. La dueña abre Inicio y toca el botón “+”.
2. Selecciona “Pedir receta”.
3. Miga genera una invitación ligada a la cuenta de la dueña, válida por 30 días y para una receta.
4. La dueña copia el enlace y lo comparte.
5. La persona invitada abre el enlace y ve el formulario de receta.
6. Completa el nombre de la receta y su nombre; los demás datos son opcionales.
7. Toca “Enviar receta”.
8. Miga valida el enlace, los campos obligatorios y crea la receta como recibida mientras consume el enlace en la misma operación atómica.
9. Se muestra la confirmación “Receta enviada”.
10. La receta aparece en “Últimas recetas recibidas” y puede abrirse en detalle.

## 5. Pantallas y estados

### Inicio

- Acceso al botón “+”.
- Sección “Últimas recetas recibidas”.
- Acceso posterior a la receta enviada.

### Modal de opciones

- Opción “Crear receta propia”.
- Opción “Pedir receta”.

### Modal de enlace

- Muestra el enlace generado.
- Permite copiarlo.
- Muestra confirmación al copiar.
- Permite generar otro enlace.
- Informa que el enlace vence a los 30 días y solo acepta una receta.

### Formulario de invitado

Campos disponibles:

- Nombre de la receta: obligatorio.
- Nombre del autor: obligatorio.
- Descripción: opcional.
- Fotografía: opcional.
- Ingredientes: opcional.
- Pasos: opcional.
- Categoría: opcional.
- Tiempo de preparación: opcional.
- Porciones: opcional.
- Dificultad: opcional.
- Tip de Miga: opcional.

### Estados de validación

- Formulario incompleto: se informa qué campos faltan y no se envía.
- Formulario listo: se muestra que puede enviarse.
- Ingredientes y pasos pueden quedar vacíos; no se inventa contenido para completar el envío.

### Confirmación

- Muestra “Receta enviada”.
- Muestra el título de la receta.
- Confirma que quedó guardada para la persona solicitante.

### Detalle de receta

- Muestra la receta recibida.
- Identifica quién la envió.
- Permite revisar ingredientes y pasos.

## 6. Requisitos funcionales

- Generar un enlace de invitación desde “Pedir receta”.
- Permitir copiar el enlace y confirmar la acción.
- Detectar la ruta de invitación al abrir el enlace.
- Mostrar el formulario de invitado.
- Exigir título y nombre del autor.
- Conservar los datos opcionales cargados.
- Crear la receta con origen “received”.
- Conservar el nombre de la persona que la envió.
- Mostrar la receta en “Últimas recetas recibidas”.
- Abrir la receta en su pantalla de detalle.

## 7. Requisitos no funcionales

- Diseño responsive para móvil, tablet y escritorio.
- Botones y controles cómodos para tocar en móvil.
- Mensajes de error y confirmación claros.
- Uso de botones, inputs y etiquetas semánticas.
- Mantener la paleta, tipografía, formas redondeadas e ilustraciones definidas en `miga-design-system-design_d8a6008b.md`.

## 8. Datos y límites técnicos

- La receta recibida utiliza la estructura `Recipe` existente.
- La receta se marca con `origin: 'received'`.
- El nombre del invitado se guarda como autor y remitente.
- Las recetas, colecciones e invitaciones se guardan en Cloud Firestore bajo el UID de la dueña.
- Las invitaciones se consumen con una transacción que registra una receta recibida.
- Las fotos se comprimen en el navegador y se guardan como JPEG en el documento de Firestore, con límite de 200 KiB.
- Las reglas de Firestore deben restringir lecturas y escrituras de la biblioteca a su dueña y permitir únicamente el envío transaccional por invitación.

## 9. Criterios de aceptación

1. Desde Inicio, tocar “+” y luego “Pedir receta” muestra un enlace que puede copiarse y confirma “Enlace copiado”.
2. En el formulario de invitado, intentar enviar sin título o sin nombre muestra un error y no agrega ninguna receta.
3. Completar los campos obligatorios y enviar muestra “Receta enviada”.
4. Después del envío, la receta aparece en “Últimas recetas recibidas” de la cuenta propietaria.
5. Tocar la receta recibida abre correctamente su pantalla de detalle.

## 10. Riesgos y pendientes

- Las reglas desplegadas deben mantenerse alineadas con `firestore.rules`.
- El dominio público está autorizado en Firebase Authentication para que Google Sign-In funcione desde Vercel.
