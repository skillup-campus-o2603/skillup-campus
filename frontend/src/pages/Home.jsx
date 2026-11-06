import { Link } from 'react-router';

const categories = [
  { icon: '</>', title: 'Programación', description: 'Creá soluciones digitales.', tone: 'category-blue' },
  { icon: '✳', title: 'Diseño UX/UI', description: 'Diseñá experiencias claras.', tone: 'category-orange' },
  { icon: '▥', title: 'Datos', description: 'Convertí datos en ideas.', tone: 'category-purple' },
  { icon: '↗', title: 'Negocios', description: 'Potenciá tus proyectos.', tone: 'category-yellow' },
];

const benefits = [
  {
    number: '01',
    title: 'Aprendé a tu ritmo',
    description: 'Encontrá contenidos para dar tus primeros pasos o seguir profundizando tus conocimientos.',
  },
  {
    number: '02',
    title: 'Todo en un mismo lugar',
    description: 'Explorá cursos y organizá tu recorrido de aprendizaje desde una sola plataforma.',
  },
  {
    number: '03',
    title: 'Pensá en lo que viene',
    description: 'Sumá herramientas y habilidades que te ayuden a avanzar en tus objetivos.',
  },
];

export default function Home() {
  return (
    <div className="page-home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-light">
              <span className="eyebrow-dot" /> APRENDIZAJE PARA LO QUE VIENE
            </span>
            <h1>Aprendé algo nuevo. <span>Impulsá tu futuro.</span></h1>
            <p className="hero-description">
              Explorá cursos, desarrollá habilidades y encontrá nuevas formas de crecer. Tu próximo paso empieza acá.
            </p>
            <div className="hero-actions">
              <Link className="button button-accent" to="/catalog">
                Explorar cursos <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button-light-outline" to="/login">Ya tengo una cuenta</Link>
            </div>
            <div className="hero-note">
              <span className="note-check" aria-hidden="true">✓</span>
              Un espacio simple y amigable para aprender.
            </div>
          </div>

          <div className="hero-visual" aria-label="Vista ilustrativa de categorías de aprendizaje">
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <div className="learning-card">
              <div className="learning-card-top">
                <span className="learning-card-icon" aria-hidden="true">✦</span>
                <span className="learning-card-kicker">SKILLUP CAMPUS</span>
                <span className="learning-card-status">Explorá</span>
              </div>
              <div className="learning-card-heading">
                <span>Tu próxima habilidad</span>
                <strong>empieza con una idea.</strong>
              </div>
              <div className="learning-grid" aria-hidden="true">
                <div className="learning-tile tile-code"><span>&lt;/&gt;</span><small>Desarrollo</small></div>
                <div className="learning-tile tile-design"><span>✳</span><small>Diseño</small></div>
                <div className="learning-tile tile-data"><span>▥</span><small>Datos</small></div>
                <div className="learning-tile tile-business"><span>↗</span><small>Negocios</small></div>
              </div>
              <div className="learning-card-footer">
                <span>Elegí por dónde empezar</span>
                <span className="footer-arrow">↗</span>
              </div>
            </div>
            <div className="floating-note floating-note-top">
              <span className="floating-note-symbol">✦</span>
              Nuevas oportunidades
            </div>
            <div className="floating-note floating-note-bottom">
              <span className="floating-note-symbol">✓</span>
              Un paso a la vez
            </div>
          </div>
        </div>
      </section>

      <section className="category-section section-space">
        <div className="container">
          <div className="section-heading section-heading-row">
            <div>
              <span className="eyebrow">ENCONTRÁ TU CAMINO</span>
              <h2>Explorá por categoría</h2>
            </div>
            <Link className="section-link" to="/catalog">Ver todos los cursos <span aria-hidden="true">→</span></Link>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link className="category-card" to="/catalog" key={category.title}>
                <span className={`category-icon ${category.tone}`} aria-hidden="true">{category.icon}</span>
                <span className="category-card-copy">
                  <strong>{category.title}</strong>
                  <small>{category.description}</small>
                </span>
                <span className="category-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="benefits-section section-space">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">¿POR QUÉ SKILLUP?</span>
            <h2>Aprender también es avanzar.</h2>
            <p>Una experiencia pensada para que puedas enfocarte en lo importante: desarrollar tu potencial.</p>
          </div>
          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.number}>
                <span className="benefit-number">{benefit.number}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
