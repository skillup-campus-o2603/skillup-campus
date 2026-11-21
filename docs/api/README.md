# SkillUp Campus — Contratos de API

## 1. Información general

La API REST de **SkillUp Campus** está desarrollada con **Node.js y Express**, utiliza **Sequelize** para acceder a **PostgreSQL** y devuelve respuestas en formato JSON.

**URL base local:** `http://localhost:3001`

### Convenciones

- Las respuestas exitosas incluyen `success`, `message` y, cuando corresponde, `data`.
- Los errores incluyen `success: false` y un mensaje descriptivo.
- Los campos de entrada para cursos e inscripciones utilizan `snake_case` (por ejemplo, `course_id`, `category_id`).
- Los campos de salida compuestos utilizan `camelCase` (por ejemplo, `durationMinutes`, `enrolledAt`).
- Los identificadores de cursos, categorías y niveles son numéricos; los identificadores de usuarios pueden serializarse como cadenas.
- Las fechas devueltas por la API se expresan en formato ISO 8601.
- Los endpoints protegidos requieren `Authorization: Bearer <token>`.
- Los roles contemplados son `Administrator`, `Teacher` y `Student`.
- Las rutas públicas no requieren token JWT.

---

## 2. Estado del servidor

### GET /health

Comprueba que el servidor Express está disponible.

**Autenticación:** no requerida.

**Respuesta — 200 OK**

```json
{
  "status": "ok"
}
```

---

## 3. Catálogo y gestión de cursos

Los cursos se almacenan en la tabla `courses`. Cada curso pertenece a una categoría y tiene un nivel de dificultad. Las categorías y niveles deben existir previamente en sus respectivas tablas.

### Formato de respuesta de un curso

```json
{
  "id": 1,
  "title": "Python desde Cero: Fundamentos de Programación",
  "description": "Aprendé Python desde cero con ejercicios prácticos.",
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "level": "Principiante",
  "durationMinutes": 1500,
  "imageUrl": null,
  "price": 0
}
```

**Observaciones:** `category` incluye identificador y nombre; `level` es actualmente una cadena con el nombre del nivel; `durationMinutes` expresa minutos; `imageUrl` puede ser `null`; `price` es numérico y puede valer `0`. Los módulos y lecciones se gestionarán posteriormente.

### GET /api/courses

Obtiene el listado público de cursos almacenados en PostgreSQL.

**Autenticación:** no requerida.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Cursos obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "title": "Python desde Cero: Fundamentos de Programación",
      "description": "Aprendé Python desde cero con ejercicios prácticos.",
      "category": { "id": 1, "name": "Programación" },
      "level": "Principiante",
      "durationMinutes": 1500,
      "imageUrl": null,
      "price": 0
    }
  ]
}
```

Cuando no existen cursos, `data` es `[]`.

**Errores posibles:** `500 Internal Server Error`.

### GET /api/courses/:id

Obtiene un curso específico.

**Autenticación:** no requerida.

**Parámetro:** `id`, identificador numérico positivo del curso.

**Respuesta — 200 OK:** devuelve un objeto con el formato de curso descrito anteriormente en `data`.

**Errores posibles:**

- `400 Bad Request`: `ID de curso inválido`.
- `404 Not Found`: `Curso no encontrado`.
- `500 Internal Server Error`: error interno.

### POST /api/courses

Crea un curso.

**Autenticación:** JWT obligatorio. **Rol:** `Administrator`.

**Body — JSON**

```json
{
  "title": "Introducción a la Programación con Python",
  "description": "Aprendé los fundamentos de Python.",
  "category_id": 1,
  "duration_minutes": 1200,
  "image_url": null,
  "price": 0,
  "level_id": 1
}
```

**Campos obligatorios:** `title` (texto no vacío, máximo 150 caracteres), `description` (texto no vacío), `category_id` (entero positivo existente), `duration_minutes` (entero positivo), `level_id` (entero positivo existente).

**Campos opcionales:** `image_url` (URL HTTP/HTTPS o `null`) y `price` (número no negativo, hasta dos decimales; por defecto `0`).

**Respuesta — 201 Created**

```json
{
  "success": true,
  "message": "Curso creado correctamente",
  "data": {
    "id": 1,
    "title": "Introducción a la Programación con Python",
    "description": "Aprendé los fundamentos de Python.",
    "category": { "id": 1, "name": "Programación" },
    "level": "Principiante",
    "durationMinutes": 1200,
    "imageUrl": null,
    "price": 0
  }
}
```

**Errores posibles:** `400` (campos inválidos o referencias inexistentes), `401` (JWT ausente o inválido), `403` (rol no autorizado), `500` (error interno).

### PUT /api/courses/:id

Actualiza un curso existente. Permite enviar solo los campos que se desean modificar.

**Autenticación:** JWT obligatorio. **Rol:** `Administrator`.

**Parámetro:** `id`, identificador del curso.

**Body — JSON de ejemplo**

```json
{
  "title": "Python desde Cero: Fundamentos de Programación",
  "duration_minutes": 1500,
  "price": 0
}
```

**Campos editables:** `title`, `description`, `category_id`, `duration_minutes`, `image_url`, `price`, `level_id`.

Los campos omitidos conservan su valor. Se validan las referencias de categoría y nivel y se actualiza `updated_at`.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Curso actualizado correctamente",
  "data": {
    "id": 1,
    "title": "Python desde Cero: Fundamentos de Programación",
    "description": "Aprendé Python desde cero con ejercicios prácticos.",
    "category": { "id": 1, "name": "Programación" },
    "level": "Principiante",
    "durationMinutes": 1500,
    "imageUrl": null,
    "price": 0
  }
}
```

