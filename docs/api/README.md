# SkillUp Campus — Contratos de API

## 1. Información general

La API REST de SkillUp Campus está desarrollada con Node.js y Express.

**URL base local:** `http://localhost:3001`

**Formato de intercambio:** JSON

Los endpoints de cursos y autenticación se encuentran inicialmente definidos con respuestas simuladas (*mocks*). Su implementación real se realizará posteriormente utilizando Sequelize y PostgreSQL.

### Convenciones

- Los campos de las respuestas utilizan `camelCase`.
- Las respuestas exitosas incluyen `success`, `message` y `data`.
- Los errores incluyen `success: false` y un mensaje descriptivo.
- Los identificadores se representan mediante números.
- Las fechas, cuando correspondan, se devuelven en formato ISO 8601.
- Los endpoints protegidos utilizarán JWT.

---

## 2. Estado del servidor

### GET /health

**Autenticación:** No requerida.

**Respuesta — 200 OK**

```json
{
  "status": "ok"
}
```

Este endpoint permite comprobar que el servidor Express está disponible.

---

## 3. Catálogo de cursos

### GET /api/courses

Obtiene el listado público de cursos disponibles.

**Autenticación:** No requerida.

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Cursos obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "title": "Inteligencia Artificial Aplicada: Crea Prompts y Automatizaciones reales",
      "description": "Dominá herramientas generativas de IA para automatizar tareas, redactar prompts avanzados y optimizar tus flujos de trabajo diarios sin necesidad de programar.",
      "category": {
        "id": 1,
        "name": "Inteligencia Artificial"
      },
      "level": "Principiante",
      "durationMinutes": 1440,
      "imageUrl": null,
      "price": 0
    },
    {
      "id": 2,
      "title": "Excel Práctico: Construcción de Dashboards y Análisis de Datos",
      "description": "Transformá datos complejos en dashboards e informes ejecutivos mediante tablas dinámicas, funciones avanzadas y automatización de procesos clave.",
      "category": {
        "id": 2,
        "name": "Análisis de Datos"
      },
      "level": "Intermedio",
      "durationMinutes": 1440,
      "imageUrl": null,
      "price": 0
    },
    {
      "id": 3,
      "title": "Desarrollo Web desde Cero: Construí tu Primer Sitio Web Interactivo",
      "description": "Construí sitios y aplicaciones web interactivas desde cero aprendiendo la estructura, el diseño y la lógica detrás del desarrollo de software moderno.",
      "category": {
        "id": 3,
        "name": "Desarrollo Web"
      },
      "level": "Principiante",
      "durationMinutes": 1440,
      "imageUrl": null,
      "price": 0
    },
    {
      "id": 4,
      "title": "Prototipado UX/UI: Diseñá y Testeá tu Primera App en Figma",
      "description": "Diseñá aplicaciones digitales atractivas y funcionales con Figma, desde la investigación de usuarios hasta la creación de prototipos interactivos.",
      "category": {
        "id": 4,
        "name": "Diseño UX/UI"
      },
      "level": "Principiante",
      "durationMinutes": 1440,
      "imageUrl": null,
      "price": 0
    }
  ]
}
```

**Observaciones:**

- Los cursos presentados son datos simulados para el desarrollo del MVP.
- `level` admite los valores `Principiante`, `Intermedio` y `Avanzado`.
- `durationMinutes` representa la duración total del contenido en minutos.
- En los ejemplos, `1440` minutos equivalen a 24 horas de contenido.
- Frontend es responsable de convertir los minutos a horas para mostrarlos.
- `imageUrl` puede ser `null` cuando no exista una imagen asociada.
- `price` representa el precio del curso. En estos ejemplos, los cursos son gratuitos.
- `category` contiene el identificador y el nombre de la categoría.
---

### GET /api/courses/:id

Obtiene la información de un curso específico.

**Parámetro de ruta:** `id` — identificador numérico del curso.

**Autenticación:** No requerida.

**Ejemplo:** `GET /api/courses/1`

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Curso obtenido correctamente",
  "data": {
    "id": 1,
    "title": "Inteligencia Artificial Aplicada: Crea Prompts y Automatizaciones reales",
    "description": "Dominá herramientas generativas de IA para automatizar tareas, redactar prompts avanzados y optimizar tus flujos de trabajo diarios sin necesidad de programar.",
    "category": {
      "id": 1,
      "name": "Inteligencia Artificial"
    },
    "level": "Principiante",
    "durationMinutes": 1440,
    "imageUrl": null,
    "price": 0
  }
}
```

**Respuesta — 404 Not Found**

```json
{
  "success": false,
  "message": "Curso no encontrado"
}
```

---

## 4. Autenticación

### POST /api/auth/login

Permite que un usuario inicie sesión con su correo electrónico y contraseña.

**Autenticación:** No requerida.

**Body — JSON**

```json
{
  "email": "alumno@ejemplo.com",
  "password": "ClaveDeEjemplo123"
}
```

**Respuesta — 200 OK**

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Ana",
      "surname": "García",
      "email": "alumno@ejemplo.com",
      "role": "Student"
    },
    "token": "mock-jwt-token-no-valido",
    "expiresIn": "24h"
  }
}
```

**Respuesta — 400 Bad Request**

```json
{
  "success": false,
  "message": "Email y contraseña son obligatorios"
}
```

**Respuesta — 401 Unauthorized**

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

**Observaciones:**

- El token del mock es ficticio y no permite autenticarse realmente.
- En la implementación definitiva, las contraseñas se verificarán con bcryptjs.
- El backend generará un JWT válido cuando las credenciales sean correctas.
- El frontend deberá enviar el token en los endpoints protegidos mediante el encabezado `Authorization: Bearer <token>`.

---

## 5. Integración con Frontend

El frontend está desarrollado con React y Vite.

Para obtener los cursos, realizará una solicitud GET a:

`http://localhost:3001/api/courses`

Para iniciar sesión, enviará una solicitud POST a:

`http://localhost:3001/api/auth/login`

Durante la etapa de mocks, las respuestas contendrán información ficticia.

Posteriormente, los mismos endpoints consultarán PostgreSQL mediante Sequelize, manteniendo la estructura JSON acordada.

## 6. Estado de implementación

| Endpoint | Contrato | Estado |
|---|---|---|
| GET /health | Definido | Implementado |
| GET /api/courses | Definido | Mock funcional |
| GET /api/courses/:id | Definido | Mock funcional |
| POST /api/auth/login | Definido | Mock funcional |

Los estados se actualizarán a medida que se implementen y prueben los endpoints.