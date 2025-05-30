import React, { useEffect, useState } from "react";

const ListPacientes = () => {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    // Simulación de datos desde una API
    const fetchPacientes = async () => {
      const data = [
        {
          id: 1,
          nombre: "Juan",
          Apellidos: "Perez",
          identificacion: "12345678",
          edad: 65,
          diagnostico: "Hipertensión",
          estado: "Activo",
        },
        {
          id: 2,
          nombre: "Ana",
          Apellidos: "Gomez",
          identificacion: "87654321",
          edad: 72,
          diagnostico: "Diabetes",
          estado: "Inactivo",
        },
        {
          id: 3,
          nombre: "Luis",
          Apellidos: "Martinez",
          identificacion: "45678901",
          edad: 80,
          diagnostico: "Alzheimer",
          estado: "Activo",
        },
      ];
      setPacientes(data);
    };

    fetchPacientes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#374957] mb-6">
        Lista de Pacientes
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-[#6D8AFD] text-white">
              <th className="px-6 py-3 text-left text-sm font-medium">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Apellidos
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Identificacion
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Edad
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Diagnóstico
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Estado
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente, index) => (
              <tr key={paciente.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium">{paciente.nombre}</td>
                <td className="px-6 py-4">{paciente.Apellidos}</td>
                <td className="px-6 py-4">{paciente.identificacion}</td>
                <td className="px-6 py-4 text-center">{paciente.edad}</td>
                <td className="px-6 py-4">{paciente.diagnostico}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      paciente.estado === "Activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {paciente.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPacientes;
