
# 🎓 SkillUp Campus

### Plataforma Web de Gestión de Cursos Educativos

**Proyecto:** Simulación Laboral — Talently Lab  
**Grupo:** O2603  
**Duración:** 8 semanas  
**Estado:** En desarrollo

---

## 📌 Descripción del Proyecto

**SkillUp Campus** es una plataforma web de tecnología educativa (EdTech) cuyo objetivo es centralizar y simplificar la gestión de cursos, usuarios e inscripciones.

El proyecto busca reemplazar procesos manuales basados en planillas, formularios y correos electrónicos por una solución digital que permita administrar cursos y mejorar la experiencia de aprendizaje de los estudiantes.

Se desarrollará un **Producto Mínimo Viable (MVP)** durante 8 semanas, priorizando la funcionalidad, la seguridad, la organización del código y la documentación.

---

## 🎯 Objetivos

- Centralizar la gestión de usuarios y cursos.
- Permitir el registro e inicio de sesión de estudiantes.
- Ofrecer un catálogo público de cursos.
- Facilitar la inscripción a cursos.
- Proporcionar un panel personal para los estudiantes.
- Permitir a los administradores gestionar usuarios y cursos.
- Desarrollar una aplicación web funcional y mantenible.

---

## 🚀 Funcionalidades del MVP

### 👨‍🎓 Estudiantes

- Registro de usuarios.
- Inicio de sesión.
- Exploración del catálogo de cursos.
- Visualización de información de cada curso.
- Inscripción a cursos disponibles.
- Acceso a un panel personal con sus cursos.

### 👨‍💼 Administradores

- Inicio de sesión con permisos de administrador.
- Gestión básica de usuarios.
- Creación de cursos.
- Edición de cursos existentes.
- Eliminación de cursos.
- Administración del catálogo.

### 🔐 Seguridad

- Autenticación mediante JWT.
- Protección de rutas privadas.
- Control de acceso según roles (Administrador y Alumno).
- Validación de datos de entrada.
- Almacenamiento seguro de contraseñas.

---

## 🛠️ Stack Tecnológico

| Área | Tecnología |
|------|------------|
| Frontend | React |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Control de versiones | Git + GitHub |
| Pruebas de API | Postman |
| Gestión del proyecto | Trello |
| Comunicación | Discord |

---

## 📁 Estructura del Repositorio

El proyecto utiliza un repositorio compartido que contiene el frontend y el backend.

```text
skillup-campus/
├── backend/
│   └── src/
│       └── .gitkeep
│
├── frontend/
│   └── src/
│       └── .gitkeep
│
└── README.md
```

### 📂 Backend

La carpeta `backend/` contiene la API REST desarrollada con Node.js y Express.

Será responsable de:

- Autenticación y autorización.
- Gestión de usuarios.
- Gestión de cursos.
- Inscripciones.
- Conexión con PostgreSQL.
- Validaciones y seguridad.
- Documentación de endpoints.

### 📂 Frontend

La carpeta `frontend/` contiene la aplicación web desarrollada con React.

Será responsable de:

- Página de inicio.
- Registro e inicio de sesión.
- Catálogo de cursos.
- Detalle de cursos.
- Panel del estudiante.
- Panel de administración.
- Integración con la API REST.

> La estructura interna de cada carpeta se ampliará durante el desarrollo.

---

## 💻 Cómo Clonar el Proyecto

Para trabajar en el proyecto, cada integrante deberá tener instalado:

- Git.
- Visual Studio Code (recomendado).
- Una cuenta de GitHub con acceso al repositorio.

