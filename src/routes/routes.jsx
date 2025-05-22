import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PacientePage } from "../pages/";
import LoginPage from "../pages/Autenticacion/LoginPage";
import RegisterPage from "../pages/Autenticacion/RegisterPage";
import { ConfirmationCodePage } from "../pages/";
import { AuthProvider } from "../context/PacienteContext/AuthContext";
import { ProtectedRoute } from "../protected";
import Dashboard from "../pages/Dashboard/Index";
import Layout from "../pages/Dashboard/Layout";
import PerfilCuidador from "../pages/Dashboard/PerfilCuidador";
import Recordatorios from "../pages/Dashboard/Recordatorios";
import RegistroPaciente from "../pages/Dashboard/RegistroPaciente";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<h1>Home</h1>} />
              <Route path="/paciente" element={<PacientePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cuidador-perfil" element={<PerfilCuidador />} />
              <Route path="/recordatorio" element={<Recordatorios />} />
              <Route path="/registro-paciente" element={<RegistroPaciente />} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<ConfirmationCodePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;