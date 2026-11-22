import { useEffect, useState } from 'react';
import { getCategories, getLevels } from '../../api/referenceData.js';
import FeedbackMessage from '../feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../feedback/LoadingSpinner.jsx';
import { getFriendlyApiMessage } from '../../utils/apiMessages.js';

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
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [optionsError, setOptionsError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([
            getCategories({ signal: controller.signal }),
            getLevels({ signal: controller.signal }),
        ])
            .then(([categories, levels]) => {
                if (!controller.signal.aborted) setCatalogOptions({ categories, levels });
            })
            .catch((error) => {
                if (error.name !== 'AbortError') setOptionsError(getFriendlyApiMessage(error, 'courseOptions'));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoadingOptions(false);
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!initialCourse) return;
        const matchingLevel = catalogOptions.levels.find(
            (level) => level.name?.toLowerCase() === initialCourse.level?.toLowerCase(),
        );
        setForm({
            title: initialCourse.title || '',
            description: initialCourse.description || '',
            category_id: String(initialCourse.category?.id ?? ''),
            duration_minutes: String(initialCourse.durationMinutes ?? ''),
            image_url: initialCourse.imageUrl || '',
            price: String(initialCourse.price ?? 0),
            level_id: String(initialCourse.levelId ?? matchingLevel?.id ?? ''),
        });
    }, [initialCourse, catalogOptions.levels]);

    function updateField(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        if (formError) setFormError('');
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
            level_id: Number(form.level_id),
        };

        if (!payload.title || !payload.description) {
            setFormError('¡Un pequeño paso antes de continuar! Completá los campos obligatorios.');
            return;
        }
        if (!Number.isSafeInteger(payload.category_id) || payload.category_id <= 0) {
            setFormError('Elegí una categoría de la lista para continuar.');
            return;
        }
        if (!Number.isSafeInteger(payload.level_id) || payload.level_id <= 0) {
            setFormError('Elegí un nivel de la lista para continuar.');
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
            setFormError(getFriendlyApiMessage(error, 'courseSave'));
        }
    }

    return (
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
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
                    <label htmlFor="course-category-id">Categoría</label>
                    <select id="course-category-id" name="category_id" value={form.category_id} onChange={updateField} required disabled={isLoadingOptions || !catalogOptions.categories.length}>
                        <option value="">Seleccioná una categoría</option>
                        {catalogOptions.categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="admin-field">
                    <label htmlFor="course-level-id">Nivel</label>
                    <select id="course-level-id" name="level_id" value={form.level_id} onChange={updateField} required disabled={isLoadingOptions || !catalogOptions.levels.length}>
                        <option value="">Seleccioná un nivel</option>
                        {catalogOptions.levels.map((level) => (
                            <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                    </select>
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

            {isLoadingOptions && <div className="loading-state"><LoadingSpinner label="Cargando categorías y niveles" /> Cargando categorías y niveles…</div>}
            {optionsError && <><FeedbackMessage type="error" title="No pudimos cargar las opciones">{optionsError}</FeedbackMessage><button className="button button-outline button-small" type="button" onClick={() => window.location.reload()}>Volver a intentar</button></>}
            {formError && <FeedbackMessage type="error">{formError}</FeedbackMessage>}

            <p className="admin-form-hint">
                Las categorías y los niveles se cargan desde el catálogo de SkillUp. La duración se expresa en minutos.
            </p>

            <div className="admin-form-actions">
                <button className="button button-primary" type="submit" disabled={isSaving || isLoadingOptions || !catalogOptions.categories.length || !catalogOptions.levels.length}>
                    {isSaving ? <><LoadingSpinner label="Guardando curso" /> Guardando…</> : submitLabel}
                </button>
            </div>
        </form>
    );
}
