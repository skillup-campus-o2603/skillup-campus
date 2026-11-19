import { apiRequest } from './client.js';

// El controlador actual de backend devuelve level como { id, name },
// aunque la documentación de la API lo describe como un string.
// Normalizamos la respuesta para que el resto del frontend reciba siempre texto.
function normalizeCourse(course) {
    if (!course || typeof course !== 'object') return course;

    const level = course.level;
    const normalizedLevel =
        typeof level === 'string'
            ? level
            : level && typeof level === 'object' && typeof level.name === 'string'
                ? level.name
                : '';

    return {
        ...course,
        level: normalizedLevel,
    };
}

function normalizeCourseResponse(response) {
    if (!response || typeof response !== 'object' || !response.data) return response;

    return {
        ...response,
        data: normalizeCourse(response.data),
    };
}

export async function getCourses({ signal } = {}) {
    const response = await apiRequest('/api/courses', { signal });
    return Array.isArray(response?.data) ? response.data.map(normalizeCourse) : [];
}

export async function getCourseById(id, { signal } = {}) {
    const response = await apiRequest(`/api/courses/${encodeURIComponent(id)}`, { signal });
    return normalizeCourse(response?.data);
}

export async function createCourse(course, token) {
    const response = await apiRequest('/api/courses', { method: 'POST', body: course, token });
    return normalizeCourseResponse(response);
}

export async function updateCourse(id, course, token) {
    const response = await apiRequest(`/api/courses/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: course,
        token,
    });
    return normalizeCourseResponse(response);
}

export function deleteCourse(id, token) {
    return apiRequest(`/api/courses/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        token,
    });
}
