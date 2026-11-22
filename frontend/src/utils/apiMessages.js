export const marketingMessages = {
    requiredFields: '¡Un pequeño paso antes de continuar! Completá los campos para ingresar.',
    invalidEmail: 'El correo parece estar incompleto. Revisá que esté bien escrito.',
    shortPassword: 'Tu contraseña necesita al menos 8 caracteres. ¡Probá con una un poco más larga!',
    invalidCredentials: '¡Ups! Parece que el correo o la contraseña no coinciden. Revisá tus datos e intentá nuevamente.',
    invalidUserData: 'No pudimos validar tus datos. Revisalos o intentá recuperar tu contraseña.',
    tooManyAttempts: '¡Tomémonos un momento! Alcanzaste el límite de intentos. Esperá unos minutos antes de volver a ingresar.',
    unexpected: '¡Algo no salió como esperábamos! Estamos trabajando para solucionarlo. Intentá de nuevo en unos minutos.',
    courseCreated: '¡Nuevo curso creado con éxito! Ya forma parte de nuestro catálogo.',
    courseUpdated: '¡Cambios guardados! La información del curso se actualizó correctamente.',
    courseDeleted: 'El curso se eliminó correctamente del catálogo.',
};

export function getFriendlyApiMessage(error, context = 'general') {
    if (!error || error.name === 'AbortError') return '';

    const status = Number(error.status || 0);
    const rawMessage = String(error.message || '').toLowerCase();

    if (status === 429 || rawMessage.includes('too many') || rawMessage.includes('intentos')) {
        return marketingMessages.tooManyAttempts;
    }

    if (context === 'login') {
        if (status === 400) return marketingMessages.requiredFields;
        if (status === 401 || status === 404) return marketingMessages.invalidCredentials;
    }

    if (context === 'register') {
        if (status === 409) return 'Ese correo o nombre de usuario ya está registrado. Probá con otros datos o iniciá sesión.';
        if (rawMessage.includes('correo') || rawMessage.includes('email')) return marketingMessages.invalidEmail;
        if (rawMessage.includes('contraseña') || rawMessage.includes('password')) return marketingMessages.shortPassword;
        if (status === 400) return 'Revisá los datos ingresados. Completá los campos obligatorios para crear tu cuenta.';
    }

    if (context.startsWith('course')) {
        if (status === 400) return 'Revisá los datos del curso. Completá los campos y elegí una categoría y un nivel válidos.';
        if (status === 401) return 'Tu sesión ya no está activa. Volvé a iniciar sesión para continuar.';
        if (status === 403) return 'No tenés permisos para realizar esta acción.';
        if (status === 404) return 'No encontramos ese curso. Actualizá la página y volvé a intentarlo.';
        if (status === 409) return 'No se pudo eliminar el curso porque tiene información asociada.';
    }

    if (status === 401) return 'Tu sesión ya no está activa. Volvé a iniciar sesión para continuar.';
    if (status === 403) return 'No tenés permisos para realizar esta acción.';
    if (status >= 500 || status === 0) return marketingMessages.unexpected;

    return 'No pudimos completar la operación. Revisá los datos e intentá nuevamente.';
}
