import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getMyEnrollments } from '../api/enrollments.js';
import { getStudentDashboard } from '../api/dashboard.js';
import { useAuth } from '../context/AuthContext.jsx';
import CourseThumbnail from '../components/courses/CourseThumbnail.jsx';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import myCoursesIcon from '../assets/icons/navigation/icono_mis_cursos.svg';
import { getCourseDescription, getCourseDurationLabel, getCourseLevelLabel, getCourseTitle } from '../content/marketingCopy.js';
import { getFriendlyApiMessage } from '../utils/apiMessages.js';

function formatDuration(minutes) {
    const value = Number(minutes);
    if (!Number.isFinite(value) || value <= 0) return 'Duración no definida';
    const hours = value / 60;
    if (hours < 1) return `${value} min`;
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;
}

function formatEnrollmentDate(value) {
    if (!value) return 'Fecha no disponible';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
    return new Intl.DateTimeFormat('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function formatProgress(value) {
    return Number.isFinite(Number(value)) ? `${Math.min(100, Math.max(0, Number(value)))}%` : '—';
}

export default function Dashboard() {
    const { token, user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError('');

        Promise.all([
            // Este endpoint es el origen de la lista de inscripciones solicitado
            // en la consigna de Semana 5.
            getMyEnrollments(token, { signal: controller.signal }),
            // Este endpoint agrega el resumen y el progreso académico por curso.
            getStudentDashboard(token, { signal: controller.signal }),
        ])
            .then(([enrollments, dashboard]) => {
                if (controller.signal.aborted) return;

                const dashboardCourses = new Map(
                    dashboard.courses.map((course) => [Number(course.courseId ?? course.id), course]),
                );

                const enrolledCourses = enrollments
                    .filter((enrollment) => enrollment?.course?.id != null)
                    .map((enrollment) => {
                        const course = enrollment.course;
                        const progressData = dashboardCourses.get(Number(course.id));

                        return {
                            ...course,
                            enrollmentId: enrollment.id,
                            enrolledAt: enrollment.enrolledAt,
                            totalLessons: progressData?.totalLessons ?? 0,
                            completedLessons: progressData?.completedLessons ?? 0,
                            progress: progressData?.progress ?? null,
                        };
                    });

                const apiSummary = dashboard.summary || {};
                setCourses(enrolledCourses);
                setSummary({
                    totalCourses: Number(apiSummary.totalCourses ?? enrolledCourses.length),
                    inProgressCourses: Number(apiSummary.inProgressCourses ?? 0),
                    completedCourses: Number(apiSummary.completedCourses ?? 0),
                    overallProgress: apiSummary.overallProgress ?? null,
                });
            })
            .catch((requestError) => {
                if (requestError.name !== 'AbortError') {
                    setError(getFriendlyApiMessage(requestError, 'dashboard'));
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [token, retryKey]);

    return (
        <section className="container page-section student-dashboard">
            <header className="student-dashboard-heading">
                <span className="eyebrow">MI APRENDIZAJE</span>
                <h1>¡Hola{user?.name ? `, ${user.name}` : ''}!</h1>
                <p>Este es tu espacio para seguir tus cursos y acompañar tu progreso en SkillUp.</p>
            </header>

            {isLoading && (
                <div className="student-dashboard-loading" aria-live="polite">
                    <LoadingSpinner label="Cargando tu panel de aprendizaje" size="medium" />
                    <div>
                        <strong>Estamos preparando tu espacio.</strong>
                        <span>Estamos buscando tus inscripciones y tu progreso.</span>
                    </div>
                </div>
            )}

            {!isLoading && error && (
                <div className="api-state api-state-error">
                    <FeedbackMessage type="error" title="No pudimos cargar tu panel">{error}</FeedbackMessage>
                    <button className="button button-outline" type="button" onClick={() => setRetryKey((value) => value + 1)}>
                        Intentar nuevamente
                    </button>
                </div>
            )}

            {!isLoading && !error && courses.length === 0 && (
                <div className="student-empty-state">
                    <div className="student-empty-state-art" aria-hidden="true">
                        <img src={myCoursesIcon} alt="" />
                        <span className="student-empty-spark student-empty-spark-one" />
                        <span className="student-empty-spark student-empty-spark-two" />
                    </div>
                    <span className="eyebrow">TU PRÓXIMO PASO</span>
                    <h2>Tu recorrido empieza con un curso.</h2>
                    <p>Todavía no estás inscripto en ningún curso. Explorá el catálogo y encontrá el próximo tema que quieras aprender.</p>
                    <Link className="button button-primary" to="/courses">Explorar cursos</Link>
                </div>
            )}

            {!isLoading && !error && courses.length > 0 && (
                <>
                    <div className="student-summary-grid" aria-label="Resumen de tu actividad">
                        <article className="student-summary-card">
                            <span className="student-summary-label">Cursos inscriptos</span>
                            <strong>{summary?.totalCourses ?? courses.length}</strong>
                            <span className="student-summary-detail">Tu recorrido de aprendizaje</span>
                        </article>
                        <article className="student-summary-card">
                            <span className="student-summary-label">En progreso</span>
                            <strong>{summary?.inProgressCourses ?? 0}</strong>
                            <span className="student-summary-detail">Cursos con lecciones disponibles</span>
                        </article>
                        <article className="student-summary-card">
                            <span className="student-summary-label">Completados</span>
                            <strong>{summary?.completedCourses ?? 0}</strong>
                            <span className="student-summary-detail">Cursos finalizados</span>
                        </article>
                        <article className="student-summary-card student-summary-card-highlight">
                            <span className="student-summary-label">Progreso general</span>
                            <strong>{summary?.overallProgress == null ? '—' : formatProgress(summary.overallProgress)}</strong>
                            <span className="student-summary-detail">
                                {summary?.overallProgress == null ? 'Disponible cuando los cursos tengan lecciones' : 'Avance de tus cursos'}
                            </span>
                        </article>
                    </div>

                    <div className="student-courses-heading">
                        <div>
                            <span className="eyebrow">TU FORMACIÓN</span>
                            <h2>Mis cursos</h2>
                        </div>
                        <Link className="text-button" to="/courses">Explorar más cursos <span aria-hidden="true">→</span></Link>
                    </div>

                    <div className="student-course-grid">
                        {courses.map((course) => {
                            const hasProgress = course.progress !== null && course.progress !== undefined
                                && Number.isFinite(Number(course.progress));
                            const progress = hasProgress ? Math.min(100, Math.max(0, Number(course.progress))) : null;

                            return (
                                <article className="student-course-card" key={course.enrollmentId || course.id}>
                                    <CourseThumbnail course={course} className="student-course-art" />
                                    <div className="student-course-body">
                                        <div className="student-course-meta">
                                            <span>{course.category?.name || 'SkillUp Campus'}</span>
                                            <span>{getCourseLevelLabel(course)}</span>
                                        </div>
                                        <h3>{getCourseTitle(course)}</h3>
                                        <p className="student-course-description">{getCourseDescription(course)}</p>
                                        <div className="student-course-date">Inscripto el {formatEnrollmentDate(course.enrolledAt)}</div>

                                        <div className="student-progress-block">
                                            <div className="student-progress-heading">
                                                <span>Tu progreso</span>
                                                <strong>{hasProgress ? `${progress}%` : 'Aún no disponible'}</strong>
                                            </div>
                                            {hasProgress ? (
                                                <div
                                                    className="student-progress-track"
                                                    role="progressbar"
                                                    aria-label={`Progreso de ${getCourseTitle(course)}`}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={progress}
                                                >
                                                    <span style={{ width: `${progress}%` }} />
                                                </div>
                                            ) : (
                                                <p className="student-progress-note">
                                                    El progreso estará disponible cuando este curso tenga módulos y lecciones.
                                                    Por ahora, esto quedó así, ya se cambiará, el alumno solo puede inscribirse si el curso ya está completo, con módulos y temas.
                                                </p>
                                            )}
                                            {course.totalLessons > 0 && (
                                                <span className="student-lesson-count">
                                                    {course.completedLessons} de {course.totalLessons} lecciones completadas
                                                </span>
                                            )}
                                        </div>

                                        <Link className="button button-outline button-full" to={`/courses/${course.id}`}>
                                            Ver curso
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
}
