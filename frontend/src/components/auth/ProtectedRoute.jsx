import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const allowedRoles = roles?.flat() || [];

    if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/notFound" replace />;
    }

    return children;
}