**Errores posibles:** `400` (datos inválidos o body vacío), `401`, `403`, `404` (curso inexistente), `500`.

### DELETE /api/courses/:id

Elimina un curso sin registros relacionados.

**Autenticación:** JWT obligatorio. **Rol:** `Administrator`.

**Parámetro:** `id`, identificador del curso. **Body:** no requerido.

Antes de eliminar, el backend verifica relaciones en `enrollments`, `modules`, `course_teachers` y `course_reviews`.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Curso eliminado correctamente"
}
```

**Respuesta — 409 Conflict**, cuando el curso tiene registros asociados:

```json
{
  "success": false,
  "message": "No se puede eliminar el curso porque tiene registros asociados"
}
```

**Otros errores posibles:** `400`, `401`, `403`, `404`, `500`.

---

## 4. Catálogos de categorías y niveles

Estos endpoints permiten cargar las opciones de los formularios de creación y edición de cursos sin depender de los cursos ya existentes. Ambos son públicos y consultan PostgreSQL.

### GET /api/categories

Devuelve todas las categorías disponibles, ordenadas alfabéticamente por nombre.

**Autenticación:** no requerida. **Body:** no requerido.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Categorías obtenidas correctamente",
  "data": [
    { "id": 4, "name": "Datos", "description": "Cursos de análisis de datos y bases de datos" },
    { "id": 2, "name": "Diseño", "description": "Cursos de diseño gráfico, UX y UI" },
    { "id": 3, "name": "Marketing", "description": "Cursos de marketing digital y estrategias comerciales" },
    { "id": 5, "name": "Negocios", "description": "Cursos de administración, emprendimiento y gestión" },
    { "id": 1, "name": "Programación", "description": "Cursos de desarrollo de software y programación" }
  ]
}
```

**Errores posibles:** `500 Internal Server Error`. Si no hay categorías, `data` es `[]`.

### GET /api/levels

Devuelve los niveles disponibles, ordenados por identificador.

