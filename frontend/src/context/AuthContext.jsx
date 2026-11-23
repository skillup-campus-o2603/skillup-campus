import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest } from '../api/auth.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'skillup.session';
const SESSION_EXPIRED_EVENT = 'skillup:session-expired';

function readStoredSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const session = JSON.parse(raw);
        if (!session?.token || !session?.user || !session?.expiresAt) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        if (Date.now() >= session.expiresAt) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return session;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function durationToMilliseconds(value) {
    if (typeof value !== 'string') return 24 * 60 * 60 * 1000;
    const match = value.match(/^(\d+)(s|m|h|d)$/i);
    if (!match) return 24 * 60 * 60 * 1000;
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multiplier = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit];
    return amount * multiplier;
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(readStoredSession);

    async function signIn(credentials) {
        const response = await loginRequest(credentials);
        const { user, token, expiresIn } = response?.data || {};

        if (!token || !user) {
            throw new Error('La API no devolvió los datos necesarios para iniciar sesión.');
        }

        const nextSession = {
            user,
            token,
            expiresAt: Date.now() + durationToMilliseconds(expiresIn),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
        return user;
    }

    function signOut() {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
    }

    // Un 401 en una petición con JWT invalida únicamente la sesión que originó
    // esa petición, evitando cerrar una sesión nueva por una respuesta tardía.
    useEffect(() => {
        function handleSessionExpired(event) {
            const rejectedToken = event.detail?.token;
            if (!rejectedToken) return;

            try {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
                if (stored?.token !== rejectedToken) return;
                localStorage.removeItem(STORAGE_KEY);
                setSession(null);
            } catch {
                localStorage.removeItem(STORAGE_KEY);
                setSession(null);
            }
        }

        window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    }, []);

    // La sesión también se cierra automáticamente cuando vence expiresAt,
    // aunque el usuario no navegue ni realice otra petición a la API.
    useEffect(() => {
        if (!session?.token || !session?.expiresAt) return undefined;

        const delay = Math.max(0, session.expiresAt - Date.now());
        const timer = window.setTimeout(() => {
            try {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
                if (stored?.token !== session.token) return;

                // Si el vencimiento supera el máximo admitido por setTimeout,
                // reprograma la comprobación sin cerrar antes la sesión.
                if (Date.now() < session.expiresAt) {
                    setSession((current) => current?.token === session.token ? { ...current } : current);
                    return;
                }

                localStorage.removeItem(STORAGE_KEY);
                setSession(null);
            } catch {
                localStorage.removeItem(STORAGE_KEY);
                setSession(null);
            }
        }, Math.min(delay, 2_147_000_000));

        return () => window.clearTimeout(timer);
    }, [session]);

    const value = useMemo(() => ({
        user: session?.user || null,
        token: session?.token || null,
        isAuthenticated: Boolean(session?.token && Date.now() < session.expiresAt),
        signIn,
        signOut,
    }), [session]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
    return context;
}
