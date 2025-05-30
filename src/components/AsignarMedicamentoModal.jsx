import React from 'react';

const AsignarMedicamentoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Modal activo</h2>
        <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default AsignarMedicamentoModal;
