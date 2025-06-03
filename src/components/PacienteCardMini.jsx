import React from 'react';

const PacienteCardMini = () => {
  return (
    <div className="w-64  bg-white rounded-xl p-4 flex flex-col items-center text-center
    " style={{
        boxShadow: '0px 8px 18px rgba(0, 0, 0, 0.20)'
      }}>
      {/* Imagen del paciente */}
      <img
        src="/images/avatar-paciente.png"
        alt="Paciente"
        className="w-20 h-20 rounded-full object-cover mb-3"
      />

      {/* Nombre */}
      <p className="text-lg font-bold text-black">Juan Carlos</p>

      {/* Diagnóstico */}
      <div className="text-sm text-gray-700 mt-1 leading-tight">
        <p>Diagnóstico</p>
        <p>Alzheimer</p>
      </div>
    </div>
  );
};

export default PacienteCardMini;
