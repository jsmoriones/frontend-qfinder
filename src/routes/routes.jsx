import { PacientePage } from "../pages/";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/paciente" element={<PacientePage />} />
      </Routes>
    </BrowserRouter>
  );
};