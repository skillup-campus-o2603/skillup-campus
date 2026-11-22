import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getCourses } from '../api/courses.js';
import CourseThumbnail from '../components/courses/CourseThumbnail.jsx';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import { getCourseDescription, getCourseDurationLabel, getCourseLevelLabel, getCourseTitle } from '../content/marketingCopy.js';
import { getFriendlyApiMessage } from '../utils/apiMessages.js';

function formatDuration(minutes) {
    if (!Number.isFinite(Number(minutes)) || Number(minutes) <= 0) return 'Duración no definida';
    const hours = Number(minutes) / 60;
    if (hours < 1) return `${minutes} min`;
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;
}

function formatPrice(price) {
    const amount = Number(price);
    return !Number.isFinite(amount) || amount === 0
        ? 'Gratuito'
        : `$ ${amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadCourses = useCallback(async (signal) => {
        setError('');
        const result = await getCourses({ signal });
        setCourses(result);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        loadCourses(controller.signal)
            .catch((requestError) => {
                if (requestError.name !== 'AbortError') setError(getFriendlyApiMessage(requestError, 'courseList'));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, [loadCourses]);

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

            {isLoading && <div className="loading-state"><LoadingSpinner label="Cargando catálogo" /> Cargando cursos…</div>}
            {error && (
                <div className="api-state api-state-error">
                    <FeedbackMessage type="error" title="No pudimos cargar el catálogo">{error}</FeedbackMessage>
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
                            <CourseThumbnail course={course} className="course-card-art" />
                            <div className="course-card-body">
                                <div className="course-meta">
                                    <span>{getCourseLevelLabel(course)}</span>
                                    <span>{getCourseDurationLabel(course, formatDuration)}</span>
                                </div>
                                <h2>{getCourseTitle(course)}</h2>
                                <p>{getCourseDescription(course)}</p>
                                <div className="course-card-bottom">
                                    <strong>{formatPrice(course.price)}</strong>
                                    <Link className="text-button" to={`/courses/${course.id}`}>Ver más <span aria-hidden="true">→</span></Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}