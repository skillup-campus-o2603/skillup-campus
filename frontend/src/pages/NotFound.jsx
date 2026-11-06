import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section className="container not-found">
      <span className="eyebrow">ERROR 404</span>
      <h1>No encontramos esa página.</h1>
      <p>Puede que la dirección haya cambiado o que todavía no exista.</p>
      <Link className="button button-primary" to="/">Volver al inicio</Link>
    </section>
  );
}
