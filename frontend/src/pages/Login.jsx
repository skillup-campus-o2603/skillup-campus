import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const registered = Boolean(location.state?.registered);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const credentials = {
            email: String(formData.get('email') || '').trim().toLowerCase(),
            password: String(formData.get('password') || ''),
        };

        try {
            const user = await signIn(credentials);
            const requestedPath = location.state?.from?.pathname;
            const fallbackPath = user.role === 'Administrator' ? '/controlPanelAdmin' : '/courses';
            navigate(requestedPath && requestedPath !== '/login' ? requestedPath : fallbackPath, { replace: true });
        } catch (requestError) {
            setError(requestError.message || 'No se pudo iniciar sesión. Intentá nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="auth-page">
            <div className="auth-layout">
                <aside className="auth-aside">
                    <span className="auth-aside-kicker">SKILLUP CAMPUS</span>
                    <h1>Tu próximo paso empieza acá.</h1>
                    <p>Volvé a tu espacio de aprendizaje y seguí construyendo tu camino.</p>
                    <div className="auth-aside-decoration" aria-hidden="true">
                        <span className="auth-orbit orbit-a" />
                        <span className="auth-orbit orbit-b" />
                        <span className="auth-star">✦</span>
                        <span className="auth-aside-badge">Aprender · Crecer · Avanzar</span>
                    </div>
                </aside>

                <div className="auth-card">
                    <div className="auth-heading">
                        <span className="eyebrow">QUÉ BUENO VERTE DE NUEVO</span>
                        <h2>Iniciá sesión</h2>
                        <p>Ingresá tu correo electrónico y contraseña para continuar.</p>
                    </div>

                    {registered && (
                        <p className="form-notice form-notice-success" role="status">
                            ¡Tu cuenta se creó correctamente! Ahora podés iniciar sesión.
                        </p>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="nombre@correo.com"
                            autoComplete="email"
                            minLength={3}
                            maxLength={100}
                            pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                            title="Ingresa un correo válido (ej. usuario@dominio.com)."
                            required
                        />
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Ingresá tu contraseña"
                            autoComplete="current-password"
                            minLength={8}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,255}$"
                            title="Mínimo 8 caracteres, una mayúscula, una minúscula y un número."
                            required
                        />

                        {error && <p className="form-notice form-notice-error" role="alert">{error}</p>}

                        <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Ingresando…' : 'Ingresar'} <span aria-hidden="true">→</span>
                        </button>
                    </form>

                    <p className="auth-footnote">
                        ¿Todavía no tenés una cuenta? <Link to="/register">Registrate acá -estudiante-.</Link>
                    </p>
                    <Link className="back-link" to="/">← Volver al inicio</Link>
                </div>
            </div>
        </section>
    );
}