**Autenticación:** no requerida. **Body:** no requerido.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Niveles obtenidos correctamente",
  "data": [
    { "id": 1, "name": "Principiante" },
    { "id": 2, "name": "Intermedio" },
    { "id": 3, "name": "Avanzado" }
  ]
}
```

**Errores posibles:** `500 Internal Server Error`. Si no hay niveles, `data` es `[]`.

---

## 5. Inscripciones de estudiantes

La tabla `enrollments` relaciona `user_id` con `course_id` y contiene una restricción única para evitar inscripciones repetidas al mismo curso. Los endpoints están protegidos con JWT y rol `Student`.

**Importante:** el identificador del estudiante se obtiene de `req.user.id`, después de verificar el JWT. El frontend **no debe enviar `user_id`**.

### POST /api/enrollments

Inscribirse en un curso existente.

**Autenticación:** JWT obligatorio. **Rol:** `Student`.

**Encabezados:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Body — JSON**

```json
{
  "course_id": 1
}
```

**Validaciones:** `course_id` debe ser un entero positivo, el curso debe existir y el usuario no debe tener una inscripción previa al mismo curso. La restricción única de PostgreSQL también protege ante solicitudes simultáneas.

**Respuesta — 201 Created**

```json
{
  "success": true,
  "message": "Inscripción realizada correctamente",
  "data": {
    "id": 1,
    "userId": 3,
    "courseId": 1,
    "createdAt": "2026-11-20T02:00:00.000Z"
  }
}
```

*Los IDs y la fecha del ejemplo son ilustrativos.*

**Errores posibles:**

| Código | Situación |
|---|---|
| `400 Bad Request` | `course_id` inválido. |
| `401 Unauthorized` | JWT ausente, inválido o expirado. |
| `403 Forbidden` | El usuario autenticado no tiene rol `Student`. |
| `404 Not Found` | El curso no existe. |
| `409 Conflict` | El estudiante ya está inscrito en el curso; también puede ocurrir ante conflictos de integridad referencial. |
| `500 Internal Server Error` | Error interno al registrar la inscripción. |

**Ejemplo de inscripción duplicada — 409 Conflict**

```json
{
  "success": false,
  "message": "Ya estás inscrito en este curso"
}
```

### GET /api/enrollments/me

Devuelve las inscripciones del estudiante autenticado junto con los datos de sus cursos.

**Autenticación:** JWT obligatorio. **Rol:** `Student`. **Body:** no requerido.

**Encabezado:** `Authorization: Bearer <token>`.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Inscripciones obtenidas correctamente",
  "data": [
    {
      "id": 1,
      "enrolledAt": "2026-11-20T02:00:00.000Z",
      "course": {
        "id": 1,
        "title": "Python desde Cero: Fundamentos de Programación",
        "description": "Aprendé Python desde cero con ejercicios prácticos.",
        "category": { "id": 1, "name": "Programación" },
        "level": { "id": 1, "name": "Principiante" },
        "durationMinutes": 1500,
        "imageUrl": null,
        "price": 0
      }
    }
  ]
}
```

*Los IDs y la fecha del ejemplo son ilustrativos. En esta respuesta, `course.level` es un objeto con `id` y `name`; en `GET /api/courses`, `level` es actualmente una cadena. Conviene unificar ambos formatos antes de integrar el frontend.*

Si el estudiante no tiene inscripciones, `data` es `[]`.

**Errores posibles:** `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`.

**Privacidad:** la consulta utiliza exclusivamente el identificador obtenido del JWT; no acepta un `user_id` arbitrario para consultar inscripciones de terceros.

---

## 6. Dashboard del estudiante

Permite obtener un resumen de la actividad académica del estudiante autenticado, incluyendo sus cursos inscriptos y el progreso de cada uno.

### GET /api/dashboard

Obtiene el dashboard del estudiante autenticado.

**Autenticación:** JWT obligatorio. **Rol:** `Student`. **Body:** no requerido.

**Encabezado:**

