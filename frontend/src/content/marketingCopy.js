/**
 * Copy aprobado por Marketing para SkillUp Campus.
 * Los datos transaccionales de cursos (título, nivel, duración y precio)
 * siguen viniendo de la API; estos textos se aplican solo a cursos coincidentes.
 */
export const landingCopy = {
    announcement: '¡Inscripciones abiertas para el nuevo ciclo lectivo! Obtené un 20 % Off.',
    heroTitle: 'Tu futuro en tecnología empieza hoy.', 
    heroSubtitle:
        'Una plataforma adaptada a tus tiempos:\nCombinamos contenido grabado, clases en vivo y soporte 24/7 para llevar tus habilidades al siguiente nivel.',
    heroCta: 'Explorar cursos',
    benefitsTitle: 'Nuestros diferenciales',
    coursesTitle: 'Catálogo de cursos',
    testimonialsTitle: 'Reseña de nuestros alumnos',
    loginTitle: 'Tu próximo paso empieza acá.',
    loginSubtitle: 'Volvé a tu espacio de aprendizaje y seguí construyendo tu camino.',
    registerTitle: 'Tu próximo paso comienza con una cuenta. ',
    registerSubtitle: 'Sumate a la comunidad, descubrí nuevas habilidades y empezá a construir el camino que querés para tu futuro.',
};

export const benefitCopy = [
    {
        title: 'Clases en vivo interactivas',
        description:
            'Participá en sesiones en tiempo real con expertos de la industria. Preguntá y resolvé dudas al instante.',
        image:
            'https://images.pexels.com/photos/6266990/pexels-photo-6266990.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Estudiantes participando en una clase online',
        action: 'Ver horarios',
        tone: 'benefit-blue',
    },
    {
        title: 'Mentorías personalizadas',
        description:
            'Recibí seguimiento individual para acelerar tu crecimiento. Devoluciones detalladas de tus proyectos.',
        image:
            'https://images.pexels.com/photos/37809798/pexels-photo-37809798.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Estudiante trabajando con acompañamiento',
        action: 'Conocer mentorías',
        tone: 'benefit-orange',
    },
    {
        title: 'Certificación oficial',
        description:
            'Validá tus conocimientos con certificados reconocidos para destacar tu perfil profesional.',
        image:
            'https://images.pexels.com/photos/7713379/pexels-photo-7713379.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Certificado de finalización de estudios',
        action: 'Ver certificado',
        tone: 'benefit-purple',
    },
];

export const marketingCourseCopy = [
    {
        key: 'artificial-intelligence',
        title: 'Inteligencia Artificial Aplicada: Crea Prompts y Automatizaciones reales',
        match: (text) => text.includes('inteligencia artificial') || text.includes('automatizaciones'),
        level: 'Principiante / Intermedio',
        duration: '6 semanas',
        description:
            'Dominá herramientas generativas de IA para automatizar tareas, redactar prompts avanzados y optimizar tus flujos de trabajo diarios sin necesidad de programar.',
    },
    {
        key: 'excel',
        title: 'Excel Práctico: Construcción de Dashboards y Análisis de Datos',
        match: (text) => text.includes('excel'),
        level: 'Intermedio',
        duration: '6 semanas',
        description:
            'Transformá datos complejos en dashboards e informes ejecutivos mediante tablas dinámicas, funciones avanzadas y automatización de procesos clave.',
    },
    {
        key: 'web-development',
        title: 'Desarrollo Web desde Cero: Construí tu Primer Sitio Web Interactivo',
        match: (text) => text.includes('desarrollo web') || text.includes('sitio web'),
        level: 'Principiante',
        duration: '6 semanas',
        description:
            'Construí sitios y aplicaciones web interactivas desde cero aprendiendo la estructura, el diseño y la lógica detrás del desarrollo de software moderno.',
    },
    {
        key: 'ux-ui',
        title: 'Prototipado UX/UI: Diseñá y Testeá tu Primera App en Figma',
        match: (text) => text.includes('ux/ui') || text.includes('prototipado ux') || text.includes('experiencias digitales'),
        level: 'Principiante / Intermedio',
        duration: '6 semanas',
        description:
            'Diseñá aplicaciones digitales atractivas y funcionales con Figma, desde la investigación de usuarios hasta la creación de prototipos interactivos.',
    },
];

export function getMarketingCourseCopy(course) {
    const searchable = `${course?.title || ''} ${course?.category?.name || ''}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return marketingCourseCopy.find((item) => item.match(searchable)) || null;
}

export function getCourseTitle(course) {
    return getMarketingCourseCopy(course)?.title || course?.title || '';
}

export function getCourseDescription(course) {
    return getMarketingCourseCopy(course)?.description || course?.description || '';
}

export function getCourseLevelLabel(course) {
    return getMarketingCourseCopy(course)?.level || course?.level || 'Nivel no definido';
}

export function getCourseDurationLabel(course, fallbackFormatter) {
    return getMarketingCourseCopy(course)?.duration || fallbackFormatter?.(course?.durationMinutes) || 'Duración no definida';
}

export const welcomeEmail = {
    subject: '¡Bienvenido/a! Tu camino en tecnología comienza hoy 🚀',
    greeting: '¡Hola, [Nombre]!',
    paragraphs: [
        '¡Te damos la bienvenida! Nos alegra que hayas elegido nuestra plataforma para seguir aprendiendo y desarrollando nuevas habilidades.',
        'Ahora que ya tenés tu cuenta, estás a un paso de comenzar tu recorrido en el mundo de la tecnología.',
    ],
    steps: [
        'Explorá nuestro catálogo: descubrí los cursos disponibles y encontrá aquellos que se relacionen con tus intereses y objetivos.',
        'Elegí tu próximo desafío: revisá los contenidos, las modalidades y los niveles de cada curso para encontrar el que mejor se adapte a vos.',
        '¡Inscribite y comenzá a aprender!: avanzá a tu ritmo, con clases flexibles y recursos pensados para acompañarte.',
    ],
    closing: [
        '¿Tenés dudas durante el camino? Contás con asistencia automatizada y acompañamiento humano para ayudarte cuando lo necesites.',
        'Recordá: no necesitás saberlo todo para empezar, solo tener ganas de aprender.',
        '¡Tu futuro en tecnología empieza hoy!',
        '¡Nos vemos en el aula!',
        'El equipo de SkillUp',
    ],
};
