import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ListPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pacienteEditandoId, setPacienteEditandoId] = useState(null);
  const [modalPaciente, setModalPaciente] = useState(null);

  const [nuevoPaciente, setNuevoPaciente] = useState({
    id_paciente: "",
    id_usuario: "101",
    nombre: "",
    Apellidos: "",
    identificacion: "",
    fechaNacimiento: "",
    genero: "Masculino",
    edad: "",
    diagnostico: "",
    estado: "Activo",
    imagen: null,
    imagenPreview: null,
  });

  const handleAgregar = () => {
    if (
      !nuevoPaciente.nombre ||
      !nuevoPaciente.Apellidos ||
      !nuevoPaciente.identificacion ||
      !nuevoPaciente.fechaNacimiento ||
      !nuevoPaciente.genero ||
      !nuevoPaciente.diagnostico
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (modoEdicion) {
      setPacientes((prev) =>
        prev.map((p) =>
          p.id === pacienteEditandoId
            ? {
                ...p,
                ...nuevoPaciente,
                edad: parseInt(nuevoPaciente.edad),
                imagen: nuevoPaciente.imagenPreview || p.imagen,
              }
            : p
        )
      );
    } else {
      const nuevo = {
        ...nuevoPaciente,
        id: pacientes.length > 0 ? pacientes[pacientes.length - 1].id + 1 : 1,
        id_paciente: Date.now().toString(),
        edad: parseInt(nuevoPaciente.edad),
        imagen: nuevoPaciente.imagenPreview,
      };
      setPacientes([...pacientes, nuevo]);
    }

    setNuevoPaciente({
      id_paciente: "",
      id_usuario: "101",
      nombre: "",
      Apellidos: "",
      identificacion: "",
      fechaNacimiento: "",
      genero: "Masculino",
      edad: "",
      diagnostico: "",
      estado: "Activo",
      imagen: null,
      imagenPreview: null,
    });

    setShowForm(false);
    setModoEdicion(false);
    setPacienteEditandoId(null);
  };

  const handleEditar = (paciente) => {
    setNuevoPaciente({
      ...paciente,
      imagenPreview: paciente.imagen,
    });
    setModoEdicion(true);
    setShowForm(true);
    setPacienteEditandoId(paciente.id);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este paciente?")) {
      setPacientes(pacientes.filter((p) => p.id !== id));
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoPaciente((prev) => ({
          ...prev,
          imagen: file,
          imagenPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[#374957]">Lista de Pacientes</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Agregar Paciente
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded bg-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={nuevoPaciente.nombre}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })}
              className="p-2 border rounded"
            />
            <input type="text" placeholder="Apellidos" value={nuevoPaciente.Apellidos}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, Apellidos: e.target.value })}
              className="p-2 border rounded"
            />
            <input type="text" placeholder="Identificación" value={nuevoPaciente.identificacion}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, identificacion: e.target.value })}
              className="p-2 border rounded"
            />
            <input type="date" value={nuevoPaciente.fechaNacimiento}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, fechaNacimiento: e.target.value })}
              className="p-2 border rounded"
            />
            <select value={nuevoPaciente.genero}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, genero: e.target.value })}
              className="p-2 border rounded"
            >
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
            <input type="number" placeholder="Edad" value={nuevoPaciente.edad}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, edad: e.target.value })}
              className="p-2 border rounded"
            />
            <input type="text" placeholder="Diagnóstico" value={nuevoPaciente.diagnostico}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, diagnostico: e.target.value })}
              className="p-2 border rounded"
            />
            <input type="file" accept="image/*" onChange={handleImagenChange}
              className="p-2 border rounded"
            />
          </div>
          {nuevoPaciente.imagenPreview && (
            <img src={nuevoPaciente.imagenPreview} alt="Vista previa"
              className="mt-4 w-32 h-32 object-cover rounded"
            />
          )}
          <button
            onClick={handleAgregar}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            {modoEdicion ? "Actualizar Paciente" : "Guardar Paciente"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-[#6D8AFD] text-white">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellidos</th>
              <th className="px-4 py-2">Identificación</th>
              <th className="px-4 py-2">Diagnóstico</th>
              <th className="px-4 py-2">Imagen</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p, i) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{i + 1}</td>
                <td className="px-4 py-2 text-center">{p.nombre}</td>
                <td className="px-4 py-2 text-center">{p.Apellidos}</td>
                <td className="px-4 py-2 text-center">{p.identificacion}</td>
                <td className="px-4 py-2 text-center">{p.diagnostico}</td>
                <td className="px-4 py-2 text-center">
                  {p.imagen && (
                    <img src={p.imagen} alt="Paciente" className="w-10 h-10 rounded-full mx-auto" />
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    p.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button onClick={() => setModalPaciente(p)} className="text-purple-600 hover:text-purple-800">
                    <FaEye className="inline w-5 h-5" title="Ver Detalles" />
                  </button>
                  <button onClick={() => handleEditar(p)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="inline w-5 h-5" title="Editar" />
                  </button>
                  <button onClick={() => handleEliminar(p.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash className="inline w-5 h-5" title="Eliminar" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalPaciente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">Detalles del Paciente</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>ID Paciente:</strong> {modalPaciente.id_paciente}</p>
              <p><strong>ID Usuario:</strong> {modalPaciente.id_usuario}</p>
              <p><strong>Nombre:</strong> {modalPaciente.nombre}</p>
              <p><strong>Apellidos:</strong> {modalPaciente.Apellidos}</p>
              <p><strong>Identificación:</strong> {modalPaciente.identificacion}</p>
              <p><strong>Fecha Nacimiento:</strong> {modalPaciente.fechaNacimiento}</p>
              <p><strong>Género:</strong> {modalPaciente.genero}</p>
              <p><strong>Edad:</strong> {modalPaciente.edad}</p>
              <p><strong>Diagnóstico:</strong> {modalPaciente.diagnostico}</p>
              <p><strong>Estado:</strong> {modalPaciente.estado}</p>
              {modalPaciente.imagen && (
                <div className="col-span-2">
                  <strong>Imagen:</strong>
                  <img src={modalPaciente.imagen} alt="Paciente" className="w-24 h-24 object-cover rounded mt-1" />
                </div>
              )}
            </div>
            <button
              onClick={() => setModalPaciente(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPacientes;
