import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getCourses } from '../api/courses.js';

function formatDuration(minutes) {
    if (!Number.isFinite(Number(minutes)) || Number(minutes) <= 0) return 'Duración no definida';
    const hours = Number(minutes) / 60;
    if (hours < 1) return `${minutes} min`;
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;
}

function CourseImage({ course }) {
    if (course.imageUrl) {
        return <img src={course.imageUrl} alt={`Imagen del curso ${course.title}`} loading="lazy" />;
    }

    return (
        <div className="course-api-placeholder" aria-hidden="true">
            <span>SKILLUP</span>
            <strong>{course.title?.slice(0, 1)?.toUpperCase() || 'S'}</strong>
        </div>
    );
}

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        getCourses({ signal: controller.signal })
            .then(setCourses)
            .catch((requestError) => {
                if (requestError.name !== 'AbortError') setError(requestError.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, []);

    return (
        <section className="container page-section">
            <div className="page-heading">
                <span className="eyebrow">APRENDÉ ALGO NUEVO</span>
                <h1>Encontrá tu próximo curso</h1>
                <p>Elegí un tema, explorá nuevas ideas y empezá a desarrollar tus habilidades.</p>
            </div>

            <div className="courses-toolbar">
                <div>
                    <strong className="results-label">Catálogo disponible</strong>
                    {!isLoading && !error && <span className="results-count">{courses.length} {courses.length === 1 ? 'curso' : 'cursos'}</span>}
                </div>
                <span className="api-status-label">Datos actualizados desde SkillUp</span>
            </div>

            {isLoading && <p className="api-state-message" role="status">Cargando cursos…</p>}
            {error && (
                <div className="api-state api-state-error" role="alert">
                    <strong>No pudimos cargar el catálogo.</strong>
                    <p>{error}</p>
                    <button className="button button-outline button-small" type="button" onClick={() => window.location.reload()}>Reintentar</button>
                </div>
            )}
            {!isLoading && !error && courses.length === 0 && (
                <div className="api-state">
                    <h2>Todavía no hay cursos publicados.</h2>
                    <p>Cuando se agreguen cursos a SkillUp, aparecerán en este catálogo.</p>
                </div>
            )}

            {!isLoading && !error && courses.length > 0 && (
                <div className="course-grid">
                    {courses.map((course) => (
                        <article className="course-card" key={course.id}>
                            <div className="course-api-image">
                                <CourseImage course={course} />
                                <span className="course-category">{course.category?.name || 'Curso'}</span>
                            </div>
                            <div className="course-card-body">
                                <div className="course-meta">
                                    <span>{course.level || 'Nivel no definido'}</span>
                                    <span>{formatDuration(course.durationMinutes)}</span>
                                </div>
                                <h2>{course.title}</h2>
                                <p>{course.description}</p>
                                <div className="course-card-bottom">
                                    <strong>{Number(course.price) === 0 ? 'Gratuito' : `$ ${Number(course.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}</strong>
                                    <Link className="text-button" to={`/courses/${course.id}`}>
                                        Ver más <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}