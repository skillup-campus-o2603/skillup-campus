# Frontend — SkillUp Campus

Aplicación web de SkillUp Campus construida con **React, Vite y React Router**. El frontend consume los endpoints REST del backend Express y conserva la identidad visual del moodboard.

## Requisitos

- Node.js **22.22.0 o superior** (la versión requerida por `react-router` incluida en el lockfile).
- npm.
- Backend iniciado en `http://localhost:3001` y conectado a PostgreSQL.

## Instalación y desarrollo

Desde una terminal, ubicarse en esta carpeta (`frontend/`) y ejecutar:

```bash
npm install
npm run dev
```

Abrir la URL informada por Vite (por defecto, `http://localhost:5173`). Durante el desarrollo, Vite redirige automáticamente las solicitudes `/api` al backend en `http://localhost:3001`.

Si el backend está en otro origen, crear un archivo `.env` dentro de `frontend/` a partir de `.env.example` y definir `VITE_API_URL` con el origen, sin agregar `/api` al final. Reiniciar Vite después de cambiar variables de entorno.

## Compilación

```bash
npm run build
npm run preview
```

## Endpoints conectados

| Acción | Endpoint | Requiere JWT |
| --- | --- | --- |
| Iniciar sesión | `POST /api/auth/login` | No |
| Registrar estudiante | `POST /api/auth/register` | No |
| Listar cursos | `GET /api/courses` | No |
| Consultar curso | `GET /api/courses/:id` | No |
| Crear curso | `POST /api/courses` | Sí, rol `Administrator` |
| Editar curso | `PUT /api/courses/:id` | Sí, rol `Administrator` |
| Eliminar curso | `DELETE /api/courses/:id` | Sí, rol `Administrator` |

El login guarda el JWT y los datos básicos del usuario en `localStorage`, respetando la expiración de 24 horas devuelta por la API. Las operaciones de administración envían `Authorization: Bearer <token>`. El cierre de sesión elimina la sesión local; la API actual no expone un endpoint de logout.

El registro crea estudiantes mediante la API, pero no inicia sesión automáticamente porque la respuesta del endpoint de registro no devuelve JWT. Luego de registrarse, el usuario ingresa desde `/login`.

## Rutas principales

| Ruta | Pantalla / acceso |
| --- | --- |
| `/` | Home; los cursos destacados se consultan desde la API |
| `/login` | Inicio de sesión real |
| `/register` | Registro real de estudiantes |
| `/courses` | Catálogo público consultado desde la API |
| `/courses/:id` | Detalle público de curso |
| `/controlPanelAdmin` | Administración de cursos; requiere rol `Administrator` |
| `/createCourse` | Alta de curso; requiere rol `Administrator` |
| `/editCourse/:id` | Edición de curso; requiere rol `Administrator` |

Las demás rutas que figuran en `App.jsx` conservan sus pantallas iniciales o de desarrollo; no se conectaron porque el backend incluido no expone endpoints para esos módulos.

## Datos de categorías y niveles

La API de cursos devuelve la categoría (`category.id` y `category.name`) y el nombre del nivel (`level`), pero no devuelve el ID del nivel. El backend tampoco tiene endpoints para listar categorías y niveles por separado. Por eso, el formulario sugiere los IDs de categoría presentes en los cursos existentes y permite ingresar manualmente IDs que existan en las tablas `categories` y `levels`. Al editar, el campo de nivel es opcional: si se deja vacío, el `PUT` parcial conserva el nivel actual. No se inventan opciones ni identificadores.

## Sistema de diseño

Las variables globales de `src/styles/variables.css` siguen el moodboard de UX/UI:

- Azul primario: `#090E95`.
- Naranja de acento: `#EF6111`.
- Blanco como superficie principal.
- Secundarios: morado `#8832D9`, amarillo `#F7C331` y celeste `#CCFFFF`.
- Tipografía: Roboto.

## Organización

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── api/                 # Cliente HTTP y funciones de autenticación/cursos
    ├── components/
    │   ├── auth/             # Protección de rutas
    │   ├── courses/          # Formulario reutilizable de cursos
    │   └── layout/           # Navbar, Footer y layout compartido
    ├── context/              # Sesión y autenticación
    ├── pages/                # Páginas de la aplicación
    ├── styles/               # Variables y estilos globales
    ├── App.jsx               # Definición de rutas
    └── main.jsx              # Punto de entrada
```

## Alcance y pendientes conocidos

- La inscripción de estudiantes a cursos no está conectada: la API incluida no expone endpoints de inscripción.
- Los catálogos de categorías y niveles no se pueden consultar de forma independiente; el formulario trabaja con sus IDs y los que puede inferir del catálogo de cursos existente.
- Los testimonios no se muestran como opiniones reales hasta que exista una fuente de reseñas autorizadas.
- Los módulos de docentes, bolsa laboral, gestión de usuarios, perfil y recuperación de contraseña siguen pendientes de endpoints específicos.
- El JWT se almacena en `localStorage` porque el backend entrega el token al frontend; para producción conviene revisar con el equipo una estrategia de sesión y almacenamiento apropiada para el despliegue.

## Fotografías de la landing

Las imágenes de la landing y de los beneficios se cargan desde Pexels y requieren conexión a Internet. Los cursos del catálogo utilizan únicamente `imageUrl` provisto por la API; cuando el curso no tiene imagen, se muestra un recurso visual de respaldo sin inventar una fotografía del curso.