```http
Authorization: Bearer <token>
```

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Dashboard del estudiante obtenido correctamente",
  "data": {
    "summary": {
      "totalCourses": 2,
      "inProgressCourses": 0,
      "completedCourses": 0,
      "overallProgress": null
    },
    "courses": [
      {
        "enrollmentId": 2,
        "courseId": 4,
        "title": "Python desde Cero: Fundamentos de Programación",
        "description": "Aprendé Python desde cero con ejercicios prácticos, funciones y estructuras de datos.",
        "imageUrl": null,
        "durationMinutes": 2500,
        "price": 0,
        "enrolledAt": "2026-11-20T02:42:56.648Z",
        "category": {
          "id": 1,
          "name": "Programación"
        },
        "level": {
          "id": 1,
          "name": "Principiante"
        },
        "totalLessons": 0,
        "completedLessons": 0,
        "progress": null
      }
    ]
  }
}
```

**Descripción de los datos:**

- `summary.totalCourses`: cantidad total de cursos en los que está inscripto el estudiante.
- `summary.inProgressCourses`: cantidad de cursos con contenido cuyo progreso es menor al 100 %.
- `summary.completedCourses`: cantidad de cursos completados.
- `summary.overallProgress`: porcentaje general de avance.
- `courses`: listado de cursos inscriptos con sus datos y progreso individual.
- `totalLessons`: cantidad total de lecciones del curso.
- `completedLessons`: cantidad de lecciones completadas.
- `progress`: porcentaje de avance del curso.

**Importante:** cuando un curso todavía no tiene lecciones, su progreso devuelve `null`. Si ningún curso tiene lecciones, `overallProgress` también devuelve `null`.

Cuando el estudiante no tiene inscripciones, la API devuelve `200 OK`, con las estadísticas en cero, `overallProgress: null` y `courses: []`.

**Errores posibles:**

| Código | Situación |
|---|---|
| `401 Unauthorized` | JWT ausente, inválido o expirado. |
| `403 Forbidden` | El usuario autenticado no tiene rol `Student`. |
| `500 Internal Server Error` | Error interno al obtener los datos del dashboard. |

**Privacidad:** el identificador del estudiante se obtiene exclusivamente del JWT validado por el middleware. El frontend no debe enviar `user_id`.

---

## 7. Autenticación y autorización

### POST /api/auth/register

Registra un usuario con rol `Student` y crea su perfil de estudiante.

**Autenticación:** no requerida.

**Body — JSON**

```json
{
  "name": "Ana",
  "surname": "García",
  "username": "anagarcia",
  "email": "ana@ejemplo.com",
  "password": "ClaveSegura123",
  "country": "Argentina",
  "address": "Dirección opcional",
  "telephone": "3704000000"
}
```

**Obligatorios:** `name`, `surname`, `username`, `email`, `password`, `country`.

**Opcionales:** `address`, `telephone`.

**Validaciones principales:** correo válido, nombre de usuario con formato permitido, contraseña de al menos ocho caracteres, correo y usuario únicos, tipos y longitudes correctos.

**Respuesta — 201 Created**

```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "id": "1",
    "name": "Ana",
    "surname": "García",
    "username": "anagarcia",
    "email": "ana@ejemplo.com",
    "country": "Argentina",
    "role": "Student"
  }
}
```

**Errores posibles:** `400` (datos inválidos), `409` (correo o usuario duplicados), `500`.

**Seguridad:** contraseña almacenada con bcrypt; rol `Student` asignado automáticamente; usuario y perfil creados en una transacción; contraseña excluida de la respuesta.

### POST /api/auth/login

Permite iniciar sesión con correo electrónico y contraseña.

**Autenticación:** no requerida.

**Body — JSON**

```json
{
  "email": "ana@ejemplo.com",
  "password": "ClaveSegura123"
}
```

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "1",
      "name": "Ana",
      "surname": "García",
      "email": "ana@ejemplo.com",
      "role": "Student"
    },
    "token": "<JWT_GENERADO_POR_EL_SERVIDOR>",
    "expiresIn": "24h"
  }
}
```

**Errores posibles:** `400` (datos ausentes), `401` (credenciales inválidas), `500`.

**Seguridad:** `bcrypt.compare()` para contraseñas, JWT firmado con `HS256` mediante `JWT_SECRET`, vencimiento de 24 horas, payload con `id` y `role` más datos estándar del token.

### Middlewares de seguridad

- `authMiddleware`: valida el encabezado `Authorization`, verifica el JWT y establece `req.user = { id, role }`.
- `roleMiddleware`: verifica que el rol del usuario autenticado esté autorizado.

**Ejemplo de acceso administrativo:**

```javascript
authMiddleware,
roleMiddleware('Administrator')
```

**Ejemplo de acceso de estudiante:**

```javascript
authMiddleware,
roleMiddleware('Student')
```

**Códigos:** `401 Unauthorized` para autenticación ausente o inválida; `403 Forbidden` para rol no autorizado.

---

