import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import moment from 'moment';
import 'moment/locale/es';
import { listPatients } from "../../services/PacienteService";

moment.locale('es'); 

const ListPacientes = () => {
  const [pacientes, setPacientes] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { isOpen, open, close } = useModal();
  
  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    const response = await listPatients();
    if(response?.status === 200){
      setPacientes(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleShowInfoUser = data => {
    open();
    console.log(data)
    setPaciente(data);
  }
  
  const formatFechaNacimiento = (fecha) => {
    if (!fecha) return 'N/A';
    return moment(fecha).format('LL'); 
  };

  const getEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const nacimientoMoment = moment(fechaNacimiento);
    const hoyMoment = moment();
    return hoyMoment.diff(nacimientoMoment, 'years');
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-[#374957] mb-6">
          Lista de Pacientes
        </h1>
        <div className="overflow-x-auto">
          {
            pacientes !== null && !loading ?
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-[#6D8AFD] text-white">
                    <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Apellido
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Identificación
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
                      <td className="px-6 py-4">{paciente.apellido}</td>
                      <td className="px-6 py-4">{paciente.identificacion}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                            className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer">
                            <i className="fa-solid fa-pencil text-xl"></i>
                        </button>
                        <button
                            className="text-red-600 hover:text-red-400 transition-all cursor-pointer">
                            <i class="fa-solid fa-trash text-xl"></i>
                        </button>
                        <button
                            className="text-green-600 hover:text-green-400 transition-all cursor-pointer"
                            onClick={() => handleShowInfoUser(paciente)}>
                            <i className="fa-solid fa-eye text-xl"></i>
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
      <AnimatedModal isOpen={isOpen} close={close} style={{maxWidth: "500px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll"}}>
        {
          paciente !== null ? (
            <div className="flex flex-col items-center">
              {
                paciente.imagen_paciente ? <img src={paciente.imagen_paciente} alt="Imagen de perfil" className="rounded-full max-w-[150px] aspect-square" /> : <img src="/images/avatar.png" alt="Imagen de perfil" className="rounded-full max-w-[150px]" />
              }

              <div className="flex flex-col space-y-2 w-5/6 mt-3">
                {paciente.nombre && <div className="flex justify-between">
                  <p className="text-blue-500 font-semibold text-lg w-1/3">Nombre</p>
                  <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{paciente.nombre}</p>
                </div>}
                {paciente.apellido && <div className="flex justify-between">
                  <p className="text-blue-500 font-semibold text-lg w-1/3">Apellido</p>
                  <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{paciente.apellido}</p>
                </div>}
                {paciente.identificacion && <div className="flex justify-between">
                  <p className="text-blue-500 font-semibold text-lg w-1/3">Identificacion</p>
                  <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{paciente.identificacion}</p>
                </div>}
                {paciente.fecha_nacimiento && <div className="flex justify-between">
                  <p className="text-blue-500 font-semibold text-lg w-1/3">Fecha de Nacimiento</p>
                  <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">
                    {formatFechaNacimiento(paciente.fecha_nacimiento)}
                  </p>
                </div>}
                {paciente.fecha_nacimiento && <div className="flex justify-between">
                  <p className="text-blue-500 font-semibold text-lg w-1/3">Edad</p>
                  <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">
                    {getEdad(paciente.fecha_nacimiento)} años
                  </p>
                </div>}
                {paciente.diagnostico_principal && <div className="flex justify-between">
                  <p className="text-blue-500 font-semibold text-lg w-1/3">Diagnostico Principal</p>
                  <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{paciente.diagnostico_principal}</p>
                </div>}
                {paciente.sexo && <div className="flex justify-between">
                  <p className="text-blue-500 font-semibold text-lg w-1/3">Orientacion Sexual</p>
                  <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{paciente.sexo}</p>
                </div>}
                <div className="bg-gray-200 p-2 rounded-lg">
                  <p className="text-gray-500 font-semibold text-xl mb-2">Pertenece a:</p>
                  <div className="flex items-center">
                    <p className="text-cyan-700 text-lg mr-2">Nombre(s):</p>
                    <p className="text-gray-800 text-right">{paciente.usuario.nombre_usuario}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-cyan-700 text-lg mr-2">Apellido(s):</p>
                    <p className="text-gray-800 text-right">{paciente.usuario.apellido_usuario}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-cyan-700 text-lg mr-2">Correo:</p>
                    <p className="text-gray-800 text-right">{paciente.usuario.correo_usuario}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
      </AnimatedModal>
    </>
  );
};

export default ListPacientes;