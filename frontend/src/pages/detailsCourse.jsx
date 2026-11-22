import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getCourseById } from '../api/courses.js';
import CourseThumbnail from '../components/courses/CourseThumbnail.jsx';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import { getCourseDescription, getCourseDurationLabel, getCourseLevelLabel, getCourseTitle } from '../content/marketingCopy.js';
import { getFriendlyApiMessage } from '../utils/apiMessages.js';

function formatDuration(minutes) {
    const hours = Number(minutes) / 60;
    if (!Number.isFinite(hours) || hours <= 0) return 'No especificada';
    return hours < 1 ? `${minutes} minutos` : `${Number.isInteger(hours) ? hours : hours.toFixed(1)} horas`;
}

function formatPrice(price) {
    const amount = Number(price);
    return !Number.isFinite(amount) || amount === 0 ? 'Gratuito' : `$ ${amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DetailsCourse() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError('');
        getCourseById(id, { signal: controller.signal })
            .then(setCourse)
            .catch((requestError) => {
                if (requestError.name !== 'AbortError') setError(getFriendlyApiMessage(requestError, 'courseDetails'));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [id]);

    if (isLoading) return <section className="container page-section"><div className="loading-state"><LoadingSpinner label="Cargando curso" /> Cargando información del curso…</div></section>;
    if (error) return <section className="container page-section"><div className="api-state"><FeedbackMessage type="error" title="No pudimos abrir el curso">{error}</FeedbackMessage><Link className="button button-primary" to="/courses">Volver al catálogo</Link></div></section>;

    if (!course) return null;

    return (
        <section className="container page-section course-detail-page">
            <Link className="back-link" to="/courses">← Volver al catálogo</Link>
            <div className="course-detail-card">
                <div className="course-detail-visual"><CourseThumbnail course={course} /></div>
                <div className="course-detail-content">
                    <span className="eyebrow">{course.category?.name || 'CURSO SKILLUP'}</span>
                    <h1>{getCourseTitle(course)}</h1>
                    <p>{getCourseDescription(course)}</p>
                    <dl className="course-detail-meta">
                        <div><dt>Nivel</dt><dd>{getCourseLevelLabel(course)}</dd></div>
                        <div><dt>Duración</dt><dd>{getCourseDurationLabel(course, formatDuration)}</dd></div>
                        <div><dt>Precio</dt><dd>{formatPrice(course.price)}</dd></div>
                    </dl>
                    <p className="course-enrollment-note">La inscripción a este curso todavía no está disponible desde esta vista.</p>
                </div>
            </div>
        </section>
    );
}