## 8. Integración con frontend

El frontend utiliza **React y Vite**. Durante el desarrollo local, las peticiones pueden dirigirse a `http://localhost:3001` o utilizar el proxy `/api` configurado en Vite.

### Endpoints disponibles

| Método | Endpoint | Acceso | Uso |
|---|---|---|---|
| GET | `/health` | Público | Estado del servidor |
| POST | `/api/auth/register` | Público | Registro de estudiantes |
| POST | `/api/auth/login` | Público | Inicio de sesión |
| GET | `/api/courses` | Público | Catálogo de cursos |
| GET | `/api/courses/:id` | Público | Detalle de curso |
| POST | `/api/courses` | Administrator | Crear curso |
| PUT | `/api/courses/:id` | Administrator | Editar curso |
| DELETE | `/api/courses/:id` | Administrator | Eliminar curso |
| GET | `/api/categories` | Público | Opciones de categorías |
| GET | `/api/levels` | Público | Opciones de niveles |
| POST | `/api/enrollments` | Student | Inscribirse en un curso |
| GET | `/api/enrollments/me` | Student | Consultar mis inscripciones |
| GET | `/api/dashboard` | Student | Dashboard del estudiante |

### Consideraciones de integración

- Para peticiones con JSON, enviar `Content-Type: application/json`.
- Tras el login, enviar el JWT en las rutas protegidas.
- Las rutas administrativas deben restringirse en la interfaz, pero la autorización efectiva se realiza en el backend.
- Los formularios de cursos deben consultar `/api/categories` y `/api/levels` y enviar los IDs seleccionados mediante `category_id` y `level_id`.
- El frontend envía únicamente `course_id` para inscribirse; el backend determina `user_id` desde el JWT.
- La vista «Mis cursos» puede consumir `GET /api/enrollments/me`.

---

## 9. Estado de implementación

| Endpoint | Estado |
|---|---|
| GET `/health` | Implementado |
| POST `/api/auth/register` | Implementado y probado |
| POST `/api/auth/login` | Implementado y probado |
| GET `/api/courses` | Implementado y probado |
| GET `/api/courses/:id` | Implementado y probado |
| POST `/api/courses` | Implementado y probado |
| PUT `/api/courses/:id` | Implementado y probado |
| DELETE `/api/courses/:id` | Implementado y probado |
| GET `/api/categories` | Implementado y probado |
| GET `/api/levels` | Implementado y probado |
| POST `/api/enrollments` | Implementado y probado |
| GET `/api/enrollments/me` | Implementado y probado |
| GET `/api/dashboard` | Implementado y probado |

### Pruebas realizadas con Postman

- Registro de usuarios y validación de duplicados.
- Login con credenciales válidas e inválidas.
- Generación y expiración de JWT.
- Acceso permitido para administradores y denegado para estudiantes en rutas administrativas.
- Consulta de cursos desde PostgreSQL.
- Creación, actualización y eliminación de cursos.
- Consulta de categorías (5 registros) y niveles (3 registros).
- Inscripción de estudiante a curso existente: `201 Created`.
- Inscripción repetida al mismo curso: `409 Conflict`.
- Curso inexistente: `404 Not Found`.
- Identificador de curso inválido: `400 Bad Request`.
- Inscripción sin JWT: `401 Unauthorized`.
- Inscripción con JWT de administrador: `403 Forbidden`.
- Consulta de inscripciones propias: `200 OK`.
- Consulta del dashboard con JWT válido de estudiante: `200 OK`.
- Consulta del dashboard de estudiante sin inscripciones: `200 OK`, lista vacía.
- Consulta del dashboard sin JWT: `401 Unauthorized`.
- Acceso al dashboard con JWT de Administrator: `403 Forbidden`.
- Acceso al dashboard con JWT de Teacher: `403 Forbidden`.

**Prueba adicional recomendada:** verificar `DELETE /api/courses/:id` sobre un curso que ya tenga inscripciones para confirmar `409 Conflict`. No se registra como probada hasta ejecutarla.

### Tecnologías utilizadas

Node.js, Express, PostgreSQL, Sequelize, bcryptjs, jsonwebtoken, dotenv y Postman.