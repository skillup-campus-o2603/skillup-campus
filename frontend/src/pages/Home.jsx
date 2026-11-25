import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { getCourses } from '../api/courses.js';
import CourseThumbnail from '../components/courses/CourseThumbnail.jsx';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import { benefitCopy, getCourseDescription, getCourseDurationLabel, getCourseLevelLabel, getCourseTitle, landingCopy } from '../content/marketingCopy.js';
import { getFriendlyApiMessage } from '../utils/apiMessages.js';

import circularEmblem from '../assets/testimonials/circular-emblem.svg';
import studentLucas from '../assets/testimonials/student-lucas.svg';
import studentMartin from '../assets/testimonials/student-martin.svg';
import studentKyoco from '../assets/testimonials/student-kyoco.svg';
import studentCarlos from '../assets/testimonials/student-carlos.svg';
import cardLogo from '../assets/testimonials/card-logo.svg';
import studentValeria from '../assets/testimonials/student-valeria.svg';

const TESTIMONIALS = [
    {
        id: 'lucas',
        name: 'Lucas Benítez',
        course: 'Egresado de Inteligencia Artificial Aplicada',
        image: studentLucas,
        quote: 'Aplicar herramientas de inteligencia artificial generativa en mis tareas diarias transformó mi forma de trabajar y multiplicó mi productividad. Las clases prácticas y los proyectos basados en situaciones reales me brindaron conocimientos y habilidades alineados con las demandas del mercado actual.'
    },
    {
        id: 'martin',
        name: 'Martín Souta',
        course: 'Prototipado UX/UI',
        image: studentMartin,
        quote: 'Cursar Prototipado UX/UI me permitió estructurar un mindset verdaderamente centrado en el usuario. Profundizamos en metodologías de investigación cualitativa, arquitectura de información y la construcción de sistemas de diseño escalables.'
    },
    {
        id: 'kyoco',
        name: 'Kyoco Lin',
        course: 'Desarrollo Web',
        image: studentKyoco,
        quote: 'Construir proyectos interactivos desde las bases me permitió dominar HTML, CSS y JavaScript con total soltura. ¡Una formación súper práctica y enfocada en lo que pide la industria para crear sitios funcionales!'
    },
    {
        id: 'carlos',
        name: 'Carlos Wolf',
        course: 'Desarrollo Web desde Cero',
        image: studentCarlos,
        quote: 'Construir proyectos interactivos desde las bases me permitió dominar HTML, CSS y JavaScript con total soltura. ¡Una formación súper práctica y enfocada en lo que pide la industria para crear sitios funcionales!'
    },
    // Este ítem representa el logo central de la segunda fila en desktop
    {
        id: 'brand-mark',
        isBrandLogo: true
    },
    {
        id: 'valeria',
        name: 'Valeria García',
        course: 'Excel (Aplicado a Negocios / Datos)',
        image: studentValeria,
        quote: 'Dominar desde fórmulas avanzadas y tablas dinámicas hasta macros y automatización cambió por completo mi forma de analizar información. ¡Herramientas clave y súper aplicables al mundo laboral diario!'
    }
];

