import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const usuarios = [
  { id: 1, suscripcion: 'pro', estado: 'active' },
  { id: 2, suscripcion: 'plus', estado: 'pending' },
  { id: 3, suscripcion: 'free', estado: 'cancelled' },
  { id: 4, suscripcion: 'pro', estado: 'active' },
  { id: 5, suscripcion: 'free', estado: 'paused' },
  { id: 6, suscripcion: 'plus', estado: 'active' },
  { id: 7, suscripcion: 'pro', estado: 'cancelled' },
];

const medicamentos = [
  { id: 1, tipo: 'psiquiatrico' },
  { id: 2, tipo: 'neurologico' },
  { id: 3, tipo: 'general' },
  { id: 4, tipo: 'otro' },
  { id: 5, tipo: 'neurologico' },
  { id: 6, tipo: 'psiquiatrico' },
];

const pacientes = [
  { id: 1, autonomia: 'alta' },
  { id: 2, autonomia: 'media' },
  { id: 3, autonomia: 'baja' },
  { id: 4, autonomia: 'media' },
  { id: 5, autonomia: 'alta' },
];

const redes = [
  { id: 1, nombre: 'Red A', usuarios: [1, 2, 3] },
  { id: 2, nombre: 'Red B', usuarios: [4, 5] },
  { id: 3, nombre: 'Red C', usuarios: [6] },
];

const COLORS = ['#4bbffa', '#a78bfa', '#facc15', '#f87171', '#34d399'];

const contar = (arr, campo) => {
  const map = {};
  arr.forEach(item => {
    map[item[campo]] = (map[item[campo]] || 0) + 1;
  });
  return Object.entries(map).map(([key, value]) => ({ name: key, value }));
};

const DashboardGraficos = () => {
  const dataSuscripciones = contar(usuarios, 'suscripcion');
  const dataEstados = contar(usuarios, 'estado');
  const dataMedicamentos = contar(medicamentos, 'tipo');
  const dataAutonomia = contar(pacientes, 'autonomia');
  const dataRedes = redes.map(red => ({
    name: red.nombre,
    usuarios: red.usuarios.length,
  }));

  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard General</h1>

      {/* Fila completa */}
      <section className="w-full bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Usuarios por Tipo de Suscripción</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataSuscripciones}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {dataSuscripciones.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Fila completa */}
      <section className="w-full bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Usuarios por Estado de Suscripción</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataEstados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4bbffa" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Medicamentos por Tipo</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataMedicamentos}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {dataMedicamentos.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Pacientes por Autonomía</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataAutonomia}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {dataAutonomia.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* Fila completa */}
      <section className="w-full bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Redes con Más Usuarios</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataRedes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="usuarios" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default DashboardGraficos;
