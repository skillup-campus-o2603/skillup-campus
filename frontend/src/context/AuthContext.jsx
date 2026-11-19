import { createContext, useContext, useMemo, useState } from 'react';
import { loginRequest } from '../api/auth.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'skillup.session';

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

    const value = useMemo(() => ({
        user: session?.user || null,
        token: session?.token || null,
        isAuthenticated: Boolean(session?.token),
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
