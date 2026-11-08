const courses = [
  {
    id: 1,
    title: 'Inteligencia Artificial Aplicada: Crea Prompts y Automatizaciones reales',
    description: 'Dominá herramientas generativas de IA para automatizar tareas, redactar prompts avanzados y optimizar tus flujos de trabajo diarios sin necesidad de programar.',
    category: {
      id: 1,
      name: 'Inteligencia Artificial'
    },
    level: 'Principiante',
    durationMinutes: 1440,
    imageUrl: null,
    price: 0
  },
  {
    id: 2,
    title: 'Excel Práctico: Construcción de Dashboards y Análisis de Datos',
    description: 'Transformá datos complejos en dashboards e informes ejecutivos mediante tablas dinámicas, funciones avanzadas y automatización de procesos clave.',
    category: {
      id: 2,
      name: 'Análisis de Datos'
    },
    level: 'Intermedio',
    durationMinutes: 1440,
    imageUrl: null,
    price: 0
  },
  {
    id: 3,
    title: 'Desarrollo Web desde Cero: Construí tu Primer Sitio Web Interactivo',
    description: 'Construí sitios y aplicaciones web interactivas desde cero aprendiendo la estructura, el diseño y la lógica detrás del desarrollo de software moderno.',
    category: {
      id: 3,
      name: 'Desarrollo Web'
    },
    level: 'Principiante',
    durationMinutes: 1440,
    imageUrl: null,
    price: 0
  },
  {
    id: 4,
    title: 'Prototipado UX/UI: Diseñá y Testeá tu Primera App en Figma',
    description: 'Diseñá aplicaciones digitales atractivas y funcionales con Figma, desde la investigación de usuarios hasta la creación de prototipos interactivos.',
    category: {
      id: 4,
      name: 'Diseño UX/UI'
    },
    level: 'Principiante',
    durationMinutes: 1440,
    imageUrl: null,
    price: 0
  }
];

// GET /api/courses
const getCourses = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Cursos obtenidos correctamente',
    data: courses
  });
};

// GET /api/courses/:id
const getCourseById = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'ID de curso inválido'
    });
  }

  const course = courses.find((course) => course.id === id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Curso no encontrado'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Curso obtenido correctamente',
    data: course
  });
};

module.exports = {
  getCourses,
  getCourseById
};