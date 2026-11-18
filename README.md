# Miga

Miga es un recetario personal y colaborativo para guardar recetas propias, recibir recetas de familiares o amigos y organizarlas en colecciones.

La intención principal del producto es permitir que alguien comparta una receta con la persona dueña del recetario, aunque no tenga la app.

## Qué permite hacer

- Guardar recetas propias con nombre, descripción, foto, categoría, dificultad, tiempo, porciones, ingredientes, pasos y un tip.
- Editar recetas existentes.
- Consultar el detalle de una receta.
- Ajustar las cantidades de los ingredientes según el número de porciones.
- Marcar ingredientes como realizados durante la preparación.
- Buscar recetas por texto.
- Filtrar recetas por origen, fecha, categoría, colección, dificultad o destacadas.
- Ordenar recetas por fecha, tiempo de preparación o nombre.
- Crear colecciones temáticas y asignarles recetas.
- Pedir una receta mediante un enlace de invitación.
- Recibir recetas de personas que no tienen Miga.
- Ver el perfil con cantidades de recetas propias, recibidas y colecciones.

## Pantallas

### Inicio

La pantalla inicial muestra un saludo, el acceso para crear una receta, las últimas recetas propias y las últimas recetas recibidas.

### Recetas

Incluye el listado completo de recetas con buscador, filtros, ordenamiento y acceso al detalle de cada receta.

### Detalle de receta

Muestra la foto, descripción, autor, tiempo, dificultad, porciones, ingredientes, pasos y tip. Permite cambiar las porciones, marcar ingredientes y asignar la receta a una colección. Las recetas propias también se pueden editar.

### Crear o editar receta

Permite cargar los datos principales, subir una foto, elegir categoría y dificultad, ajustar tiempo y porciones, sumar o editar ingredientes y pasos, seleccionar una colección y guardar la receta.

El nombre de la receta es obligatorio.

### Colecciones

Muestra carpetas temáticas con colores pastel y cantidad de recetas. Se pueden crear nuevas colecciones y abrir cada una para consultar sus recetas.

### Formulario de invitado

Es la pantalla que abre una persona desde un enlace de invitación. Puede enviar una receta sin crear una cuenta ni instalar Miga.

El nombre de la receta y el nombre del autor son obligatorios. Descripción, foto, ingredientes, pasos, categoría, tiempo, porciones, dificultad y tip son opcionales.

### Confirmación de envío

Después de enviar una receta, se muestra una confirmación con el nombre de la receta y de la persona que la compartió.

### Inicio de sesión

La aplicación permite iniciar sesión con una cuenta de Google mediante Firebase Authentication. Las rutas de invitación siguen disponibles para personas invitadas sin cuenta. Las recetas y colecciones se sincronizan por cuenta mediante Cloud Firestore.

## Flujo principal: recibir una receta

1. Desde Inicio, la persona toca el botón “+”.
2. Selecciona “Pedir receta”.
3. Miga crea un enlace de un solo uso que vence en 30 días.
4. El enlace se copia y se comparte con otra persona.
5. La persona invitada abre `/invitacion/...` y completa el formulario.
6. Miga valida el nombre de la receta y el nombre del autor.
7. Al enviar, una operación atómica crea la receta con origen `received` y consume el enlace.
8. Se muestra “Receta enviada”.
9. La receta aparece en “Últimas recetas recibidas” y se puede abrir en detalle.

## Otros recorridos

### Crear una receta propia

Inicio o botón “+” → “Crear receta propia” → completar datos → sumar ingredientes y pasos → guardar → abrir el detalle.

### Organizar una receta

Recetas o Inicio → abrir receta → asignar una colección → consultar la receta desde Colecciones.

### Buscar una receta

Botón de búsqueda del encabezado → escribir una búsqueda → elegir una receta o colección → abrir el resultado.

## Datos y estado actual

La aplicación usa el tipo `Recipe` para representar recetas y `Collection` para representar colecciones.

Una receta incluye, entre otros datos:

- Identificador.
- Nombre y descripción.
- Tiempo de preparación.
- Porciones.
- Dificultad.
- Categoría.
- Autor.
- Foto opcional.
- Ingredientes.
- Pasos.
- Tip opcional.
- Origen: propia o recibida.
- Persona que la envió, cuando corresponde.
- Colección opcional.
- Fecha de creación.

Las recetas, colecciones e invitaciones viven en subcolecciones bajo `users/{uid}`. Las fotos se convierten a JPEG, se reducen a un máximo de 1280 px y se comprimen a 200 KiB como máximo antes de guardarse dentro del documento de Firestore.

## Límites actuales

