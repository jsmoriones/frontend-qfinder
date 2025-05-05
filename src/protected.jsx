import { Navigate } from "react-router-dom";
import { useAuth } from "./context/PacienteContext/AuthContext";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) return <Navigate to="/login" replace />;
};