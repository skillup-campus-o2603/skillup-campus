import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { landingCopy } from '../../content/marketingCopy.js';

function navLinkClass({ isActive }) {
    return isActive ? 'nav-link nav-link-active' : 'nav-link';
}

export default function Navbar() {
    const { user, isAuthenticated, signOut } = useAuth();
    const navigate = useNavigate();

    function handleSignOut() {
        const confirmed = window.confirm('¿Seguro que querés cerrar sesión?');
        if (!confirmed) return;

        signOut();
        navigate('/', { replace: true });
    }

    return (
        <header className="site-header">
            <div className="announcement-bar">
                <div className="container announcement-content">
                    <p>{landingCopy.announcement}</p>
                    {/* <p><span className="announcement-icon" aria-hidden="true">✦</span>{landingCopy.announcement}</p>
                    <Link to="/courses">
                        Explorar cursos <span aria-hidden="true">→</span>
                    </Link> */}
                </div>
            </div>

            <div className="container navbar landing-navbar">
                <Link className="brand" to="/" aria-label="SkillUp Campus, ir al inicio">
                    <img className="brand-logo" src="../src/assets/brand/skillup-logo.svg" alt="SkillUp" />
                </Link>

                <nav className="main-nav" aria-label="Navegación principal">
                    <NavLink to="/" end className={navLinkClass}>Inicio</NavLink>
                    <Link className="nav-link" to="/#cursos">Cursos</Link>
                    <Link className="nav-link" to="/#beneficios">Nosotros</Link>
                    {user?.role === 'Student' && (
                        <NavLink to="/dashboard" className={navLinkClass}>Mi aprendizaje</NavLink>
                    )}
                    <Link className="nav-link" to="/#contacto">Contacto</Link>
                    {/* <Link className="nav-link" to="/#testimonios">Testimonios</Link> */}
                </nav>

                <div className={`nav-actions ${isAuthenticated ? 'nav-actions-authenticated' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            {user?.role === 'Administrator' && (
                                <Link className="button button-outline button-small nav-admin-link" to="/controlPanelAdmin">Administrar</Link>
                            )}
                            <span className="nav-user-name">Hola, {user?.name || 'usuario'}</span>
                            <button className="button button-primary button-small" type="button" onClick={handleSignOut}>Cerrar sesión</button>
                        </>
                    ) : (
                        <>
                            <Link className="button button-outline button-small" to="/login">Iniciar sesión</Link>
                            <Link className="button button-primary button-small" to="/register">Registrarse</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
