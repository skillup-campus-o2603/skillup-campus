import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';

const benefits = [
    {
        number: '01',
        title: 'Clases en vivo',
        description: 'Compartí el aprendizaje, resolvé dudas y conectá con docentes y compañeros.',
        image:
            'https://images.pexels.com/photos/6266990/pexels-photo-6266990.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Estudiante participando en una clase online desde su computadora',
        tone: 'benefit-blue',
    },
    {
        number: '02',
        title: 'Acompañamiento y mentorías',
        description: 'Encontrá orientación para avanzar con confianza y llevar tus ideas a la práctica.',
        image:
            'https://images.pexels.com/photos/37809798/pexels-photo-37809798.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Estudiante trabajando concentrada en una computadora dentro de un aula',
        tone: 'benefit-orange',
    },
    {
        number: '03',
        title: 'Certificá tus logros',
        description: 'Dale visibilidad a las habilidades que desarrollás en tu recorrido de aprendizaje.',
        image:
            'https://images.pexels.com/photos/7713379/pexels-photo-7713379.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Mano sosteniendo un diploma de graduación',
        tone: 'benefit-purple',
    },
];

// Estos cuatro cursos coinciden con los datos mock publicados por GET /api/courses.
const featuredCourses = [
    {
        category: 'INTELIGENCIA ARTIFICIAL',
        title: 'Inteligencia Artificial Aplicada',
        description: 'Creá prompts y automatizaciones para optimizar tus tareas cotidianas.',
        level: 'Principiante',
        duration: '24 h',
        image:
            'https://images.pexels.com/photos/3776180/pexels-photo-3776180.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Estudiante aprendiendo con una computadora portátil',
        tone: 'course-ai',
    },
    {
        category: 'ANÁLISIS DE DATOS',
        title: 'Excel Práctico',
        description: 'Construí dashboards e informes para transformar datos en decisiones.',
        level: 'Intermedio',
        duration: '24 h',
        image:
            'https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Pantalla de computadora mostrando un dashboard de análisis',
        tone: 'course-data',
    },
    {
        category: 'DESARROLLO WEB',
        title: 'Desarrollo Web desde Cero',
        description: 'Aprendé las bases para construir tu primer sitio web interactivo.',
        level: 'Principiante',
        duration: '24 h',
        image:
            'https://images.pexels.com/photos/36496927/pexels-photo-36496927.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Persona trabajando con código en una computadora',
        tone: 'course-development',
    },
    {
        category: 'DISEÑO UX/UI',
        title: 'Prototipado UX/UI',
        description: 'Diseñá y testeá tu primera aplicación con herramientas digitales.',
        level: 'Principiante',
        duration: '24 h',
        image:
            'https://images.pexels.com/photos/9414025/pexels-photo-9414025.jpeg?auto=compress&cs=tinysrgb&w=1000',
        imageAlt: 'Persona utilizando una tableta gráfica junto a una computadora portátil',
        tone: 'course-design',
    },
];

// Contenido de muestra para maquetar la sección: reemplazar por opiniones reales antes de publicar.
const testimonials = [
    {
        quote:
            'Me gustaría contar cómo SkillUp me ayudó a descubrir nuevas herramientas y avanzar en mis objetivos.',
        label: 'Texto de ejemplo · Estudiante',
    },
    {
        quote:
            'Este espacio va a mostrar experiencias reales de personas que forman parte de la comunidad.',
        label: 'Texto de ejemplo · Estudiante',
    },
    {
        quote:
            'Una opinión auténtica puede ayudar a otras personas a dar el primer paso en su aprendizaje.',
        label: 'Texto de ejemplo · Estudiante',
    },
];

