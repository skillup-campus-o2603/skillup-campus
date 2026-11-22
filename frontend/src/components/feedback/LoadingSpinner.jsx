export default function LoadingSpinner({ label = 'Cargando', size = 'small', className = '' }) {
    return (
        <span className={`loading-spinner loading-spinner-${size} ${className}`.trim()} role="status" aria-label={label}>
            <span className="loading-spinner-ring" aria-hidden="true" />
            <span className="visually-hidden">{label}</span>
        </span>
    );
}