function formatCourseDuration(minutes) {
    const hours = Number(minutes) / 60;
    if (!Number.isFinite(hours) || hours <= 0) return 'Duración no definida';
    return hours < 1 ? `${minutes} min` : `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;
}

function formatPrice(price) {
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount === 0) return 'Gratuito';
    return `$ ${amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Home() {
    const { pathname, hash, key } = useLocation();
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [coursesError, setCoursesError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        getCourses({ signal: controller.signal })
            .then((courses) => setFeaturedCourses(courses.slice(0, 6)))
            .catch((requestError) => {
                if (requestError.name !== 'AbortError') setCoursesError(getFriendlyApiMessage(requestError, 'courseList'));
            })
            .finally(() => {
                if (!controller.signal.aborted) setCoursesLoading(false);
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (pathname !== '/' || !hash) return;

        const sectionId = decodeURIComponent(hash.slice(1));
        const section = document.getElementById(sectionId);

        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }, [pathname, hash, key]);

    return (
        <div className="landing-page">
            <section className="landing-hero" aria-labelledby="landing-title">
                <div className="container landing-hero-grid">
                    <div className="landing-hero-visual">
                        <div className="landing-hero-photo-wrap">
                            <img
                                className="landing-hero-photo"
                                src="../src/assets/landing/hero-landing.svg"
                                alt="Estudiantes usando una computadora portátil"
                                fetchPriority="high"
                            />
                            <div className="landing-hero-photo-caption">
                                <span>SKILLUP CAMPUS</span>
                                <strong>Potenciá tu futuro.</strong>
                            </div>
                        </div>
                        {/* <div className="landing-hero-floating-card" aria-hidden="true">
                            <span className="floating-card-icon">✦</span>
                            <span><strong>Potenciá tu futuro</strong><small>Aprendé a tu ritmo.</small></span>
                        </div>
                        <span className="landing-hero-orbit landing-orbit-one" aria-hidden="true" />
                        <span className="landing-hero-orbit landing-orbit-two" aria-hidden="true" /> */}
                    </div>

                    <div className="landing-hero-copy">
                        <span className="landing-eyebrow">
                            <span className="landing-eyebrow-dot" aria-hidden="true" />
                            APRENDIZAJE PARA LO QUE VIENE
                        </span>
                        <h1 id="landing-title">{landingCopy.heroTitle}</h1>
                        <p style={{ whiteSpace: 'pre-line' }}>{landingCopy.heroSubtitle}</p>
                        <div className="landing-hero-actions">
                            <Link className="button button-outline-secondary" to="/courses">{landingCopy.heroCta} <span aria-hidden="true">↗</span></Link>
                            <Link className="landing-secondary-link" to="/#beneficios">Conocé nuestros diferenciales <span aria-hidden="true">→</span></Link>
                        </div>
                        <div className="landing-hero-note">
                            <span aria-hidden="true">✓</span>
                            Una plataforma adaptada a tus tiempos.
                        </div>
                    </div>
                </div>
            </section>

            <section className="landing-benefits section-space" id="beneficios" aria-labelledby="benefits-title">
                <div className="container">
                    <div className="landing-section-heading landing-section-heading-centered">
                        {/* <span className="eyebrow">NUESTROS DIFERENCIALES</span> */}
                        <h2 id="benefits-title" className="benefits-title">{landingCopy.benefitsTitle}</h2>
                        <p>Recursos y acompañamiento para que puedas avanzar a tu ritmo.</p>
                    </div>

                    <div className="benefit-feature-grid">
                        {benefitCopy.map((benefit, index) => (
                            <article className={`benefit-feature-card ${benefit.tone}`} key={benefit.title}>
                                <div className="benefit-feature-image">
                                    <img src={benefit.image} alt={benefit.imageAlt} loading="lazy" />
                                    <span className="benefit-feature-number">0{index + 1}</span>
                                </div>
                                <div className="benefit-feature-copy">
                                    <h3>{benefit.title}</h3>
                                    <p>{benefit.description}</p>
                                    <br />
                                    <Link
                                        className="button button-outline-secondary button-small"
                                        to="/#contacto"
                                        style={{ display: 'block', width: 'fit-content', margin: '0 auto' }}>
                                        {benefit.action}
                                    </Link>
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
                            <h2 id="courses-title" className="courses-title">{landingCopy.coursesTitle}</h2>
                            <p>Encontrá una propuesta que acompañe tus intereses y objetivos.</p>
                        </div>
                        <Link className="button button-primary landing-course-cta" to="/courses">
                            Ver catálogo completo <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {coursesLoading && <div className="loading-state"><LoadingSpinner label="Cargando cursos" /> Cargando cursos…</div>}
                    {coursesError && <FeedbackMessage type="error" title="No pudimos cargar los cursos">{coursesError}</FeedbackMessage>}
                    {!coursesLoading && !coursesError && featuredCourses.length === 0 && (
                        <div className="landing-courses-empty">
                            <h3>Próximamente vas a encontrar cursos acá.</h3>
                            <p>El catálogo todavía no tiene cursos publicados.</p>
                        </div>
                    )}
                    {!coursesLoading && !coursesError && featuredCourses.length > 0 && (
                        <div className="landing-course-grid">
                            {featuredCourses.map((course) => (
                                <Link className="landing-course-card" to={`/courses/${course.id}`} key={course.id}>
                                    <CourseThumbnail course={course} className="landing-course-art" />
                                    <div className="landing-course-copy">
                                        <div className="landing-course-meta">
                                            <span>{getCourseLevelLabel(course)}</span>
                                            <span>{getCourseDurationLabel(course, formatCourseDuration)}</span>
                                        </div>
                                        <h3>{getCourseTitle(course)}</h3>
                                        <p>{getCourseDescription(course)}</p>
                                        <div className="landing-course-footer">
                                            <strong>{formatPrice(course.price)}</strong>
                                            <span className="landing-course-link">Ver más <span aria-hidden="true">↗</span></span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="landing-testimonials section-space" id="testimonios" aria-labelledby="testimonials-title">
                <div className="container">
                    <div className="testimonials-banner">
                        {/* El translate es para bajar un poquito la imagen, ya que por defecto el svg definido, tenía más sobrante abajo que arriba*/}
                        <span className="testimonials-banner-mark" aria-hidden="true"><img style={{ transform: 'translateY(6%)' }} src={circularEmblem} alt="" /></span>
                        <h2 id="testimonials-title">{landingCopy.testimonialsTitle}</h2>
                        <span className="testimonials-banner-mark" aria-hidden="true"><img style={{ transform: 'translateY(6%)' }} src={circularEmblem} alt="" /></span>
                    </div>

                    <div className="testimonials-grid">
                        {TESTIMONIALS.map((item) => {
                            if (item.isBrandLogo) {
                                return (
                                    <div className="testimonial-brand-slot" key={item.id} aria-hidden="true">
                                        <img src={cardLogo} alt="Logotipo de SkillUp Campus" loading="lazy" />
                                    </div>
                                );
                            }

                            return (
                                <article className="testimonial-card" key={item.id}>
                                    <img
                                        className="testimonial-card-image"
                                        src={item.image}
                                        alt={`${item.name}. ${item.course}. ${item.quote}`}
                                        loading="lazy"
                                    />
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
