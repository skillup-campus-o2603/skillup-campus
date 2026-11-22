import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getCourseById, updateCourse } from '../api/courses.js';
import CourseForm from '../components/courses/CourseForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import { getFriendlyApiMessage, marketingMessages } from '../utils/apiMessages.js';

export default function EditCourse() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
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

    async function handleUpdate(payload) {
        setIsSaving(true);
        try {
            await updateCourse(id, payload, token);
            navigate('/controlPanelAdmin', { replace: true, state: { message: marketingMessages.courseUpdated } });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <section className="container page-section admin-course-form-page">
            <Link className="back-link" to="/controlPanelAdmin">← Volver a administración</Link>
            <div className="page-heading">
                <span className="eyebrow">ADMINISTRACIÓN</span>
                <h1>Editar curso</h1>
                <p>Actualizá la información del curso seleccionado.</p>
            </div>
            {isLoading && <div className="loading-state"><LoadingSpinner label="Cargando curso" /> Cargando curso…</div>}
            {error &&
                <div className="api-state">
                    <FeedbackMessage type="error">{error}</FeedbackMessage>
                    <Link className="button button-outline" to="/controlPanelAdmin">Volver</Link>
                </div>}
            {!isLoading && !error && course && (
                <div className="admin-form-card">
                    <CourseForm initialCourse={course} onSubmit={handleUpdate} submitLabel="Guardar cambios" isSaving={isSaving} />
                </div>
            )}
        </section>
    );
}
