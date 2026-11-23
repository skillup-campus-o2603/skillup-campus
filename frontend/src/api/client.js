const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
    constructor(message, status = 0, payload = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.payload = payload;
    }
}

export async function apiRequest(path, { method = 'GET', body, token, headers = {}, signal } = {}) {
    const requestHeaders = {
        Accept: 'application/json',
        ...headers,
    };

    if (body !== undefined) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers: requestHeaders,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal,
        });
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        throw new ApiError('No se pudo conectar con SkillUp. Verificá que el servidor backend esté iniciado.');
    }

    const contentType = response.headers.get('content-type') || '';
    let payload = null;

    if (contentType.includes('application/json')) {
        try {
            payload = await response.json();
        } catch {
            throw new ApiError('El servidor devolvió una respuesta JSON inválida.', response.status);
        }
    } else {
        const text = await response.text();
        payload = text ? { message: text } : null;
    }

    // Si una operación autenticada recibe 401, el JWT ya no es válido
    // para el servidor. AuthProvider escucha este evento y elimina esa sesión.
    if (token && response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('skillup:session-expired', { detail: { token } }));
    }

    if (!response.ok || payload?.success === false) {
        throw new ApiError(
            payload?.message || `La solicitud falló (HTTP ${response.status}).`,
            response.status,
            payload,
        );
    }

    return payload;
}
