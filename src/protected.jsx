import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/PacienteContext/AuthContext";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    console.log("isAuthenticated: ", isAuthenticated);
    
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <Outlet />
};