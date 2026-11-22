import successIcon from '../../assets/icons/alerts/success.svg';
import errorIcon from '../../assets/icons/alerts/error.svg';
import warningIcon from '../../assets/icons/alerts/warning.svg';
import infoIcon from '../../assets/icons/alerts/info.svg';

const ICONS = {
    success: successIcon,
    error: errorIcon,
    warning: warningIcon,
    info: infoIcon,
};

export default function FeedbackMessage({ type = 'info', title, children, className = '' }) {
    const safeType = ICONS[type] ? type : 'info';
    const role = safeType === 'error' ? 'alert' : 'status';

    return (
        <div className={`feedback-message feedback-${safeType} ${className}`.trim()} role={role} aria-live={role === 'alert' ? 'assertive' : 'polite'}>
            <img className="feedback-icon" src={ICONS[safeType]} alt="" aria-hidden="true" />
            <div className="feedback-content">
                {title && <strong>{title}</strong>}
                {children && <div>{children}</div>}
            </div>
        </div>
    );
}
