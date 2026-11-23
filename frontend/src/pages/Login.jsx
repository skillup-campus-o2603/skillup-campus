import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import { landingCopy } from '../content/marketingCopy.js';
import { getFriendlyApiMessage } from '../utils/apiMessages.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const registered = Boolean(location.state?.registered);

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setError('');

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get('email') || '').trim().toLowerCase();
        const password = String(formData.get('password') || '');

        if (!email || !password) {
            setError('¡Un pequeño paso antes de continuar! Completá los campos para ingresar.');
            return;
        }
        if (!EMAIL_PATTERN.test(email)) {
            setError('El correo parece estar incompleto. Revisá que esté bien escrito.');
            return;
        }

        setIsSubmitting(true);
        try {
            const user = await signIn({ email, password });
            const requestedPath = location.state?.from?.pathname;
            const homeByRole = {
                Administrator: '/controlPanelAdmin',
                Teacher: '/controlPanel',
                Student: '/dashboard',
            };
            navigate(requestedPath && requestedPath !== '/login' ? requestedPath : homeByRole[user.role] || '/courses', { replace: true });
        } catch (requestError) {
            setError(getFriendlyApiMessage(requestError, 'login'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="auth-page">
            <div className="auth-layout">
                <aside className="auth-aside">
                    <span className="auth-aside-kicker">SKILLUP CAMPUS</span>
                    <h1>{landingCopy.loginTitle}</h1>
                    <p>{landingCopy.loginSubtitle}</p>
                    <div className="auth-aside-decoration" aria-hidden="true">
                        <span className="auth-orbit orbit-a" />
                        <span className="auth-orbit orbit-b" />
                        <span className="auth-star">✦</span>
                        <span className="auth-aside-badge">Aprender · Crecer · Avanzar</span>
                    </div>
                </aside>

                <div className="auth-card">
                    <div className="auth-heading">
                        <span className="eyebrow">SKILLUP CAMPUS</span>
                        <h2>{landingCopy.loginTitle}</h2>
                        <p>{landingCopy.loginSubtitle}</p>
                    </div>

                    {registered && (
                        <FeedbackMessage type="success" title="¡Tu cuenta ya está lista!">
                            Ahora podés iniciar sesión y seguir aprendiendo.
                        </FeedbackMessage>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Ingresá tu correo electrónico"
                            autoComplete="email"
                            minLength={3}
                            maxLength={100}
                            pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                            title="Ingresa un correo válido (ej. usuario@dominio.com)."
                            required
                            aria-invalid={Boolean(error)}
                        />
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Ingresá tu contraseña"
                            autoComplete="current-password"
                            minLength={8}
                            maxLength={255}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,255}$"
                            title="Mínimo 8 caracteres, una mayúscula, una minúscula y un número."
                            required
                        />
                        <Link className="auth-link-forgot" to="/lostPassword">¿Olvidaste tu contraseña?</Link>

                        {error && <FeedbackMessage type="error">{error}</FeedbackMessage>}

                        <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><LoadingSpinner label="Ingresando" /> Ingresando…</> : 'Ingresar y seguir aprendiendo'}
                        </button>
                    </form>

                    <p className="auth-footnote">
                        ¿Todavía no tenés cuenta? <Link to="/register">Empezá hoy</Link>
                    </p>
                    <Link className="back-link" to="/">← Volver al inicio</Link>
                </div>
            </div>
        </section>
    );
}
