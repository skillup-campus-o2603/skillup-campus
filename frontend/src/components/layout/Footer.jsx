import { Link } from 'react-router';
import logo from '../../assets/brand/skillup-logo-footer.svg';

export default function Footer() {
    return (
        <footer className="site-footer landing-footer" id="contacto">
            <div className="container footer-main">
                <div className="footer-about">
                    <Link className="footer-brand" to="/" aria-label="SkillUp Campus, ir al inicio">
                        <img className="footer-brand-logo" src={logo} alt="SkillUp" />
                        <span style={{ transform: 'translateY(18%)' }} className="footer-brand-campus">Campus</span>
                    </Link>
                    <p>Potenciá tu futuro.</p>
                    <span className="footer-about-note">
                        Una plataforma para seguir aprendiendo y desarrollar nuevas habilidades.
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
                    <p>Conectate con SkillUp Campus. Los canales oficiales se publicarán cuando estén definidos por el equipo.</p>
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
                    <span>Políticas y condiciones · Próximamente</span>
                    <span className="footer-project-status">Potenciá tu futuro.</span>
                </div>
            </div>
        </footer>
    );
}
