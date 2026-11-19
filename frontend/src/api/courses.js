import { apiRequest } from './client.js';

export async function getCourses({ signal } = {}) {
    const response = await apiRequest('/api/courses', { signal });
    return Array.isArray(response?.data) ? response.data : [];
}

export async function getCourseById(id, { signal } = {}) {
    const response = await apiRequest(`/api/courses/${encodeURIComponent(id)}`, { signal });
    return response?.data;
}

export async function createCourse(course, token) {
    return apiRequest('/api/courses', { method: 'POST', body: course, token });
}

export async function updateCourse(id, course, token) {
    return apiRequest(`/api/courses/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: course,
        token,
    });
}

export async function deleteCourse(id, token) {
    return apiRequest(`/api/courses/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        token,
    });
}
