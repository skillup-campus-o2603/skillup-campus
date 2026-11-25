import { Link } from 'react-router';

export default function Footer() {
    return (
        <footer className="site-footer landing-footer" id="contacto">
            <div className="container footer-main">
                <div className="footer-about">
                    <Link className="footer-brand" to="/" aria-label="SkillUp Campus, ir al inicio">
                        <img className="footer-brand-logo" src="../src/assets/brand/skillup-logo-footer.svg" alt="SkillUp" />
                        <span style={{ transform: 'translateY(18%)' }} className="footer-brand-campus">Campus</span>
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
                    <Link to="/courses">Cursos</Link>
                    <Link to="/#testimonios">Testimonios</Link>
                </div>

                <div className="footer-column">
                    <h2>Tu cuenta</h2>
                    <Link to="/login">Inicio de sesión</Link>
                    <Link to="/controlPanelAdmin">Administración</Link>
                    <Link to="/register">Registro de estudiante</Link>
                </div>

                <div className="footer-column footer-contact-column">
                    <h2>Contacto y comunidad</h2>
                    <p>Conectate con nuestra comunidad y enterate de todas las novedades y eventos.</p>
                    <div className="footer-socials-wrap">
                        <span className="footer-socials-title">Canales Oficiales</span>
                        <div className="footer-socials-list">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de SkillUp Campus">
                                <img src="/src/assets/icons/socials/linkedin.svg" alt="LinkedIn" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram de SkillUp Campus">
                                <img src="/src/assets/icons/socials/instagram.svg" alt="Instagram" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub de SkillUp Campus">
                                <img src="/src/assets/icons/socials/github.svg" alt="GitHub" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <span>© {new Date().getFullYear()} SkillUp Campus. Todos los derechos reservados.</span>
                    <span>Políticas y Condiciones · Preguntas Frecuentes</span>
                    <span className="footer-project-status">Términos y uso · Privacidad</span>
                </div>
            </div>
        </footer>
    );
}
