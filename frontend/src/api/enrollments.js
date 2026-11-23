import { apiRequest } from './client.js';
import { normalizeCourse } from './courses.js';

/** Inscribe al estudiante autenticado en el curso indicado. */
export function createEnrollment(courseId, token) {
    return apiRequest('/api/enrollments', {
        method: 'POST',
        body: { course_id: Number(courseId) },
        token,
    });
}

/** Obtiene exclusivamente las inscripciones del estudiante asociado al JWT. */
export async function getMyEnrollments(token, { signal } = {}) {
    const response = await apiRequest('/api/enrollments/me', { token, signal });
    if (!Array.isArray(response?.data)) return [];

    return response.data.map((enrollment) => ({
        ...enrollment,
        course: normalizeCourse(enrollment?.course),
    }));
}
