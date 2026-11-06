import { Link, NavLink } from 'react-router';

function navLinkClass({ isActive }) {
  return isActive ? 'nav-link nav-link-active' : 'nav-link';
}

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container navbar">
        <Link className="brand" to="/" aria-label="SkillUp Campus, ir al inicio">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-name">SkillUp<span>Campus</span></span>
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/" end className={navLinkClass}>Inicio</NavLink>
          <NavLink to="/catalog" className={navLinkClass}>Cursos</NavLink>
          <NavLink to="/admin" className={navLinkClass}>Administración</NavLink>
        </nav>

        <div className="nav-actions">
          <Link className="button button-outline button-small" to="/login">Iniciar sesión</Link>
          <Link className="button button-accent button-small" to="/catalog">Explorar cursos</Link>
        </div>
      </div>
    </header>
  );
}
