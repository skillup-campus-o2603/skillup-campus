import { Link } from 'react-router';

export default function ControlPanel() {
    return (
        <section className="container not-found">
            <span className="eyebrow">ERROR</span>
            <h1>Página en construcción.</h1>
            <p>Esta página está en desarrollo, consulte más tarde.</p>
            <Link className="button button-primary" to="/">Volver al inicio</Link>
        </section>
    );
}