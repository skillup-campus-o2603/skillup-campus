import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="footer-brand" to="/">
          <span className="footer-brand-mark">S</span>
          <span>SkillUp Campus</span>
        </Link>
        <p>Aprendé hoy. Construí lo que sigue.</p>
        <span className="footer-legal">© {new Date().getFullYear()} SkillUp Campus · MVP en desarrollo</span>
      </div>
    </footer>
  );
}
