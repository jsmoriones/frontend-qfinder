import React, { useRef } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, LabelList
} from 'recharts';
import html2canvas from "html2canvas";

const COLORS = ['#4bbffa', '#a78bfa', '#facc15', '#f87171', '#34d399', '#60a5fa', '#f472b6'];

const DashboardGraficos = ({ data }) => {
  const medicamentosRef = useRef();
  const usuariosRef = useRef();
  const suscripcionesRef = useRef();
  const redesRef = useRef();

  if (!data) return <div className="p-6">Cargando datos...</div>;

  const formatResumenUsuario = () => {
    const result = [];
    Object.entries(data.resumenUsuario).forEach(([rol, estados]) => {
      Object.entries(estados).forEach(([estado, total]) => {
        result.push({ name: `${rol} - ${estado}`, value: total });
      });
    });
    return result;
  };

  const formatResumenSuscripciones = () => {
    const result = [];
    Object.entries(data.resumenEstados).forEach(([tipo, estados]) => {
      Object.entries(estados).forEach(([estado, total]) => {
        result.push({ name: `${tipo} - ${estado}`, value: total });
      });
    });
    return result;
  };

  const formatPacientesAutonomia = () =>
    data.pacientesAutonomia.map(item => ({
      name: item.nivel_autonomia,
      value: parseInt(item.total),
    }));

  const formatMedicamentos = () =>
    data.medicamentoTipos.map(item => ({
      name: item.tipo,
      value: parseInt(item.total),
    }));

  const formatRedes = () =>
    data.redesConMasMembresias.map(item => ({
      name: item.nombre,
      usuarios: parseInt(item.total),
    }));

  const handleDownload = async (ref, filename) => {
    const element = ref.current;
    if (!element) return;
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    link.click();
  };

  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard General</h1>

      {/* Usuarios por rol y estado */}
      <section className="w-full bg-white p-4 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Usuarios por Rol y Estado</h2>
          <button
            onClick={() => handleDownload(usuariosRef, "grafico_usuarios.png")}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Descargar
          </button>
        </div>
        <div ref={usuariosRef}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatResumenUsuario()}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {formatResumenUsuario().map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Suscripciones por tipo y estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="w-full bg-white p-4 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Suscripciones por Tipo y Estado</h2>
            <button
              onClick={() => handleDownload(suscripcionesRef, "grafico_suscripciones.png")}
              className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Descargar
            </button>
          </div>
          <div ref={suscripcionesRef}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatResumenSuscripciones()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4bbffa">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-4 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Medicamentos por Tipo</h2>
            <button
              onClick={() => handleDownload(medicamentosRef, "grafico_medicamentos.png")}
              className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Descargar
            </button>
          </div>
          <div ref={medicamentosRef}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={formatMedicamentos()}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {formatMedicamentos().map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Redes con más usuarios */}
      <section className="w-full bg-white p-4 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Redes con Más Usuarios</h2>
          <button
            onClick={() => handleDownload(redesRef, "grafico_redes.png")}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Descargar
          </button>
        </div>
        <div ref={redesRef}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatRedes()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="usuarios" fill="#34d399">
                <LabelList dataKey="usuarios" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default DashboardGraficos;
