import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ targetPage, errorPage }) {
    const token = sessionStorage.getItem("token"); 

    if (!token) {
        return errorPage || <Navigate to="/login" replace />; 
    }

    return targetPage; 
}
