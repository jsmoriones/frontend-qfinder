import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/PacienteContext/AuthContext";
import { useEffect } from "react";

export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth(); // Asegúrate de que tu AuthContext tenga un estado 'loading'
  const location = useLocation();

  // Muestra un estado de carga mientras se verifica la autenticación
  if (loading) {
    return <div>Cargando...</div>; // O un componente de carga más elaborado
  }

  // Si no está autenticado, redirige al login, guardando la ubicación actual para redirigir después
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, permite el acceso a las rutas hijas
  return <Outlet />;
};