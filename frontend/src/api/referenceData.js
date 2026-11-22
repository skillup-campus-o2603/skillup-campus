import { apiRequest } from './client.js';

export async function getCategories({ signal } = {}) {
    const response = await apiRequest('/api/categories', { signal });
    return Array.isArray(response?.data) ? response.data : [];
}

export async function getLevels({ signal } = {}) {
    const response = await apiRequest('/api/levels', { signal });
    return Array.isArray(response?.data) ? response.data : [];
}
