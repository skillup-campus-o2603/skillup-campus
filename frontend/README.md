# Frontend — SkillUp Campus

Aplicación web de SkillUp Campus construida con **React, Vite y React Router**. Esta carpeta contiene la base del frontend preparada durante la Semana 2.

## Requisitos

- Node.js 22.12 o superior.
- npm.

## Instalación

Desde una terminal, ubicarse en esta carpeta (`frontend/`) y ejecutar:

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir la URL informada por Vite (por defecto, `http://localhost:5173`).

## Compilación

```bash
npm run build
```

Para probar la compilación localmente:

```bash
npm run preview
```

## Rutas iniciales

| Ruta | Pantalla |
| --- | --- |
| `/` | Home |
| `/login` | Inicio de sesión |
| `/catalog` | Catálogo de cursos (datos de muestra) |
| `/admin` | Panel de administración (estructura inicial) |

Cualquier ruta no contemplada muestra una pantalla 404.

## Organización

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── components/
    │   └── layout/       # Navbar, Footer y layout compartido
    ├── pages/            # Home, Login, Catalog, Admin y NotFound
    ├── styles/           # Variables de marca y estilos globales
    ├── App.jsx            # Definición de rutas
    └── main.jsx           # Punto de entrada de React
```

## Sistema de diseño

Las variables globales de `src/styles/variables.css` siguen el moodboard de UX/UI:

- Azul primario: `#090E95`.
- Naranja de acento: `#EF6111`.
- Blanco como superficie principal.
- Secundarios: morado `#8832D9`, amarillo `#F7C331` y celeste `#CCFFFF`.
- Tipografía: Roboto.

Los componentes y las páginas consumen estos tokens CSS para mantener la identidad visual centralizada.

## Alcance de esta etapa

- El formulario de login es demostrativo: no autentica ni envía credenciales.
- El catálogo usa cursos de ejemplo: todavía no consulta la API.
- El panel de administración tiene su ruta y una estructura inicial; no ejecuta operaciones CRUD.
- La ruta `/admin` todavía no tiene protección por roles. Cuando se implemente la autenticación, debe verificarse el JWT y el rol de administrador desde el backend; ocultar un enlace en el frontend no es una medida de seguridad.
- El frontend todavía no necesita modificar ni iniciar el backend para mostrar estas pantallas.
