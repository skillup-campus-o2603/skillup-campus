import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';

// Si ya existe una sesión, cada rol vuelve a su área principal.
const AUTHENTICATED_HOME = {
    Administrator: '/controlPanelAdmin',
    Teacher: '/controlPanel',
    Student: '/dashboard',
};

export default function GuestOnlyRoute({ children }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return children;

    const destination = AUTHENTICATED_HOME[user?.role] || '/courses';
    return <Navigate to={destination} replace />;
}
