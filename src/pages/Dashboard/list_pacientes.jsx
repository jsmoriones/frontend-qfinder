import React, { useEffect, useState } from "react";

const ListPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pacienteEditandoId, setPacienteEditandoId] = useState(null);

  const [nuevoPaciente, setNuevoPaciente] = useState({
    id_paciente: "",
    id_usuario: "101", // Simulado, vendría del login
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
      setPacientes((prevPacientes) =>
        prevPacientes.map((p) =>
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
    const confirmado = window.confirm("¿Estás seguro de eliminar este paciente?");
    if (confirmado) {
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
        <h1 className="text-2xl font-semibold text-[#374957]">
          Lista de Pacientes
        </h1>
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
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoPaciente.nombre}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={nuevoPaciente.Apellidos}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, Apellidos: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Identificación"
              value={nuevoPaciente.identificacion}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, identificacion: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={nuevoPaciente.fechaNacimiento}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, fechaNacimiento: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={nuevoPaciente.genero}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, genero: e.target.value })}
              className="p-2 border rounded"
            >
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
            <input
              type="number"
              placeholder="Edad"
              value={nuevoPaciente.edad}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, edad: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Diagnóstico"
              value={nuevoPaciente.diagnostico}
              onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, diagnostico: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="p-2 border rounded"
            />
          </div>
          {nuevoPaciente.imagenPreview && (
            <img
              src={nuevoPaciente.imagenPreview}
              alt="Vista previa"
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
              <th className="px-4 py-2">ID Paciente</th>
              <th className="px-4 py-2">ID Usuario</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellidos</th>
              <th className="px-4 py-2">Identificación</th>
              <th className="px-4 py-2">Fecha Nac.</th>
              <th className="px-4 py-2">Género</th>
              <th className="px-4 py-2">Edad</th>
              <th className="px-4 py-2">Diagnóstico</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Imagen</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p, i) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{i + 1}</td>
                <td className="px-4 py-2 text-center">{p.id_paciente}</td>
                <td className="px-4 py-2 text-center">{p.id_usuario}</td>
                <td className="px-4 py-2 text-center">{p.nombre}</td>
                <td className="px-4 py-2 text-center">{p.Apellidos}</td>
                <td className="px-4 py-2 text-center">{p.identificacion}</td>
                <td className="px-4 py-2 text-center">{p.fechaNacimiento}</td>
                <td className="px-4 py-2 text-center">{p.genero}</td>
                <td className="px-4 py-2 text-center">{p.edad}</td>
                <td className="px-4 py-2 text-center">{p.diagnostico}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    p.estado === "Activo"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {p.imagen && (
                    <img src={p.imagen} alt="Paciente" className="w-10 h-10 rounded-full mx-auto" />
                  )}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEditar(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id)}
                    className="text-red-600 hover:underline"
                  >
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
