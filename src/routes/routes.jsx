import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PacientePage } from "../pages/";
import LoginPage from "../pages/Autenticacion/LoginPage";
import RegisterPage from "../pages/Autenticacion/RegisterPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/paciente" element={<PacientePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;