export default function Home() {
    const { pathname, hash, key } = useLocation();

    // React Router actualiza el hash, pero no desplaza automáticamente la página.
    // Este efecto también cubre los enlaces que llegan desde otras rutas.
    useEffect(() => {
        if (pathname !== '/' || !hash) return;

        const sectionId = decodeURIComponent(hash.slice(1));
        const section = document.getElementById(sectionId);

        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [pathname, hash, key]);

    return (
        <div className="landing-page">
            <section className="landing-hero" aria-labelledby="landing-title">
                <div className="container landing-hero-grid">
                    <div className="landing-hero-copy">
                        <span className="landing-eyebrow">
                            <span className="landing-eyebrow-dot" aria-hidden="true" />
                            APRENDIZAJE PARA LO QUE VIENE
                        </span>
                        <h1 id="landing-title">
                            Aprendé sin límites.
                            <span>Impulsá tu futuro.</span>
                        </h1>
                        <p>
                            Explorá nuevas ideas, desarrollá habilidades y encontrá herramientas para
                            alcanzar tus objetivos. Tu próximo paso empieza acá.
                        </p>
                        <div className="landing-hero-actions">
                            <Link className="button button-accent" to="/catalog">
                                Explorar cursos <span aria-hidden="true">↗</span>
                            </Link>
                            <Link className="landing-secondary-link" to="/#beneficios">
                                Conocé SkillUp <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                        <div className="landing-hero-note">
                            <span aria-hidden="true">✓</span>
                            Un espacio para aprender, compartir y crecer.
                        </div>
                    </div>

                    <div className="landing-hero-visual">
                        <div className="landing-hero-photo-wrap">
                            <img
                                className="landing-hero-photo"
                                src="https://images.pexels.com/photos/7550308/pexels-photo-7550308.jpeg?auto=compress&cs=tinysrgb&w=1400"
                                alt="Tres jóvenes colaborando alrededor de una computadora portátil"
                                fetchPriority="high"
                            />
                            <div className="landing-hero-photo-caption">
                                <span>SKILLUP CAMPUS</span>
                                <strong>Aprender también es compartir.</strong>
                            </div>
                        </div>
                        <div className="landing-hero-floating-card" aria-hidden="true">
                            <span className="floating-card-icon">✦</span>
                            <span>
                                <strong>Tu próximo paso</strong>
                                <small>Empieza con una idea.</small>
                            </span>
                        </div>
                        <span className="landing-hero-orbit landing-orbit-one" aria-hidden="true" />
                        <span className="landing-hero-orbit landing-orbit-two" aria-hidden="true" />
                    </div>
                </div>
            </section>

            <section className="landing-benefits section-space" id="beneficios" aria-labelledby="benefits-title">
                <div className="container">
                    <div className="landing-section-heading landing-section-heading-centered">
                        <span className="eyebrow">SELECCIÓN DE BENEFICIOS</span>
                        <h2 id="benefits-title">Una experiencia pensada para crecer.</h2>
                        <p>
                            Más herramientas, acompañamiento y oportunidades para construir tu propio
                            camino de aprendizaje.
                        </p>
                    </div>

                    <div className="benefit-feature-grid">
                        {benefits.map((benefit) => (
                            <article className={`benefit-feature-card ${benefit.tone}`} key={benefit.number}>
                                <div className="benefit-feature-image">
                                    <img src={benefit.image} alt={benefit.imageAlt} loading="lazy" />
                                    <span className="benefit-feature-number">{benefit.number}</span>
                                </div>
                                <div className="benefit-feature-copy">
                                    <h3>{benefit.title}</h3>
                                    <p>{benefit.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-courses section-space" id="cursos" aria-labelledby="courses-title">
                <div className="container">
                    <div className="landing-section-heading landing-course-heading">
                        <div>
                            <span className="eyebrow">EMPEZÁ A EXPLORAR</span>
                            <h2 id="courses-title">Catálogo de cursos</h2>
                            <p>Conocé algunas de las propuestas disponibles y elegí por dónde empezar.</p>
                        </div>
                        <Link className="button button-primary landing-course-cta" to="/catalog">
                            Ver catálogo completo <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="landing-course-grid">
                        {featuredCourses.map((course) => (
                            <Link className="landing-course-card" to="/catalog" key={course.title}>
                                <div className={`landing-course-image ${course.tone}`}>
                                    <img src={course.image} alt={course.imageAlt} loading="lazy" />
                                    <span className="landing-course-category">{course.category}</span>
                                </div>
                                <div className="landing-course-copy">
                                    <div className="landing-course-meta">
                                        <span>{course.level}</span>
                                        <span>{course.duration} de contenido</span>
                                    </div>
                                    <h3>{course.title}</h3>
                                    <p>{course.description}</p>
                                    <span className="landing-course-link">
                                        Conocer curso <span aria-hidden="true">↗</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <p className="landing-course-note">
                        La oferta mostrada utiliza los cuatro cursos de ejemplo publicados actualmente
                        por la API del proyecto.
                    </p>
                </div>
            </section>

            <section className="landing-testimonials section-space" id="testimonios" aria-labelledby="testimonials-title">
                <div className="container">
                    <div className="landing-section-heading landing-section-heading-centered">
                        <span className="eyebrow">COMUNIDAD SKILLUP</span>
                        <h2 id="testimonials-title">Lo que dicen nuestros alumnos</h2>
                        <p>Las experiencias de quienes aprenden pueden inspirar nuevos comienzos.</p>
                    </div>

                    <div className="testimonial-grid">
                        {testimonials.map((testimonial, index) => (
                            <article className="testimonial-card" key={testimonial.label + index}>
                                <span className="testimonial-quote-mark" aria-hidden="true">“</span>
                                <blockquote>{testimonial.quote}</blockquote>
                                <div className="testimonial-author">
                                    <span className="testimonial-avatar" aria-hidden="true">S</span>
                                    <span>
                                        <strong>{testimonial.label}</strong>
                                        <small>Contenido ilustrativo</small>
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