### 1. Clonar el repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/skillup-campus-o2603/skillup-campus.git
```

### 2. Ingresar al proyecto

```bash
cd skillup-campus
```

### 3. Abrir en Visual Studio Code

```bash
code .
```

Una vez abierto el proyecto, cada integrante podrá trabajar en la carpeta correspondiente a su rol.

> La instalación de dependencias y la configuración del entorno se documentarán cuando estén implementadas.

---

## 🌿 Flujo de Trabajo con Git y GitHub

Para mantener organizado el desarrollo, utilizaremos ramas independientes para cada funcionalidad.

### 1. Actualizar la rama principal

Antes de comenzar una tarea:

```bash
git switch main
git pull origin main
```

### 2. Crear una rama nueva

Cada funcionalidad deberá desarrollarse en su propia rama.

Ejemplos:

```bash
git switch -c feature/autenticacion
```

```bash
git switch -c feature/registro-usuarios
```

Otros nombres posibles:

- `feature/gestion-cursos`
- `feature/inscripciones`
- `feature/frontend-dashboard`
- `fix/validacion-login`

### 3. Guardar los cambios

Después de modificar los archivos:

```bash
git add .
git commit -m "feat: agregar autenticacion de usuarios"
```

### 4. Subir la rama a GitHub

```bash
git push -u origin nombre-de-la-rama
```

Reemplazar `nombre-de-la-rama` por el nombre real de la rama.

### 5. Crear un Pull Request

Una vez subida la rama:

1. Ingresar al repositorio en GitHub.
2. Seleccionar la rama correspondiente.
3. Hacer clic en **Compare & pull request**.
4. Describir los cambios realizados.
5. Solicitar una revisión.
6. Integrar los cambios a `main` una vez aprobados.

### 📌 Convenciones de Commits

Utilizaremos mensajes descriptivos:

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de errores |
| `docs:` | Documentación |
| `chore:` | Configuración y mantenimiento |
| `refactor:` | Reorganización del código |
| `test:` | Pruebas |

Ejemplos:

```bash
git commit -m "feat: agregar registro de usuarios"
git commit -m "feat: implementar inscripcion a cursos"
git commit -m "docs: actualizar instrucciones del README"
```

---

## 🤝 Organización del Trabajo

El proyecto se desarrolla de manera colaborativa durante 8 semanas.

### Gestión de tareas

Utilizaremos **Trello** para organizar las actividades y dar seguimiento al progreso.

Las tareas se distribuirán mediante un tablero Kanban.

### Comunicación

La comunicación del equipo se realizará mediante **Discord**.

### Buenas prácticas

- Trabajar en ramas independientes.
- Mantener actualizada la rama de trabajo.
- Realizar commits claros y descriptivos.
- Evitar subir contraseñas, tokens o archivos `.env`.
- Documentar los cambios importantes.
- Comunicar bloqueos o dificultades al equipo.
- Revisar los cambios antes de integrarlos a `main`.

---

## 📅 Planificación General

| Semana | Actividades |
|--------|-------------|
| 1 | Análisis de requerimientos, definición tecnológica y organización del repositorio |
| 2 | Configuración inicial del proyecto, base de datos y contratos de API |
| 3 | Desarrollo de funcionalidades principales |
| 4 | Continuación del desarrollo e integración |
| 5 | Implementación y ajustes de funcionalidades |
| 6 | Integración de módulos y validaciones |
| 7 | Pruebas, corrección de errores y documentación |
| 8 | Despliegue, validación final y presentación del MVP |

> La planificación podrá ajustarse según las decisiones y el avance del equipo.

---

## 📦 Estado del Proyecto

**Etapa actual:** Preparación inicial.

El repositorio se encuentra en proceso de organización.

Las funcionalidades serán implementadas progresivamente durante las 8 semanas de desarrollo.

---

## 📄 Alcance del Proyecto

El MVP no contempla:

- Pasarelas de pago reales.
- Aplicaciones móviles.
- Streaming de video propio.
- Chats o foros entre usuarios.
- Emisión automática de certificados.
- Notificaciones automatizadas por correo electrónico.

El objetivo es entregar una plataforma web funcional, estable y documentada.

---

**SkillUp Campus — Grupo O2603**  
*Simulación Laboral | Talently Lab*