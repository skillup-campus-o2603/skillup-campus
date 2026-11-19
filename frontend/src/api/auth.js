import { apiRequest } from './client.js';

export function loginRequest(credentials) {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: credentials,
    });
}

export function registerRequest(userData) {
    return apiRequest('/api/auth/register', {
        method: 'POST',
        body: userData,
    });
}
