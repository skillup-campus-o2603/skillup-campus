import { useEffect, useMemo, useState } from 'react';
import { getCourses } from '../../api/courses.js';

const EMPTY_COURSE = {
    title: '',
    description: '',
    category_id: '',
    duration_minutes: '60',
    image_url: '',
    price: '0',
    level_id: '',
};

export default function CourseForm({ initialCourse = null, onSubmit, submitLabel, isSaving = false }) {
    const [form, setForm] = useState(EMPTY_COURSE);
    const [formError, setFormError] = useState('');
    const [catalogOptions, setCatalogOptions] = useState({ categories: [], levels: [] });

    useEffect(() => {
        if (!initialCourse) return;
        setForm({
            title: initialCourse.title || '',
            description: initialCourse.description || '',
            category_id: String(initialCourse.category?.id ?? ''),
            duration_minutes: String(initialCourse.durationMinutes ?? ''),
            image_url: initialCourse.imageUrl || '',
            price: String(initialCourse.price ?? 0),
            level_id: '',
        });
    }, [initialCourse]);

    useEffect(() => {
        const controller = new AbortController();
        getCourses({ signal: controller.signal })
            .then((courses) => {
                const categoriesById = new Map();
                courses.forEach((course) => {
                    if (course.category?.id) categoriesById.set(course.category.id, course.category.name);
                });
                setCatalogOptions({
                    categories: [...categoriesById].map(([id, name]) => ({ id, name })),
                });
            })
            .catch(() => {
                // Se pueden ingresar los IDs manualmente aunque el catálogo no esté disponible.
            });
        return () => controller.abort();
    }, []);

    const categoryOptions = useMemo(() => catalogOptions.categories, [catalogOptions.categories]);

    function updateField(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setFormError('');

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            category_id: Number(form.category_id),
            duration_minutes: Number(form.duration_minutes),
            image_url: form.image_url.trim() || null,
            price: Number(form.price),
        };

        if (!Number.isSafeInteger(payload.category_id) || payload.category_id <= 0) {
            setFormError('Ingresá un ID de categoría válido.');
            return;
        }
        if (form.level_id.trim()) {
            const levelId = Number(form.level_id);
            if (!Number.isSafeInteger(levelId) || levelId <= 0) {
                setFormError('Ingresá un ID de nivel válido.');
                return;
            }
            payload.level_id = levelId;
        } else if (!initialCourse) {
            setFormError('Ingresá un ID de nivel válido.');
            return;
        }
        if (!Number.isSafeInteger(payload.duration_minutes) || payload.duration_minutes <= 0) {
            setFormError('La duración debe ser un número entero mayor que cero, expresado en minutos.');
            return;
        }
        if (!Number.isFinite(payload.price) || payload.price < 0 || Math.abs(payload.price * 100 - Math.round(payload.price * 100)) > 1e-6) {
            setFormError('El precio debe ser un número válido con hasta dos decimales.');
            return;
        }
        if (payload.image_url && !/^https?:\/\/\S+$/i.test(payload.image_url)) {
            setFormError('La imagen debe tener una URL válida que comience con http:// o https://.');
            return;
        }

        try {
            await onSubmit(payload);
        } catch (error) {
            setFormError(error.message || 'No se pudo guardar el curso.');
        }
    }

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
                <div className="admin-field admin-field-full">
                    <label htmlFor="course-title">Título</label>
                    <input id="course-title" name="title" value={form.title} onChange={updateField} maxLength={150} required />
                </div>

                <div className="admin-field admin-field-full">
                    <label htmlFor="course-description">Descripción</label>
                    <textarea id="course-description" name="description" value={form.description} onChange={updateField} rows={5} required />
                </div>

                <div className="admin-field">
                    <label htmlFor="course-category-id">ID de categoría</label>
                    <input
                        id="course-category-id"
                        name="category_id"
                        type="number"
                        min="1"
                        step="1"
                        list="course-category-options"
                        value={form.category_id}
                        onChange={updateField}
                        required
                    />
                    <datalist id="course-category-options">
                        {categoryOptions.map((option) => <option key={option.id} value={option.id} label={option.name} />)}
                    </datalist>
                    <small>{categoryOptions.length ? `IDs conocidos: ${categoryOptions.map((option) => `${option.id} · ${option.name}`).join(' / ')}` : 'Ingresá un ID existente en la tabla categories.'}</small>
                </div>

                <div className="admin-field">
                    <label htmlFor="course-level-id">ID de nivel {initialCourse ? '(opcional)' : ''}</label>
                    <input
                        id="course-level-id"
                        name="level_id"
                        type="number"
                        min="1"
                        step="1"
                        value={form.level_id}
                        onChange={updateField}
                        required={!initialCourse}
                        placeholder={initialCourse ? 'Dejar vacío para conservar el nivel actual' : 'ID numérico de la tabla levels'}
                    />
                    <small>{initialCourse ? `Nivel actual: ${initialCourse.level}. Dejalo vacío si no querés modificarlo.` : 'Ingresá un ID existente en la tabla levels.'}</small>
                </div>

                <div className="admin-field">
                    <label htmlFor="course-duration">Duración (minutos)</label>
                    <input id="course-duration" name="duration_minutes" type="number" min="1" step="1" value={form.duration_minutes} onChange={updateField} required />
                </div>

                <div className="admin-field">
                    <label htmlFor="course-price">Precio</label>
                    <input id="course-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={updateField} required />
                </div>

                <div className="admin-field admin-field-full">
                    <label htmlFor="course-image-url">URL de imagen (opcional)</label>
                    <input id="course-image-url" name="image_url" type="url" placeholder="https://…" value={form.image_url} onChange={updateField} />
                </div>
            </div>

            <p className="admin-form-hint">
                La API no ofrece endpoints para consultar categorías y niveles por separado. Se sugieren los IDs de categoría que aparecen en los cursos existentes. Para el nivel, consultá el ID existente en la tabla levels; al editar, dejalo vacío para conservar el nivel actual.
            </p>

            {formError && <p className="form-notice form-notice-error" role="alert">{formError}</p>}

            <div className="admin-form-actions">
                <button className="button button-primary" type="submit" disabled={isSaving}>
                    {isSaving ? 'Guardando…' : submitLabel}
                </button>
            </div>
        </form>
    );
}
