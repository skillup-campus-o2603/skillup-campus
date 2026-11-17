# SkillUp Campus — Contratos de API

## 1. Información general

La API REST de SkillUp Campus está desarrollada con **Node.js y Express**, utilizando **Sequelize como ORM** y **PostgreSQL como base de datos**.

**URL base local:** `http://localhost:3001`

**Formato de intercambio:** JSON

Los endpoints de autenticación y gestión de cursos están implementados y conectados a PostgreSQL.

### Convenciones

- Los campos de las respuestas públicas utilizan `camelCase`.
- Los campos enviados para crear o actualizar cursos utilizan `snake_case`, de acuerdo con la estructura de la base de datos.
- Las respuestas exitosas incluyen `success`, `message` y, cuando corresponde, `data`.
- Los errores incluyen `success: false` y un mensaje descriptivo.
- Los identificadores de cursos, categorías y niveles son numéricos. Los identificadores de usuarios pueden serializarse como cadenas.
- Las fechas, cuando se devuelvan, utilizan formato ISO 8601.
- Los endpoints protegidos utilizan JWT mediante el encabezado `Authorization: Bearer <token>`.
- Los roles disponibles son `Administrator`, `Teacher` y `Student`.

---

## 2. Estado del servidor

### GET /health

Comprueba que el servidor Express está disponible.

**Autenticación:** No requerida.

**Respuesta — 200 OK**

```json
{
  "status": "ok"
}
```

---

## 3. Catálogo y gestión de cursos

Los cursos se almacenan en la tabla `courses` de PostgreSQL.

Cada curso pertenece a una categoría y tiene un nivel de dificultad. Las categorías y niveles deben existir previamente en sus respectivas tablas.

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

**Observaciones:**

- `category` contiene el identificador y nombre de la categoría.
- `level` representa el nivel de dificultad.
- `durationMinutes` expresa la duración en minutos.
- `imageUrl` puede ser `null`.
- `price` es numérico y puede ser `0` para cursos gratuitos.
- Los módulos y las lecciones se gestionarán posteriormente y no son obligatorios para crear un curso.

### GET /api/courses

Obtiene el listado público de cursos almacenados en PostgreSQL.

**Autenticación:** No requerida.

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
      "category": {
        "id": 1,
        "name": "Programación"
      },
      "level": "Principiante",
      "durationMinutes": 1500,
      "imageUrl": null,
      "price": 0
    }
  ]
}
```

Cuando no existen cursos, `data` es un arreglo vacío.

**Errores posibles:**

- `500 Internal Server Error`: error al consultar la base de datos.

### GET /api/courses/:id

Obtiene la información de un curso específico.

**Autenticación:** No requerida.

**Parámetro:** `id`, identificador numérico positivo del curso.

**Respuesta — 200 OK:** devuelve un objeto de curso en `data`.

**Respuesta — 400 Bad Request**

```json
{
  "success": false,
  "message": "ID de curso inválido"
}
```

**Respuesta — 404 Not Found**

```json
{
  "success": false,
  "message": "Curso no encontrado"
}
```

**Otros errores:** `500 Internal Server Error`.

### POST /api/courses

Permite crear un curso.

**Autenticación:** JWT obligatorio.

**Rol requerido:** `Administrator`.

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

**Campos obligatorios:**

- `title`: texto no vacío, máximo 150 caracteres.
- `description`: texto no vacío.
- `category_id`: entero positivo que identifique una categoría existente.
- `duration_minutes`: entero positivo.
- `level_id`: entero positivo que identifique un nivel existente.

**Campos opcionales:**

- `image_url`: URL HTTP/HTTPS o `null`.
- `price`: número mayor o igual a cero, con hasta dos decimales. Por defecto, `0`.

**Respuesta — 201 Created**

```json
{
  "success": true,
  "message": "Curso creado correctamente",
  "data": {
    "id": 1,
    "title": "Introducción a la Programación con Python",
    "description": "Aprendé los fundamentos de Python.",
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "level": "Principiante",
    "durationMinutes": 1200,
    "imageUrl": null,
    "price": 0
  }
}
```

**Errores posibles:**

- `400 Bad Request`: campos inválidos, categoría o nivel inexistente.
- `401 Unauthorized`: token ausente, inválido o expirado.
- `403 Forbidden`: usuario sin rol `Administrator`.
- `500 Internal Server Error`: error interno.

### PUT /api/courses/:id

Permite actualizar un curso existente.

**Autenticación:** JWT obligatorio.

**Rol requerido:** `Administrator`.

**Parámetro:** `id`, identificador del curso.

El endpoint permite actualizaciones parciales: solamente se modifican los campos enviados.

**Body — JSON de ejemplo**

```json
{
  "title": "Python desde Cero: Fundamentos de Programación",
  "duration_minutes": 1500,
  "price": 0
}
```

**Campos editables:**

`title`, `description`, `category_id`, `duration_minutes`, `image_url`, `price`, `level_id`.

Los campos no enviados conservan sus valores anteriores.

El backend valida los datos, verifica la existencia de categorías y niveles cuando se modifican y actualiza la columna `updated_at`.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Curso actualizado correctamente",
  "data": {
    "id": 1,
    "title": "Python desde Cero: Fundamentos de Programación",
    "description": "Aprendé los fundamentos de Python.",
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "level": "Principiante",
    "durationMinutes": 1500,
    "imageUrl": null,
    "price": 0
  }
}
```

**Errores posibles:**

- `400 Bad Request`: ID inválido, campos inválidos, JSON vacío o referencias inexistentes.
- `401 Unauthorized`: token ausente, inválido o expirado.
- `403 Forbidden`: permisos insuficientes.
- `404 Not Found`: curso inexistente.
- `500 Internal Server Error`: error interno.

