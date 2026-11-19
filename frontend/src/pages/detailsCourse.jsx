import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getCourseById } from '../api/courses.js';

function formatDuration(minutes) {
    const hours = Number(minutes) / 60;
    if (!Number.isFinite(hours) || hours <= 0) return 'No especificada';
    return hours < 1 ? `${minutes} minutos` : `${Number.isInteger(hours) ? hours : hours.toFixed(1)} horas`;
}

export default function DetailsCourse() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        getCourseById(id, { signal: controller.signal })
            .then(setCourse)
            .catch((requestError) => {
                if (requestError.name !== 'AbortError') setError(requestError.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [id]);

    if (isLoading) return <section className="container page-section"><p className="api-state-message">Cargando información del curso…</p></section>;
    if (error) return <section className="container page-section"><div className="api-state api-state-error" role="alert"><h1>No pudimos abrir el curso.</h1><p>{error}</p><Link className="button button-primary" to="/courses">Volver al catálogo</Link></div></section>;
    if (!course) return null;

    return (
        <section className="container page-section course-detail-page">
            <Link className="back-link" to="/courses">← Volver al catálogo</Link>
            <div className="course-detail-card">
                <div className="course-detail-visual">
                    {course.imageUrl ? <img src={course.imageUrl} alt={`Imagen del curso ${course.title}`} /> : <div className="course-api-placeholder"><span>SKILLUP</span><strong>{course.title?.slice(0, 1)?.toUpperCase() || 'S'}</strong></div>}
                </div>
                <div className="course-detail-content">
                    <span className="eyebrow">{course.category?.name || 'CURSO SKILLUP'}</span>
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>
                    <dl className="course-detail-meta">
                        <div><dt>Nivel</dt><dd>{course.level || 'No especificado'}</dd></div>
                        <div><dt>Duración</dt><dd>{formatDuration(course.durationMinutes)}</dd></div>
                        <div><dt>Precio</dt><dd>{Number(course.price) === 0 ? 'Gratuito' : `$ ${Number(course.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}</dd></div>
                    </dl>
                    <p className="course-enrollment-note">La inscripción a cursos todavía no cuenta con un endpoint en la API.</p>
                </div>
            </div>
        </section>
    );
}
