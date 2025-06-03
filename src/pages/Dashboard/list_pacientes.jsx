import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { listPatients } from "../../services/PacienteService";

const ListPacientes = () => {
  const [pacientes, setPacientes] = useState(null);
  const [loading, setLoading] = useState(true);  

  const fetchPacientes = async () => {
    const response = await listPatients();
    setPacientes(response);
    console.log(response);
    if(response?.status === 200){
      setPacientes(response.data.data);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#374957] mb-6">
        Lista de Pacientes
      </h1>
      <div className="overflow-x-auto">
        {
          pacientes !== null ?
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-[#6D8AFD] text-white">
                  <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Edad</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente, index) => (
                  <tr key={paciente.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{paciente.nombre}</td>
                    <td className="px-6 py-4">{paciente.correo}</td>
                    <td className="px-6 py-4">{paciente.edad}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          paciente.estado === "Activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {paciente.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                          className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer">
                          <i className="fa-solid fa-pencil text-xl"></i>
                      </button>
                      <button
                          className="text-red-600 hover:text-red-400 transition-all cursor-pointer">
                          <i class="fa-solid fa-trash text-xl"></i>
                      </button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          : (
            <div className="flex justify-center items-center">
              <PuffLoader
                size={120}
                color={"#6D8AFD"}
                loading={loading}
                speedMultiplier={5}
              />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default ListPacientes;
