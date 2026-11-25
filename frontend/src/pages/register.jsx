import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { registerRequest } from '../api/auth.js';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';
import LoadingSpinner from '../components/feedback/LoadingSpinner.jsx';
import { landingCopy } from '../content/marketingCopy.js';
import { getFriendlyApiMessage } from '../utils/apiMessages.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setError('');

        const formData = new FormData(event.currentTarget);
        const password = String(formData.get('password') || '');
        const confirmPassword = String(formData.get('confirmPassword') || '');
        const email = String(formData.get('email') || '').trim().toLowerCase();

        const requiredValues = ['name', 'surname', 'username', 'email', 'password', 'confirmPassword', 'country'];
        if (requiredValues.some((field) => !String(formData.get(field) || '').trim())) {
            setError('¡Un pequeño paso antes de continuar! Completá los campos para ingresar.');
            return;
        }
        if (!EMAIL_PATTERN.test(email)) {
            setError('El correo parece estar incompleto. Revisá que esté bien escrito.');
            return;
        }
        if (password.length < 8) {
            setError('Tu contraseña necesita al menos 8 caracteres. ¡Probá con una un poco más larga!');
            return;
        }
        if (String(formData.get('username') || '').trim().length < 3 || !/^[a-zA-Z0-9._-]+$/.test(String(formData.get('username') || '').trim())) {
            setError('El nombre de usuario debe tener al menos 3 caracteres y no incluir espacios.');
            return;
        }
        if (String(formData.get('name') || '').trim().length < 2 || String(formData.get('surname') || '').trim().length < 2 || String(formData.get('country') || '').trim().length < 2) {
            setError('Revisá tu nombre, apellido y país. Necesitamos al menos 2 caracteres en cada campo.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden. Revisá ambos campos.');
            return;
        }

        //Datos del usuario a enviar al backend para crear la cuenta
        const userData = {
            name: String(formData.get('name') || '').trim(),
            surname: String(formData.get('surname') || '').trim(),
            username: String(formData.get('username') || '').trim(),
            email,
            password,
            country: String(formData.get('country') || '').trim(),
            address: String(formData.get('address') || '').trim() || null,
            telephone: String(formData.get('telephone') || '').trim() || null,
        };

        setIsSubmitting(true);
        try {
            await registerRequest(userData);
            navigate('/login', { replace: true, state: { registered: true } });
        } catch (requestError) {
            setError(getFriendlyApiMessage(requestError, 'register'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="auth-page auth-register-page">
            <div className="auth-layout auth-register-layout">
                <aside className="auth-aside auth-register-aside">
                    <img className="auth-aside-kicker" src="../src/assets/brand/skillup-logo-footer.svg" alt="Logo SkillUp"></img>
                    <br /><br />
                    <h1>{landingCopy.registerTitle}</h1>
                    <br />
                    <p>{landingCopy.registerSubtitle}</p>
                    {/* <div className="auth-aside-decoration" aria-hidden="true">
                        <span className="auth-orbit orbit-a" />
                        <span className="auth-orbit orbit-b" />
                        <span className="auth-star">✦</span>
                        <span className="auth-aside-badge">Aprender · Crecer · Avanzar</span>
                    </div> */}
                </aside>

                <div className="auth-card auth-register-card">
                    <div className="auth-heading">
                        <span className="eyebrow auth-heading-kicker">TU HISTORIA EN SKILLUP</span>
                        <br /><br />
                        <h2>Creá tu cuenta</h2>
                        <p>Completá tus datos para registrarte como estudiante.</p>
                    </div>

                    <form className="auth-form auth-register-form" onSubmit={handleSubmit} noValidate>
                        <div className="auth-register-fields">
                            <div className="auth-field">
                                <label htmlFor="register-name">Nombre</label>
                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    placeholder="¿Cómo te llamás?"
                                    autoComplete="given-name"
                                    minLength={2}
                                    maxLength={100}
                                    pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1'\s]+$"
                                    title="Solo se permiten letras y espacios." //creo también permite el apóstrofe (para o'connor por ej.) y la ñ. REVISAR
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-surname">Apellido</label>
                                <input
                                    id="register-surname"
                                    name="surname"
                                    type="text"
                                    placeholder="Tu apellido"
                                    autoComplete="family-name"
                                    minLength={2}
                                    maxLength={100}
                                    pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1'\s]+$"
                                    title="Solo se permiten letras y espacios." //creo también permite el apóstrofe (para o'connor por ej.) y la ñ. REVISAR
                                    required
                                />
                            </div>

                            <div className="auth-field auth-field-full">
                                <label htmlFor="register-email">Correo electrónico</label>
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    placeholder="Ingresá tu correo electrónico"
                                    autoComplete="email"
                                    minLength={3}
                                    maxLength={100}
                                    pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                                    title="Ingresa un correo válido (ej. usuario@dominio.com)."
                                    required
                                />
                            </div>

                            <div className="auth-field auth-field-full">
                                <label htmlFor="register-username">Nombre de usuario</label>
                                <input
                                    id="register-username"
                                    name="username"
                                    type="text"
                                    placeholder="Elegí un nombre de usuario"
                                    autoComplete="username"
                                    minLength={3}
                                    maxLength={100}
                                    pattern="[a-zA-Z0-9._-]+"
                                    title="Sin espacios. Solo letras, números, puntos, guiones y guiones bajos."
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-password">Contraseña</label>
                                <input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    placeholder="Creá una contraseña segura"
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={255}
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,255}$"
                                    title="Mínimo 8 caracteres, una mayúscula, una minúscula y un número."
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-confirm-password">Repetir contraseña</label>
                                <input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Volvé a ingresarla"
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={255}
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,255}$"
                                    title="Mínimo 8 caracteres, una mayúscula, una minúscula y un número."
                                    required
                                />
                            </div>

                            <div className="auth-field auth-field-full">
                                <label htmlFor="register-country">País</label>
                                <input
                                    id="register-country"
                                    name="country"
                                    type="text"
                                    placeholder="Ej. Argentina"
                                    autoComplete="country-name"
                                    minLength={2}
                                    maxLength={50}
                                    pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1'\s]+$"
                                    title="Solo se permiten letras y espacios."
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-address">Dirección (opcional)</label>
                                <input
                                    id="register-address"
                                    name="address"
                                    type="text"
                                    placeholder="Tu dirección"
                                    autoComplete="street-address"
                                    minLength={3}
                                    maxLength={100}
                                    pattern="^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s.,#°º\-]+$"
                                    title="Solo letras, números, espacios y símbolos como # ° - , ."
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-telephone">Teléfono (opcional)</label>
                                <input
                                    id="register-telephone"
                                    name="telephone"
                                    type="tel"
                                    placeholder="Tu teléfono"
                                    autoComplete="tel"
                                    minLength={3}
                                    maxLength={25}
                                    pattern="^\+?[0-9\s\-()]{7,25}$"
                                    title="Ingresa un teléfono válido. Solo números, espacios, guiones, paréntesis o el signo + al inicio."
                                />
                            </div>
                        </div>

                        {error && <FeedbackMessage type="error">{error}</FeedbackMessage>}

                        <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><LoadingSpinner label="Creando cuenta" /> Creando cuenta…</> : 'Crear mi cuenta y empezar a aprender'}
                        </button>
                    </form>

                    <p className="auth-register-terms">Al crear tu cuenta, aceptás nuestros términos y condiciones.</p>
                    <p className="auth-footnote">¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>.</p>

                    <Link className="back-link" to="/">← Volver al inicio</Link>
                </div>
            </div>
        </section>
    );
}
