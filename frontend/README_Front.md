# Frontend — SkillUp Campus

Aplicación web de SkillUp Campus construida con **React, Vite y React Router**. El frontend consume los endpoints REST de Express y aplica los lineamientos de Marketing, Diseño Gráfico y UX/UI entregados en el material de las semanas 1 a 5.

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
| Inscribirse a un curso | `POST /api/enrollments` | Sí, rol `Student` |
| Consultar mis inscripciones | `GET /api/enrollments/me` | Sí, rol `Student` |
| Consultar dashboard del estudiante | `GET /api/dashboard` | Sí, rol `Student` |
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
| `/courses/:id` | Detalle público del curso; permite inscribirse a estudiantes autenticados |
| `/dashboard` | Panel del estudiante con inscripciones, métricas y progreso; requiere rol `Student` |
| `/controlPanelAdmin` | Administración de cursos; requiere rol `Administrator` |
| `/createCourse` | Alta de curso; requiere rol `Administrator` |
| `/editCourse/:id` | Edición de curso; requiere rol `Administrator` |

El Header/Navbar y el Footer se renderizan globalmente mediante `AppLayout`, por lo que aparecen en todas las vistas.

## Sistema de diseño y UX/UI

La implementación toma como referencia el UI Kit actualizado, el layout grid, los wireframes y el prototipo de alta fidelidad incluidos en `Semana 2/Diseño_UX-UI/Prototipo landing.png` y el documento de Marketing/Diseño más reciente:

- Grilla desktop de 12 columnas, 80 px de margen lateral a 1440 px y 20 px de gutter.
- Baseline grid y escala de espaciado en incrementos de 10 px.
- Roboto como tipografía principal.
- Escalas de tokens para Primary (azul), Secondary (naranja), Tertiary (violeta), Caution (amarillo), Info (cyan), Error (rojo), Success y Surface, definidas como variables CSS.
- Botones Primary y Secondary (rellenos y outline) con estados Default, Hover, Active, Disabled y Focus según el handoff actualizado.
- Header, anuncio superior, Landing, formularios de Login/Registro, tarjetas y Footer ajustados al prototipo.
- Todo el CSS activo está centralizado en `src/styles/skillup-styles.css`, importado desde `src/main.jsx`. Los otros CSS permanecen sin uso y no se deben importar en paralelo.

## Organización de recursos

Los archivos visuales importados por React viven en `src/assets/`:

```text
src/assets/
├── brand/          # Logotipos oficiales para fondos claros y oscuros
├── banners/        # SVG de marca/banner entregado por Diseño
├── certificates/   # PDF de certificado de referencia
├── courses/        # Recursos geométricos de las cuatro miniaturas de curso
├── landing/        # Ilustración SVG del hero
├── testimonials/  # Emblema, logotipo y piezas visuales del prototipo de reseñas
└── icons/
    ├── alerts/     # Íconos provisionales de éxito, error, advertencia e información
    └── navigation/ # SVG de Inicio, Mis cursos, Perfil y Certificados
```

Los recursos gráficos se copiaron desde las carpetas de Diseño Gráfico y UX/UI. Las miniaturas usan las formas originales junto con los datos que devuelve PostgreSQL; no se reemplazan los precios de la API por valores impresos en las láminas.

Los textos aprobados por Marketing se encuentran en `src/content/marketingCopy.js`. La plantilla de correo de bienvenida está en `src/content/welcome-email.md`; queda como material de contenido y **no se envía desde el frontend**, porque no hay integración de correo en los endpoints usados por esta tarea.

## Estados, mensajes y carga (Semana 4)

- Los formularios de Login y Registro usan validaciones de campos, email y longitud mínima de contraseña.
- Los errores de la API se traducen a los mensajes amigables de Marketing desde `src/utils/apiMessages.js`.
- Crear, editar y eliminar cursos muestran feedback de resultado y errores contextualizados.
- Los botones de envío se deshabilitan durante la solicitud y muestran `LoadingSpinner` para evitar envíos repetidos.
- Los íconos SVG de éxito, error, advertencia e información se importan desde `src/assets/icons/alerts/`. El GIF definitivo de carga continúa pendiente según el documento; mientras tanto se usa un spinner CSS accesible, que puede reemplazarse sin cambiar los formularios ni sus estados.



## Inscripciones y Dashboard (Semana 5)

- `src/api/enrollments.js` implementa `POST /api/enrollments` y `GET /api/enrollments/me`.
- `POST /api/enrollments` envía únicamente `{ course_id }`; el frontend nunca envía `user_id`, porque el backend lo obtiene del JWT.
- El detalle de curso permite inscribirse a usuarios con rol `Student`, verifica previamente si ya existe una inscripción y muestra estados de carga, éxito y error. Los visitantes pueden iniciar sesión y volver al detalle del curso; docentes y administradores reciben un aviso de que la inscripción es exclusiva para estudiantes.
- `src/api/dashboard.js` consume `GET /api/dashboard` para recuperar las métricas y el progreso académico.
- `/dashboard` usa `GET /api/enrollments/me` como fuente de las tarjetas de cursos y combina esos datos con el progreso devuelto por `GET /api/dashboard`.
- El Empty State del Dashboard se muestra cuando el estudiante todavía no tiene cursos inscriptos y ofrece un acceso al catálogo.
- Si el servidor responde `401` a una petición autenticada, `api/client.js` notifica a `AuthContext`, se elimina la sesión rechazada y `ProtectedRoute` redirige a Login. La sesión también se cierra al alcanzar la expiración almacenada.
- El Dashboard está protegido exclusivamente para `Student`, de acuerdo con los permisos del endpoint.
- Las respuestas de cursos, inscripciones y dashboard normalizan `level` para que el resto del frontend reciba texto y no intente renderizar objetos React.
- La carga se indica mediante `LoadingSpinner`; no se muestra una pantalla vacía mientras esperan las peticiones.

### Estados vacíos existentes

- Catálogo (`/courses`): ya contempla el caso en que `GET /api/courses` devuelve `data: []`.
- Administración (`/controlPanelAdmin`): ya contempla el caso en que no hay cursos publicados.
- Dashboard (`/dashboard`): implementa el Empty State de Semana 5 para `GET /api/enrollments/me` vacío.

## Límites respetados

- El diseño de testimonios queda preparado, pero no se inventan reseñas de alumnos: no hay endpoint de reseñas disponible para alimentar esa sección.
- No se inventan descuentos ni precios. Los precios visibles provienen de la API.
- El PDF de certificado se conserva como referencia visual; no se publica como certificado descargable de usuarios.
- La recuperación de contraseña muestra un estado informativo porque no hay endpoint de recuperación.
- Los íconos de navegación de estudiante quedan almacenados en `src/assets/icons/navigation/`; las vistas de Mis cursos y Certificados no se implementan como funcionalidades nuevas en esta entrega.
- No se modificó el backend.

## Landing y contenido visual

El hero usa la ilustración SVG local entregada por Diseño. Los beneficios usan íconos SVG dibujados en el componente porque el ZIP contiene la referencia visual, pero no archivos SVG individuales de esos tres íconos. Los cursos usan `imageUrl` de la API cuando existe; si no, se muestra el arte geométrico local entregado por Diseño o un fallback gráfico. El anuncio superior reproduce el texto promocional del prototipo; los precios y descuentos de las tarjetas no se inventan y los importes siguen viniendo de la API.