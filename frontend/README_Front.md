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

## Todas las rutas de skillUp

| Ruta | Pantalla |
| --- | --- |
|  |
---Auth and Identity---
|  |
| `/` | Home |
| `/login` | Inicio de sesión (vista demostrativa) |
| `/register` | Registrar estudiantes (vista demostrativa) |
| `/lostPassword` | Recuperar contraseña mediante envío de enlace a email |
| `/profile` | Ver y editar datos personales, avatar, etc. Aplica para todos los roles |
| `/notFound` | Mostrar error al no encontrar una página. También podría indicar falta de permisos |
|  |
---Student---
|  |
| `/dashboard` | Panel principal del estudiante al loguearse. Aquí puede ver sus cursos, avance, entre otra información |
| `/courses` | Listado de cursos (datos de muestra) disponibles y ya adquiridos por el estudiantes |
| `/detailsCourse` | Mostrar temario, video introductorio, precio y valoraciones |
| `/jobBoard` | Bolsa de trabajo con listado de ofertas de empresas para estudiantes con una calificación mínima de 9 |
| `/detailsJob` | Vista detallada de una oferta de empleo con requerimientos de la vacante y botón para postularse |
|  |
---Teachers---
|  |
| `/controlPanel` | Panel de control del profesor para ver sus ingresos, estadísticas de estudiantes y listado de cursos asignados |
|  |
---Global administration---
|  |
| `/controlPanelAdmin` | Panel de control para administradores. Controla todo: estudiantes, profesores, cursos, otros administradores, etc. |
|  |
--- Courses management---
|  |
| `/createCourse` | Crear un curso con todos sus datos |
| `/editCourse` | Actualizar o reestructurar contenidos de un curso existente |
|  |
--- Teachers management---
|  |
| `/teachers` | Listado general de todos los profesores |
| `/createTeacher` | Dar de alta a un nuevo profesor (datos personales, especialidad, biografía) |
| `/editTeacher` | Modificar la información del perfil o los permisos del profesor |
|  |
--- Students management---
|  |
| `/students` | Listado maestro de estudiantes registrados con información de contacto e histórico de compras |
|  |
--- Administrators management---
|  |
| `/admins` | Listado de los usuarios con rol de administrador del sistema |
| `/createAdmin` | Alta para nuevos perfiles con privilegios administrativos totales. |
| `/editAdmin` | Cambiar credenciales, correo de soporte o nivel de acceso del administrador |
---
NOTA:

Cualquier ruta no contemplada muestra una pantalla de error (404, notFound).

## Organización

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── components/
    │   └── layout/       # Navbar, Footer y Layout compartido
    ├── pages/            # Home, Login, Register, LostPassword, Profile, NotFound, Dashboard, Courses, DetailsCourse, JobBoard, DetailsJob, ControlPanel,
                            ControlPanelAdmin, CreateCourse, EditCourse, Teachers, CreateTeacher, EditTeacher, Students, Admins, CreateAdmin y EditAdmin
    ├── styles/           # Variables de marca y estilos globales
    ├── App.jsx           # Definición de rutas
    └── main.jsx          # Punto de entrada de React
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

- Los formularios de login y registro son demostrativos: no autentican, no crean usuarios ni envían datos a la API.
- El formulario de registro aplica validaciones HTML básicas, regex y una comprobación de coincidencia de contraseñas. Sus campos requeridos siguen el esquema actual de la tabla `users` (nombre, apellido, email, nombre de usuario, contraseña, país, dirección y teléfono); el rol de estudiante deberá asignarlo el backend.
- El catálogo usa cursos de ejemplo: todavía no consulta la API.
- El panel de administración tiene su ruta y una estructura inicial; no ejecuta operaciones CRUD.
- La ruta `/admins` todavía no tiene protección por roles. Cuando se implemente la autenticación, debe verificarse el JWT y el rol de administrador desde el backend; ocultar un enlace en el frontend no es una medida de seguridad.
- El frontend todavía no necesita modificar ni iniciar el backend para mostrar estas pantallas.

## Landing actualizada según wireframes

La página de inicio incluye franja informativa, hero con fotografía, beneficios visuales, cursos destacados, testimonios de muestra y footer extendido. Las imágenes fotográficas se cargan desde Pexels; por eso requieren conexión a Internet.

### Créditos de fotografía

Las fotografías utilizadas pertenecen a sus autores en Pexels y se encuentran publicadas con licencia gratuita de Pexels:

- MART PRODUCTION — [Trabajo colaborativo](https://www.pexels.com/photo/colleagues-brainstorming-a-business-project-at-a-meeting-7550308/).
- Antoni Shkraba — [Clase online](https://www.pexels.com/photo/person-teaching-girl-on-laptop-screen-6266990/).
- Jessica Olivella — [Estudiante en el aula](https://www.pexels.com/photo/focused-woman-working-on-a-laptop-in-classroom-37809798/).
- RDNE Stock project — [Diploma](https://www.pexels.com/photo/a-newly-graduate-holding-his-diploma-7713379/).
- Andrea Piacquadio — [Estudiante con laptop](https://www.pexels.com/photo/woman-using-a-laptop-3776180/).
- Atlantic Ambience — [Dashboard de datos](https://www.pexels.com/photo/close-up-shot-of-a-laptop-computer-12969403/).
- Jakub Zerdzicki — [Programación](https://www.pexels.com/photo/close-up-of-programmer-typing-code-on-laptop-36496927/).
- Sasha Kim — [Diseño digital](https://www.pexels.com/photo/person-using-a-laptop-and-a-drawing-tablet-9414025/).

Las tarjetas de beneficios y los testimonios siguen el wireframe y contienen texto de presentación. Antes de publicar la plataforma, el equipo debe confirmar la disponibilidad real de clases en vivo, mentorías y certificaciones, y reemplazar los testimonios ilustrativos por opiniones autorizadas.