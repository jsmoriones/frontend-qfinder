import React from 'react';
import PacienteCardMini from '../../components/PacienteCardMini';
import { ButtonLarge } from '../../components/ui/ButtonLarge';

const Medicamentos = () => {
  return (
    <div className="p-8">
      {/* Título principal */}
      <h1 className="text-5xl font-bold mb-8">Medicamentos Asignados</h1>

      {/* Paciente */}
      <div className="mb-6">
        <PacienteCardMini />
      </div>

      {/* Medicamentos asignados */}
      <div className="bg-gray-100 rounded-lg p-4 mb-8">
        <h2 className="text-center text-xl text-gray-700 mb-4">Medicamentos asignados</h2>
        <div className="flex flex-wrap gap-4 justify-start">
          {[1, 2, 3].map((item, index) => (
            <div key={index} className="bg-white border border-gray-700 rounded-lg p-4 w-64 relative">
              <h3 className="font-bold text-md">Acetaminofén</h3>
              <p className="text-sm">Dosis: 150 mg</p>
              <p className="text-sm">Frecuencia: 2 veces al día</p>
              {/* Botón eliminar */}
              <button className="absolute top-2 right-2">
                <img src="public\images\basura_imagen_boton.png" alt="Eliminar" className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <ButtonLarge text="Asignar medicamento" />
        </div>
      </div>

      {/* Lista de medicamentos */}
      <div>
        <h2 className="text-3xl font-bold mb-4">Lista de Medicamentos</h2>

        {/* Botón eliminar */}
        <div className="flex justify-end mb-2">
          <button className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer">
            Eliminar
            <img src="public\images\basura_imagen_boton.png" alt="Eliminar" className="w-7 h-7 ml-2" />
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-blue-500 rounded-lg bg-blue-100 text-center">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="px-4 py-2">Medicamento</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50">
                <td className="px-4 py-2"><input type="checkbox" className="mr-2 cursor-pointer" />Atorvastatina</td>
                <td className="px-4 py-2">Tomar una pastilla al día</td>
                <td className="px-4 py-2">hipolipemiante</td>
              </tr>
              <tr className="bg-blue-100">
                <td className="px-4 py-2"><input type="checkbox" className="mr-2 cursor-pointer" />Losartán</td>
                <td className="px-4 py-2">Una pastilla cada 8 horas</td>
                <td className="px-4 py-2">antihipertensivos</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-4 py-2"><input type="checkbox" className="mr-2 cursor-pointer" />Prednisona</td>
                <td className="px-4 py-2">Una pastilla cada 8 horas</td>
                <td className="px-4 py-2">glucocorticoide</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Botón agregar medicamento */}
        <div className="mt-6 flex justify-center">
          <ButtonLarge text="Agregar medicamento" />
        </div>
      </div>
    </div>
  );
};

export default Medicamentos;