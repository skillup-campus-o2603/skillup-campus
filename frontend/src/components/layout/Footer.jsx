import { Link } from 'react-router';

export default function Footer() {
    return (
        <footer className="site-footer landing-footer" id="contacto">
            <div className="container footer-main">
                <div className="footer-about">
                    <Link className="footer-brand" to="/">
                        <span className="footer-brand-mark">S</span>
                        <span>SkillUp Campus</span>
                    </Link>
                    <p>Aprendé hoy. Construí lo que sigue.</p>
                    <span className="footer-about-note">
                        Una plataforma para explorar conocimientos y desarrollar nuevas habilidades.
                    </span>
                </div>

                <div className="footer-column">
                    <h2>Explorá</h2>
                    <Link to="/">Inicio</Link>
                    <Link to="/#beneficios">Beneficios</Link>
                    <Link to="/catalog">Catálogo de cursos</Link>
                    <Link to="/#testimonios">Testimonios</Link>
                </div>

                <div className="footer-column">
                    <h2>Tu cuenta</h2>
                    <Link to="/login">Iniciar sesión</Link>
                    <Link to="/admin">Administración</Link>
                    <span className="footer-muted-link">Registro · Próximamente</span>
                </div>

                <div className="footer-column footer-contact-column">
                    <h2>Contacto y comunidad</h2>
                    <p>Los canales oficiales de contacto y redes sociales se publicarán cuando estén definidos por el equipo.</p>
                    <span className="footer-coming-soon">Canales en preparación</span>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <span>© {new Date().getFullYear()} SkillUp Campus. Todos los derechos reservados.</span>
                    <span>Políticas y condiciones · Próximamente</span>
                    <span className="footer-project-status">Proyecto MVP en desarrollo</span>
                </div>
            </div>
        </footer>
    );
}