- El proyecto Firebase `miga-3ad86` usa Cloud Firestore Standard en São Paulo (`southamerica-east1`).
- Google Sign-In está configurado en Firebase Authentication. El dominio de Vercel y localhost están configurados como destinos OAuth.
- Las reglas están en `firestore.rules` y ya fueron desplegadas en Firebase.
- Sin configuración de Firebase, el acceso a la biblioteca queda desactivado.
- Las invitaciones se guardan en Firestore y vencen a los 30 días; las rutas públicas permiten enviar una receta sin crear una cuenta. Solo se puede usar cada enlace una vez.
- La generación del enlace depende de la URL pública de la app.
- Los ingredientes y pasos vacíos se conservan vacíos; no se agregan textos de ejemplo.

## Diseño y experiencia

Miga sigue un diseño cálido, accesible y amigable:

- Colores pastel con naranja coral como acción principal y fucsia como acento secundario.
- Tarjetas y botones redondeados.
- Ilustraciones lineales de cocina.
- Acciones grandes para facilitar el uso en móvil.
- Diseño responsive para móvil, tablet y escritorio.
- Mensajes claros de error, advertencia y confirmación.
- Controles semánticos y estados de foco visibles.

La referencia visual completa está en [`public/assets/aistudio/miga-design-system-design_d8a6008b.md`](public/assets/aistudio/miga-design-system-design_d8a6008b.md).

## Estructura principal del proyecto

```text
src/
├── App.tsx                         Estado principal y navegación
├── main.tsx                        Punto de entrada de React
├── data/mockRecipes.ts             Tipos, recetas y colecciones iniciales
├── components/
│   ├── AllRecipesPage.tsx          Listado, búsqueda y filtros
│   ├── CreateRecipePage.tsx        Crear y editar recetas
│   ├── GuestInvitePage.tsx         Formulario para invitados
│   ├── RecipeDetailPage.tsx        Detalle y preparación
│   ├── AddChoiceModal.tsx          Crear receta o pedir receta
│   ├── AddItemSheet.tsx            Ingredientes y pasos
│   ├── CreateCollectionModal.tsx   Crear colecciones
│   ├── SpotlightSearchModal.tsx    Búsqueda rápida
│   ├── ProfileModal.tsx            Resumen del perfil
│   └── RecipesFilterModal.tsx      Filtros del listado
└── assets/images/                 Fotos de recetas de ejemplo
```

## Tecnologías

- React 19.
- TypeScript.
- Vite.
- Tailwind CSS mediante el plugin de Vite.
- Lucide React para iconos.
- Motion disponible para animaciones.
- Express y dotenv están incluidos en las dependencias del proyecto, aunque el flujo actual funciona sin backend.

## Ejecutar localmente

### Requisitos

- Node.js.
- npm.

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación queda disponible en el puerto `3000`.

### Configurar el acceso con Google

1. El proyecto `miga-3ad86` ya tiene una app web, Google Sign-In y Firestore Standard configurados.
2. `miga-six.vercel.app` y `localhost` están en los dominios autorizados de Firebase Authentication.
3. Copia `.env.example` a `.env.local` y completa las variables `VITE_FIREBASE_*` con la configuración de la app web.
4. Reinicia Vite después de cambiar las variables.

Sin esos valores, la biblioteca no se puede abrir. Las variables de configuración web de Firebase son valores de cliente; no agregues secretos de servidor a variables `VITE_`.

### Verificación de tipos

```bash
npm run lint
```

### Compilación de producción

```bash
npm run build
```

### Vista previa de producción

```bash
npm run preview
```

## Rutas y acceso de invitación

La aplicación detecta una invitación en `/invitacion/{ownerUid}/{inviteId}` y valida su estado y vencimiento en Firestore antes de mostrar el formulario.

Ejemplo:

```text
/invitacion/{ownerUid}/{inviteId}
```

El nombre de la persona solicitante se carga desde la invitación guardada por la dueña del recetario.

## Criterios de aceptación del flujo principal

1. Desde Inicio, tocar “+” y luego “Pedir receta” muestra un enlace que puede copiarse y confirma “Enlace copiado”.
2. En el formulario de invitado, intentar enviar sin título o sin nombre muestra un error y no agrega ninguna receta.
3. Completar los campos obligatorios y enviar muestra “Receta enviada”.
4. La receta enviada aparece en “Últimas recetas recibidas” de la cuenta propietaria.
5. Tocar la receta recibida abre correctamente su pantalla de detalle.

## Documento funcional

La especificación detallada del flujo está en [`PRD.md`](PRD.md).

## Referencia de AI Studio

Este proyecto se originó como una aplicación de AI Studio. La referencia original está disponible en:

https://ai.studio/apps/1a97d1e0-135d-4fbd-92f2-40c0493d1bdb
