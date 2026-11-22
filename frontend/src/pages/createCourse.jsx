import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { createCourse } from '../api/courses.js';
import CourseForm from '../components/courses/CourseForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { marketingMessages } from '../utils/apiMessages.js';

export default function CreateCourse() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    async function handleCreate(payload) {
        setIsSaving(true);
        try {
            await createCourse(payload, token);
            navigate('/controlPanelAdmin', { replace: true, state: { message: marketingMessages.courseCreated } });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <section className="container page-section admin-course-form-page">
            <Link className="back-link" to="/controlPanelAdmin">← Volver a administración</Link>
            <div className="page-heading">
                <span className="eyebrow">ADMINISTRACIÓN</span>
                <h1>Crear un curso</h1>
                <p>Completá los datos del curso que se publicará en el catálogo.</p>
            </div>
            <div className="admin-form-card">
                <CourseForm onSubmit={handleCreate} submitLabel="Crear curso" isSaving={isSaving} />
            </div>
        </section>
    );
}