import { Link } from 'react-router';
import FeedbackMessage from '../components/feedback/FeedbackMessage.jsx';

export default function LostPassword() {
    return (
        <section className="container page-section not-found">
            <span className="eyebrow">RECUPERAR ACCESO</span>
            <h1>¿Necesitás recuperar tu contraseña?</h1>
            <p>Queremos ayudarte a volver a tu espacio de aprendizaje.</p>
            <FeedbackMessage type="info">
                La recuperación de contraseña todavía no está disponible. Cuando se habilite esta opción, vas a poder recibir las instrucciones en tu correo electrónico.
            </FeedbackMessage>
            <Link className="button button-primary" to="/login">Volver a iniciar sesión</Link>
        </section>
    );
}