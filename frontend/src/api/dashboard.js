import { apiRequest } from './client.js';
import { normalizeCourse } from './courses.js';

/** Obtiene el resumen académico del estudiante autenticado. */
export async function getStudentDashboard(token, { signal } = {}) {
    const response = await apiRequest('/api/dashboard', { token, signal });
    const data = response?.data || {};

    return {
        summary: data.summary || {},
        courses: Array.isArray(data.courses)
            ? data.courses.map((course) => ({
                ...normalizeCourse({ ...course, id: course.courseId }),
                courseId: course.courseId,
                enrollmentId: course.enrollmentId,
                enrolledAt: course.enrolledAt,
                totalLessons: Number(course.totalLessons) || 0,
                completedLessons: Number(course.completedLessons) || 0,
                progress: course.progress ?? null,
            }))
            : [],
    };
}
