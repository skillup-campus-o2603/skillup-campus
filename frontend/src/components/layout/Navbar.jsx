import { Link, NavLink } from 'react-router';

function navLinkClass({ isActive }) {
    return isActive ? 'nav-link nav-link-active' : 'nav-link';
}

export default function Navbar() {
    return (
        <header className="site-header">
            <div className="announcement-bar">
                <div className="container announcement-content">
                    <p>
                        <span className="announcement-icon" aria-hidden="true">✦</span>
                        Nuevo ciclo lectivo: descubrí cursos para impulsar tu futuro.
                    </p>
                    <Link to="/catalog">
                        Explorar cursos <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>

            <div className="container navbar landing-navbar">
                <Link className="brand" to="/" aria-label="SkillUp Campus, ir al inicio">
                    <span className="brand-mark" aria-hidden="true">S</span>
                    <span className="brand-name">SkillUp<span>Campus</span></span>
                </Link>

                <nav className="main-nav" aria-label="Navegación principal">
                    <NavLink to="/" end className={navLinkClass}>Inicio</NavLink>
                    <Link className="nav-link" to="/#beneficios">Beneficios</Link>
                    <Link className="nav-link" to="/#cursos">Cursos</Link>
                    <Link className="nav-link" to="/#testimonios">Testimonios</Link>
                </nav>

                <div className="nav-actions">
                    <Link className="button button-outline button-small" to="/login">Iniciar sesión</Link>
                    <Link className="button button-accent button-small" to="/catalog">Explorar cursos</Link>
                </div>
            </div>
        </header>
    );
}
