import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function Register() {
    const [notice, setNotice] = useState(null);

    // Al llegar desde el enlace del Footer, la página comienza desde arriba.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            setNotice({
                type: 'error',
                message: 'Las contraseñas no coinciden. Revisá ambos campos.',
            });
            return;
        }

        // El alta se conectará al endpoint de registro cuando esté implementado en el backend.
        // Por ahora no se envían ni se almacenan los datos del formulario.
        setNotice({
            type: 'info',
            message: 'La vista está lista y los datos cumplen las validaciones básicas. El registro todavía no se guarda ni se envía; se conectará con el backend en una próxima etapa.',
        });
    }

    return (
        <section className="auth-page auth-register-page">
            <div className="auth-layout auth-register-layout">
                <aside className="auth-aside auth-register-aside">
                    <span className="auth-aside-kicker">SKILLUP CAMPUS</span>
                    <h1>Tu próximo paso empieza con una cuenta.</h1>
                    <p>
                        Sumate a la comunidad, descubrí nuevas habilidades y empezá a construir
                        el camino que querés para tu futuro.
                    </p>
                    <div className="auth-aside-decoration" aria-hidden="true">
                        <span className="auth-orbit orbit-a" />
                        <span className="auth-orbit orbit-b" />
                        <span className="auth-star">✦</span>
                        <span className="auth-aside-badge">Aprender · Crecer · Avanzar</span>
                    </div>
                </aside>

                <div className="auth-card auth-register-card">
                    <div className="auth-heading">
                        <span className="eyebrow">TU HISTORIA EN SKILLUP</span>
                        <h2>Creá tu cuenta</h2>
                        <p>Completá tus datos para registrarte como estudiante.</p>
                    </div>

                    <form className="auth-form auth-register-form" onSubmit={handleSubmit}>
                        <div className="auth-register-fields">
                            <div className="auth-field">
                                <label htmlFor="register-name">Nombre</label>
                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    placeholder="Tu nombre"
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

                            <div className="auth-field">
                                <label htmlFor="register-email">Correo electrónico</label>
                                <input
                                    id="register-email"
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
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-username">Nombre de usuario</label>
                                <input
                                    id="register-username"
                                    name="username"
                                    type="text"
                                    placeholder="Ej. lucas123"
                                    autoComplete="username"
                                    minLength={3}
                                    maxLength={100}
                                    pattern="^[a-zA-Z0-9._]+$"
                                    title="Sin espacios. Solo letras, números, puntos o guiones bajos."
                                    required
                                />
                            </div>

                        <div className="auth-field">
                                <label htmlFor="register-password">Contraseña</label>
                                <input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    autoComplete="new-password"
                                    minLength={8}
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$"
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
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$"
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
                                    minLength={3}
                                    maxLength={50}
                                    pattern="^[a-zA-ZÀ-ÿ\u00f1\u00d1'\s]+$"
                                    title="Solo se permiten letras y espacios."
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-adress">Dirección (OPCIONAL)</label>
                                <input
                                    id="register-adress"
                                    name="adress"
                                    type="text"
                                    placeholder="Ej. Libertad 123, ciudad, provincia"
                                    autoComplete="adress"
                                    minLength={3}
                                    maxLength={100}
                                    pattern="^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s.,#°º\-]+$"
                                    title="Solo letras, números, espacios y símbolos como # ° - , ."
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-telephone">Teléfono (OPCIONAL)</label>
                                <input
                                    id="register-telephone"
                                    name="telephone"
                                    type="tel"
                                    placeholder="Ej. +54 3564 123456"
                                    autoComplete="tel"
                                    minLength={3}
                                    maxLength={25}
                                    pattern="^\+?[0-9\s\-()]{7,25}$"
                                    title="Ingresa un teléfono válido. Solo números, espacios, guiones, paréntesis o el signo + al inicio."
                                />
                            </div>

                            {/* Para el campo role_id, backend debe directamente asignarle el "id" o el "name" correspondiente al rol "Student" */}

                            {/* Para el campo created_at, backend debe guardar la fecha y hora completa en formato UTC (por ejemplo new Date().toISOString() en Node o NOW() en SQL) y en la tabla 'users' de la bd se le asigna la fecha y hora actual */}

                            {/* Para el campo updated_at, backend debe asignar NULL al crear el registro y a la bd le llegará dicho valor */}
                        </div>

                        <button className="button button-primary button-full" type="submit">
                            Crear cuenta <span aria-hidden="true">→</span>
                        </button>
                    </form>

                    {notice && (
                        <p className={`form-notice ${notice.type === 'error' ? 'form-notice-error' : ''}`} role={notice.type === 'error' ? 'alert' : 'status'} aria-live="polite">
                            {notice.message}
                        </p>
                    )}

                    <p className="auth-footnote">
                        ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
                    </p>
                    <Link className="back-link" to="/">← Volver al inicio</Link>
                    <p className="demo-disclaimer">Vista demostrativa · Sin conexión con el backend todavía</p>
                </div>
            </div>
        </section>
    );
}
