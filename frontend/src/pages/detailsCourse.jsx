import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getCourseById } from '../api/courses.js';
import { createEnrollment, getMyEnrollments } from '../api/enrollments.js';
import { useAuth } from '../context/AuthContext.jsx';
import CourseThumbnail from '../components/courses/CourseThumbnail.jsx';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import { getCourseDescription, getCourseDurationLabel, getCourseLevelLabel, getCourseTitle } from '../content/marketingCopy.js';
import { getFriendlyApiMessage, marketingMessages } from '../utils/apiMessages.js';

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
    const { token, user, isAuthenticated } = useAuth();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrollmentStatus, setEnrollmentStatus] = useState('idle');
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrollmentFeedback, setEnrollmentFeedback] = useState(null);
    const [enrollmentCheckMessage, setEnrollmentCheckMessage] = useState('');
    const isStudent = isAuthenticated && user?.role === 'Student';

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError('');
        setCourse(null);

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

    // Verifica si el estudiante ya está inscripto para evitar ofrecerle
    // una segunda inscripción. El backend igualmente valida los duplicados.
    useEffect(() => {
        if (!isStudent || !token) {
            setEnrollmentStatus('idle');
            setEnrollmentCheckMessage('');
            return undefined;
        }

        const controller = new AbortController();
        setEnrollmentStatus('checking');
        setEnrollmentFeedback(null);
        setEnrollmentCheckMessage('');

        getMyEnrollments(token, { signal: controller.signal })
            .then((enrollments) => {
                if (controller.signal.aborted) return;
                const alreadyEnrolled = enrollments.some(
                    (enrollment) => Number(enrollment.course?.id) === Number(id),
                );
                setEnrollmentStatus(alreadyEnrolled ? 'enrolled' : 'available');
            })
            .catch((requestError) => {
                if (requestError.name === 'AbortError') return;
                setEnrollmentStatus('available');
                if (requestError.status !== 401) {
                    setEnrollmentCheckMessage('No pudimos comprobar tus inscripciones en este momento. El servidor verificará el estado al intentar inscribirte.');
                }
            });

        return () => controller.abort();
    }, [id, isStudent, token]);

    async function handleEnrollment() {
        if (isEnrolling || enrollmentStatus === 'enrolled' || !course || !token) return;

        setIsEnrolling(true);
        setEnrollmentFeedback(null);
        try {
            await createEnrollment(course.id, token);
            setEnrollmentStatus('enrolled');
            setEnrollmentFeedback({ type: 'success', message: marketingMessages.enrollmentCreated });
        } catch (requestError) {
            const isDuplicate = requestError.status === 409
                && String(requestError.message || '').toLowerCase().includes('ya estás inscrito');

            if (isDuplicate) setEnrollmentStatus('enrolled');
            setEnrollmentFeedback({
                type: isDuplicate ? 'success' : 'error',
                message: getFriendlyApiMessage(requestError, 'enrollment'),
            });
        } finally {
            setIsEnrolling(false);
        }
    }

    if (isLoading) {
        return <section className="container page-section"><div className="loading-state"><LoadingSpinner label="Cargando curso" /> Cargando información del curso…</div></section>;
    }

    if (error) {
        return (
            <section className="container page-section">
                <div className="api-state">
                    <FeedbackMessage type="error" title="No pudimos abrir el curso">{error}</FeedbackMessage>
                    <Link className="button button-primary" to="/courses">Volver al catálogo</Link>
                </div>
            </section>
        );
    }

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

                    <div className="course-enrollment-actions">
                        {enrollmentFeedback?.type === 'error' && (
                            <FeedbackMessage type="error" title="No pudimos completar la inscripción">
                                {enrollmentFeedback.message}
                            </FeedbackMessage>
                        )}

                        {enrollmentCheckMessage && <FeedbackMessage type="info">{enrollmentCheckMessage}</FeedbackMessage>}

                        {!isAuthenticated && (
                            <>
                                <p className="course-enrollment-note">Iniciá sesión con tu cuenta de estudiante para inscribirte en este curso.</p>
                                <Link
                                    className="button button-primary"
                                    to="/login"
                                    state={{ from: { pathname: `/courses/${course.id}` } }}
                                >
                                    Iniciar sesión para inscribirme
                                </Link>
                            </>
                        )}

                        {isStudent && enrollmentStatus === 'checking' && (
                            <div className="loading-state"><LoadingSpinner label="Verificando inscripción" /> Verificando tu inscripción…</div>
                        )}

                        {isStudent && enrollmentStatus === 'available' && (
                            <button className="button button-primary" type="button" onClick={handleEnrollment} disabled={isEnrolling}>
                                {isEnrolling ? <><LoadingSpinner label="Procesando inscripción" /> Inscribiendo…</> : 'Inscribirme'}
                            </button>
                        )}

                        {isStudent && enrollmentStatus === 'enrolled' && (
                            <div className="course-already-enrolled">
                                <FeedbackMessage type="success" title="¡Inscripción confirmada!">
                                    {enrollmentFeedback?.type === 'success' ? enrollmentFeedback.message : 'Ya estás inscripto en este curso.'}
                                </FeedbackMessage>
                                <Link className="button button-primary" to="/dashboard">Ver en mi aprendizaje</Link>
                            </div>
                        )}

                        {isAuthenticated && !isStudent && (
                            <FeedbackMessage type="info">La inscripción está disponible únicamente para cuentas de estudiante.</FeedbackMessage>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
