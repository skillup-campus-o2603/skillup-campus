# Frontend — SkillUp Campus

Aplicación web de SkillUp Campus construida con **React, Vite y React Router**. El frontend consume los endpoints REST de Express y aplica los lineamientos de Marketing, Diseño Gráfico y UX/UI entregados en el material de las semanas 1 a 4.

## Requisitos

- Node.js **22.22.0 o superior** (según el campo `engines` del proyecto y las dependencias incluidas).
- npm.
- Backend iniciado en `http://localhost:3001` y conectado a PostgreSQL.

## Instalación y desarrollo

Desde una terminal, ubicarse en esta carpeta (`frontend/`) y ejecutar:

```bash
npm install
npm run dev
```

Abrir la URL informada por Vite (por defecto, `http://localhost:5173`). Durante el desarrollo, Vite redirige automáticamente las solicitudes `/api` al backend en `http://localhost:3001`.

## Compilación

```bash
npm run build
npm run preview
```

## Endpoints utilizados por estas vistas

| Acción | Endpoint | Requiere JWT |
| --- | --- | --- |
| Iniciar sesión | `POST /api/auth/login` | No |
| Registrar estudiante | `POST /api/auth/register` | No |
| Listar cursos | `GET /api/courses` | No |
| Consultar curso | `GET /api/courses/:id` | No |
| Listar categorías | `GET /api/categories` | No |
| Listar niveles | `GET /api/levels` | No |
| Crear curso | `POST /api/courses` | Sí, rol `Administrator` |
| Editar curso | `PUT /api/courses/:id` | Sí, rol `Administrator` |
| Eliminar curso | `DELETE /api/courses/:id` | Sí, rol `Administrator` |

El login guarda el JWT y los datos básicos del usuario en `localStorage`, respetando la expiración devuelta por la API. Las operaciones de administración envían `Authorization: Bearer <token>`. El registro crea estudiantes mediante la API, pero no inicia sesión automáticamente porque la respuesta no devuelve JWT.

## Rutas principales

| Ruta | Pantalla / acceso |
| --- | --- |
| `/` | Landing Page: copy de Marketing, beneficios y cursos destacados cargados desde la API |
| `/login` | Inicio de sesión con copy transaccional y mensajes amigables |
| `/register` | Registro de estudiantes con validaciones y mensajes amigables |
| `/lostPassword` | Información de estado; no hay endpoint de recuperación de contraseña |
| `/courses` | Catálogo público consultado desde la API |
| `/courses/:id` | Detalle público del curso |
| `/controlPanelAdmin` | Administración de cursos; requiere rol `Administrator` |
| `/createCourse` | Alta de curso; requiere rol `Administrator` |
| `/editCourse/:id` | Edición de curso; requiere rol `Administrator` |

El Header/Navbar y el Footer se renderizan globalmente mediante `AppLayout`, por lo que aparecen en todas las vistas.

## Sistema de diseño y UX/UI

La implementación toma como referencia el UI Kit, el layout grid, los wireframes y el prototipo de alta fidelidad incluidos en Semana 2:

- Grilla desktop de 12 columnas, 80 px de margen lateral a 1440 px y 20 px de gutter.
- Baseline grid y escala de espaciado en incrementos de 10 px.
- Roboto como tipografía principal.
- Escalas de tokens de 100 a 900 para Primary (azul), Secondary (naranja), Tertiary (violeta), Caution (amarillo), Info (cyan), Error (rojo), Success y Surface.
- Botones con estados hover, active, focus y disabled; inputs y tarjetas normalizados.
- Header y Footer responsive globales.

## Organización de recursos

Los archivos visuales importados por React viven en `src/assets/`:

```text
src/assets/
├── brand/          # Logotipos oficiales para fondos claros y oscuros
├── banners/        # SVG de marca/banner entregado por Diseño
├── certificates/   # PDF de certificado de referencia
├── courses/        # Recursos decorativos de las cuatro miniaturas de curso
└── icons/
    ├── alerts/     # Íconos provisionales de éxito, error, advertencia e información
    └── navigation/ # SVG de Inicio, Mis cursos, Perfil y Certificados
```

Los recursos gráficos originales se copiaron desde las carpetas de Diseño Gráfico de las semanas 1, 2 y 3. Las miniaturas usan las formas originales del diseño junto con los datos que devuelve PostgreSQL; no se usan los precios ni descuentos impresos en la lámina de muestra.

Los textos aprobados por Marketing se encuentran en `src/content/marketingCopy.js`. La plantilla de correo de bienvenida está en `src/content/welcome-email.md`; queda como material de contenido y **no se envía desde el frontend**, porque no hay integración de correo en los endpoints usados por esta tarea.

## Estados, mensajes y carga (Semana 4)

- Los formularios de Login y Registro usan validaciones de campos, email y longitud mínima de contraseña.
- Los errores de la API se traducen a los mensajes amigables de Marketing desde `src/utils/apiMessages.js`.
- Crear, editar y eliminar cursos muestran feedback de resultado y errores contextualizados.
- Los botones de envío se deshabilitan durante la solicitud y muestran `LoadingSpinner` para evitar envíos repetidos.
- Los íconos SVG reales de alertas y el GIF final de carga todavía no estaban disponibles en el ZIP de entrega (en el documento figuran como recursos en desarrollo). En su lugar se usan SVG provisionales y un spinner CSS accesible; pueden reemplazarse sin cambiar los componentes.

## Límites respetados

- El diseño de testimonios queda preparado, pero no se inventan reseñas de alumnos: no hay endpoint de reseñas disponible para alimentar esa sección.
- No se inventan descuentos ni precios. Los precios visibles provienen de la API.
- El PDF de certificado se conserva como referencia visual; no se publica como certificado descargable de usuarios.
- La recuperación de contraseña muestra un estado informativo porque no hay endpoint de recuperación.
- Los íconos de navegación de estudiante quedan almacenados en `src/assets/icons/navigation/`; las vistas de Mis cursos y Certificados no se implementan como funcionalidades nuevas en esta entrega.
- No se modificó el backend.

## Fotografías de la landing

Las fotografías del hero y de beneficios se cargan desde Pexels y requieren conexión a Internet. Los cursos usan `imageUrl` de la API cuando existe; si no, se muestra el arte local entregado por Diseño o un fallback gráfico, sin presentar imágenes ficticias como material real del curso.
