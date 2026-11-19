import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (roles?.length && !roles.includes(user?.role)) {
        return <Navigate to="/courses" replace />;
    }

    return children;
}
