import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { getCourses } from '../api/courses.js';

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

function formatCourseDuration(minutes) {
    const hours = Number(minutes) / 60;
    if (!Number.isFinite(hours) || hours <= 0) return 'Duración no definida';
    return hours < 1 ? `${minutes} min` : `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;
}

export default function Home() {
    const { pathname, hash, key } = useLocation();
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [coursesError, setCoursesError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        getCourses({ signal: controller.signal })
            .then((courses) => setFeaturedCourses(courses.slice(0, 4)))
            .catch((requestError) => {
                if (requestError.name !== 'AbortError') setCoursesError(requestError.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setCoursesLoading(false);
            });
        return () => controller.abort();
    }, []);

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
                            <Link className="button button-accent" to="/courses">
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
                        <Link className="button button-primary landing-course-cta" to="/courses">
                            Ver catálogo completo <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {coursesLoading && <p className="api-state-message" role="status">Cargando cursos…</p>}
                    {coursesError && <p className="landing-courses-message" role="alert">No pudimos cargar los cursos: {coursesError}</p>}
                    {!coursesLoading && !coursesError && featuredCourses.length === 0 && (
                        <div className="landing-courses-empty">
                            <h3>Próximamente vas a encontrar cursos acá.</h3>
                            <p>El catálogo todavía no tiene cursos publicados.</p>
                        </div>
                    )}
                    {!coursesLoading && !coursesError && featuredCourses.length > 0 && (
                        <div className="landing-course-grid">
                            {featuredCourses.map((course, index) => (
                                <Link className="landing-course-card" to={`/courses/${course.id}`} key={course.id}>
                                    <div className={`landing-course-image ${['course-ai', 'course-data', 'course-development', 'course-design'][index % 4]}`}>
                                        {course.imageUrl
                                            ? <img src={course.imageUrl} alt={`Imagen del curso ${course.title}`} loading="lazy" />
                                            : <span className="landing-course-image-fallback" aria-hidden="true">{course.title?.slice(0, 1)?.toUpperCase() || 'S'}</span>}

                                        <span className="landing-course-category">{course.category?.name || 'CURSO'}</span>
                                    </div>
                                    <div className="landing-course-copy">
                                        <div className="landing-course-meta">
                                            <span>{course.level || 'Nivel no definido'}</span>
                                            <span>{formatCourseDuration(course.durationMinutes)}</span>
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
                    )}
                </div>
            </section>

            <section className="landing-testimonials section-space" id="testimonios" aria-labelledby="testimonials-title">
                <div className="container">
                    <div className="landing-section-heading landing-section-heading-centered">
                        <span className="eyebrow">COMUNIDAD SKILLUP</span>
                        <h2 id="testimonials-title">Lo que dicen nuestros estudiantes</h2>
                        <p>Las experiencias de quienes aprenden pueden inspirar nuevos comienzos.</p>
                    </div>

                    <div className="landing-testimonials-empty">
                        <span className="landing-testimonials-icon" aria-hidden="true">✦</span>
                        <h3>Las experiencias reales de nuestra comunidad pronto van a estar acá.</h3>
                        <p>Cuando tengamos opiniones publicadas, las vas a poder conocer en esta sección.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
