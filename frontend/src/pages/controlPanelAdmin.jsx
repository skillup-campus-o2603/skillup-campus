import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { deleteCourse, getCourses } from '../api/courses.js';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import { getFriendlyApiMessage, marketingMessages } from '../utils/apiMessages.js';

function formatDuration(minutes) {
    const hours = Number(minutes) / 60;
    if (!Number.isFinite(hours) || hours <= 0) return '—';
    return hours < 1 ? `${minutes} min` : `${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`;
}

function formatPrice(price) {
    const amount = Number(price);
    return !Number.isFinite(amount) || amount === 0 ? 'Gratis' : amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ControlPanelAdmin() {
    const { token, user } = useAuth();
    const location = useLocation();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState(location.state?.message || '');
    const [deletingId, setDeletingId] = useState(null);

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

    async function handleDelete(course) {
        const confirmed = window.confirm(`¿Seguro que querés eliminar el curso “${course.title}”? Esta acción no se puede deshacer.`);
        if (!confirmed) return;

        setDeletingId(course.id);
        setNotice('');
        setError('');
        try {
            await deleteCourse(course.id, token);
            setCourses((current) => current.filter((item) => item.id !== course.id));
            setNotice(marketingMessages.courseDeleted);
        } catch (requestError) {
            setError(getFriendlyApiMessage(requestError, 'courseDelete'));
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <section className="container page-section admin-page">
            <div className="page-heading">
                <span className="eyebrow">GESTIÓN DE LA PLATAFORMA</span>
                <h1>Administración de cursos</h1>
                <p>Hola, {user?.name || 'administrador'}. Desde acá podés crear, editar y eliminar cursos.</p>
            </div>

            <div className="admin-toolbar">
                <div>
                    <strong>{courses.length} {courses.length === 1 ? 'curso' : 'cursos'}</strong>
                    <span> registrados en el catálogo</span>
                </div>
                <Link className="button button-accent" to="/createCourse">+ Crear curso</Link>
            </div>

            {notice && <FeedbackMessage type="success">{notice}</FeedbackMessage>}
            {error &&
                <div className="api-state">
                    <FeedbackMessage type="error" title="No se pudo completar la operación">{error}</FeedbackMessage>
                    <button className="button button-outline button-small" type="button" onClick={() => window.location.reload()}>Reintentar</button>
                </div>}
            {isLoading && <div className="loading-state"><LoadingSpinner label="Cargando cursos" /> Cargando cursos…</div>}

            {!isLoading && !error && courses.length === 0 && (
                <div className="api-state">
                    <h2>Todavía no hay cursos.</h2>
                    <p>Creá el primero para que aparezca en el catálogo público.</p>
                    <Link className="button button-primary" to="/createCourse">Crear primer curso</Link>
                </div>
            )}

            {!isLoading && courses.length > 0 && (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Curso</th>
                                <th>Categoría</th>
                                <th>Nivel</th>
                                <th>Duración</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td data-label="Curso"><strong>{course.title}</strong><small>#{course.id}</small></td>
                                    <td data-label="Categoría">{course.category?.name || '—'}</td>
                                    <td data-label="Nivel">{course.level || '—'}</td>
                                    <td data-label="Duración">{formatDuration(course.durationMinutes)}</td>
                                    <td data-label="Precio">{formatPrice(course.price)}</td>
                                    <td data-label="Acciones">
                                        <div className="admin-table-actions">
                                            <Link className="button button-outline button-small" to={`/editCourse/${course.id}`}>Editar</Link>
                                            <button className="button button-danger button-small" type="button" onClick={() => handleDelete(course)} disabled={deletingId === course.id}>
                                                {deletingId === course.id ? <><LoadingSpinner label="Eliminando curso" /> Eliminando…</> : 'Eliminar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