### DELETE /api/courses/:id

Permite eliminar un curso existente.

**Autenticación:** JWT obligatorio.

**Rol requerido:** `Administrator`.

**Parámetro:** `id`, identificador del curso.

No requiere Body.

Antes de eliminar, el backend comprueba si existen registros asociados en:

- `enrollments`
- `modules`
- `course_teachers`
- `course_reviews`

Si existen relaciones, la eliminación se rechaza para proteger la integridad de los datos.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Curso eliminado correctamente"
}
```

**Respuesta — 409 Conflict**

```json
{
  "success": false,
  "message": "No se puede eliminar el curso porque tiene registros asociados"
}
```

**Otros errores posibles:**

- `400 Bad Request`: ID inválido.
- `401 Unauthorized`: token ausente, inválido o expirado.
- `403 Forbidden`: permisos insuficientes.
- `404 Not Found`: curso inexistente.
- `500 Internal Server Error`: error interno.

---

## 4. Autenticación y autorización

### POST /api/auth/register

Registra un nuevo usuario con rol `Student` y crea automáticamente su perfil de estudiante.

**Autenticación:** No requerida.

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

**Campos obligatorios:**

`name`, `surname`, `username`, `email`, `password`, `country`.

**Campos opcionales:**

`address`, `telephone`.

**Validaciones principales:**

- Correo electrónico con formato válido.
- Nombre de usuario con formato permitido.
- Contraseña de al menos ocho caracteres.
- Correo y nombre de usuario no duplicados.
- Validaciones de tipos, longitudes y campos requeridos.

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

**Errores posibles:**

- `400 Bad Request`: datos incompletos o inválidos.
- `409 Conflict`: correo o nombre de usuario duplicado.
- `500 Internal Server Error`: error interno.

**Seguridad:**

- La contraseña se almacena mediante bcrypt.
- El rol `Student` se asigna automáticamente.
- El usuario y su perfil se crean mediante una transacción.
- La contraseña no se incluye en la respuesta.

### POST /api/auth/login

Permite iniciar sesión con correo electrónico y contraseña.

**Autenticación:** No requerida.

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

**Errores posibles:**

- `400 Bad Request`: email o contraseña ausentes.
- `401 Unauthorized`: credenciales inválidas.
- `500 Internal Server Error`: error interno.

**Seguridad:**

- Las contraseñas se verifican mediante `bcrypt.compare()`.
- Los tokens JWT se firman con el algoritmo `HS256`.
- La clave de firma se configura mediante `JWT_SECRET`.
- Los tokens expiran después de 24 horas.
- El payload contiene `id` y `role`, además de los campos estándar de emisión y expiración.

### Middlewares de seguridad

**authMiddleware**

Verifica el encabezado `Authorization`, valida el JWT y agrega los datos del usuario autenticado a `req.user`.

**roleMiddleware**

Verifica que el usuario autenticado tenga un rol autorizado.

Para las operaciones administrativas de cursos se utiliza:

```javascript
authMiddleware,
roleMiddleware('Administrator')
```

**Códigos de seguridad:**

- `401 Unauthorized`: autenticación ausente o inválida.
- `403 Forbidden`: usuario autenticado sin permisos suficientes.

Los endpoints públicos de consulta de cursos no requieren JWT.

---

## 5. Integración con Frontend

El frontend de SkillUp Campus está desarrollado con **React y Vite**.

Los contratos de respuesta mantienen la estructura JSON definida inicialmente para facilitar la integración.

### Endpoints disponibles

| Método | Endpoint | Acceso |
|---|---|---|
| GET | `/health` | Público |
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/courses` | Público |
| GET | `/api/courses/:id` | Público |
| POST | `/api/courses` | Administrator |
| PUT | `/api/courses/:id` | Administrator |
| DELETE | `/api/courses/:id` | Administrator |

### Consideraciones de integración

- El frontend debe enviar las solicitudes a `http://localhost:3001`.
- Las peticiones con Body JSON deben utilizar `Content-Type: application/json`.
- Después del login, el frontend debe utilizar el JWT en las peticiones protegidas.
- Las rutas administrativas deben restringirse también en la interfaz, pero la autorización real se realiza en el backend.
- Las respuestas de cursos mantienen `category`, `level`, `durationMinutes`, `imageUrl` y `price`.
- Los formularios de creación y edición deben enviar `category_id`, `level_id`, `duration_minutes` e `image_url`.
- Los módulos, lecciones e inscripciones se implementarán en etapas posteriores.

---

## 6. Estado de implementación

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

### Pruebas realizadas

Las funcionalidades fueron verificadas utilizando Postman.

Se comprobaron:

- Registro de usuarios y validación de duplicados.
- Login con credenciales válidas e inválidas.
- Generación y expiración de JWT.
- Acceso permitido para administradores.
- Acceso denegado para estudiantes en rutas administrativas.
- Consulta de cursos desde PostgreSQL.
- Creación de cursos y validación de campos.
- Actualización de cursos.
- Eliminación de cursos y comprobación posterior mediante GET.

**Pendiente de verificación:** eliminación de cursos con registros asociados (`409 Conflict`), que podrá comprobarse cuando se implementen inscripciones o módulos.

### Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize
- bcryptjs
- jsonwebtoken
- dotenv
- Postman

### Próximas funcionalidades

- Gestión de inscripciones de alumnos.
- Consulta de inscripciones del usuario autenticado.
- Consulta administrativa de usuarios.
- Gestión posterior de módulos y lecciones, según el alcance del MVP.