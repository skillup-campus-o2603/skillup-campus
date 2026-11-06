const sampleCourses = [
  {
    category: 'PROGRAMACIÓN',
    title: 'Introducción al desarrollo web',
    level: 'Inicial',
    duration: '8 semanas',
    description: 'Conocé los fundamentos para empezar a crear sitios y aplicaciones web.',
    art: 'course-art-code',
    symbol: '</>',
  },
  {
    category: 'DISEÑO UX/UI',
    title: 'Diseño de experiencias digitales',
    level: 'Inicial',
    duration: '6 semanas',
    description: 'Aprendé a pensar interfaces claras, útiles y centradas en las personas.',
    art: 'course-art-design',
    symbol: '✳',
  },
  {
    category: 'DATOS',
    title: 'Primeros pasos en análisis de datos',
    level: 'Inicial',
    duration: '7 semanas',
    description: 'Explorá información, descubrí patrones y transformá datos en decisiones.',
    art: 'course-art-data',
    symbol: '▥',
  },
];

export default function Catalog() {
  return (
    <section className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">APRENDÉ ALGO NUEVO</span>
        <h1>Encontrá tu próximo curso</h1>
        <p>Elegí un tema, explorá nuevas ideas y empezá a desarrollar tus habilidades.</p>
      </div>

      <div className="catalog-toolbar">
        <div>
          <strong className="results-label">Cursos destacados</strong>
          <span className="results-count">3 opciones de ejemplo</span>
        </div>
        <span className="demo-label">Contenido ilustrativo</span>
      </div>

      <div className="course-grid">
        {sampleCourses.map((course) => (
          <article className="course-card" key={course.title}>
            <div className={`course-art ${course.art}`}>
              <span className="course-category">{course.category}</span>
              <span className="course-art-symbol" aria-hidden="true">{course.symbol}</span>
              <span className="course-art-caption">SKILLUP CAMPUS</span>
            </div>
            <div className="course-card-body">
              <div className="course-meta">
                <span>{course.level}</span>
                <span>{course.duration}</span>
              </div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <button className="text-button" type="button" disabled>
                Próximamente <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="page-footnote">
        Estos cursos son ejemplos para esta etapa del proyecto. El catálogo real se obtendrá desde la API cuando estén disponibles los endpoints correspondientes.
      </p>
    </section>
  );
}
