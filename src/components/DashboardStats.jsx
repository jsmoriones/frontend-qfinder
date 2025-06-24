import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, LabelList
} from 'recharts';

const COLORS = ['#4bbffa', '#a78bfa', '#facc15', '#f87171', '#34d399', '#60a5fa', '#f472b6'];

const DashboardGraficos = ({ data }) => {
  if (!data) return <div className="p-6">Cargando datos...</div>;

  // Formateo de datos
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

  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard General</h1>

      {/* Usuarios por rol y estado */}
      <section className="w-full bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Usuarios por Rol y Estado</h2>
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
            <Bar dataKey="value" fill="#4bbffa">
              <LabelList dataKey="value" position="top" />
            </Bar>
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Suscripciones por tipo y estado */}
      <section className="w-full bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Suscripciones por Tipo y Estado</h2>
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
      </section>

      {/* Dos columnas: Autonomía y Medicamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Pacientes por Nivel de Autonomía</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={formatPacientesAutonomia()}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {formatPacientesAutonomia().map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4bbffa">
                <LabelList dataKey="value" position="top" />
              </Bar>
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Medicamentos por Tipo</h2>
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
              <Bar dataKey="value" fill="#4bbffa">
                <LabelList dataKey="value" position="top" />
              </Bar>
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Redes con más usuarios */}
      <section className="w-full bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Redes con Más Usuarios</h2>
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
      </section>
    </div>
  );
};

export default DashboardGraficos;
