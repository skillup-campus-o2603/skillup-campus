export default function Admin() {
  return (
    <section className="container page-section admin-page">
      <div className="page-heading">
        <span className="eyebrow">GESTIÓN DE LA PLATAFORMA</span>
        <h1>Panel de administración</h1>
        <p>Un espacio central para organizar cursos y acompañar el funcionamiento de SkillUp Campus.</p>
      </div>

      <div className="admin-status-row">
        <span className="status-indicator"><span /> Estructura inicial disponible</span>
        <span className="demo-label">Módulo en construcción</span>
      </div>

      <div className="admin-placeholder">
        <div className="placeholder-icon" aria-hidden="true">⌘</div>
        <div>
          <h2>Tu espacio de gestión está en preparación.</h2>
          <p>
            Esta ruta ya forma parte del enrutamiento de la aplicación. En próximas etapas se incorporarán las métricas, tablas y acciones para administrar usuarios y cursos.
          </p>
        </div>
      </div>
    </section>
  );
}
