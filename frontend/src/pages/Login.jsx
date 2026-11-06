import { useState } from 'react';
import { Link } from 'react-router';

export default function Login() {
  const [notice, setNotice] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setNotice('La pantalla está preparada. La autenticación se conectará con la API en una próxima etapa.');
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
            <p>Ingresá tus datos para continuar.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nombre@correo.com"
              autoComplete="email"
              required
            />
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresá tu contraseña"
              autoComplete="current-password"
              required
            />
            <button className="button button-primary button-full" type="submit">Ingresar <span aria-hidden="true">→</span></button>
          </form>
          {notice && <p className="form-notice" role="status">{notice}</p>}
          <p className="auth-footnote">
            ¿Todavía no tenés una cuenta? <span>El registro estará disponible próximamente.</span>
          </p>
          <Link className="back-link" to="/">← Volver al inicio</Link>
          <p className="demo-disclaimer">Vista demostrativa · Sin conexión con el backend todavía</p>
        </div>
      </div>
    </section>
  );
}
