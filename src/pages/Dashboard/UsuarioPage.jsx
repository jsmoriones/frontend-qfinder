import React, { useEffect, useState } from 'react';
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import { useForm } from 'react-hook-form';
import StatusAlert, { StatusAlertService } from 'react-status-alert';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import { getUsers, registerUser, editUser, removeUser } from '../../services/UserService';
import { userSchema } from '../../schemas/users';
import { Input, Label } from '../../components/ui';

const UsuarioPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get('page')) || 1;

  const [pacientes, setPacientes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEdit, setUserEdit] = useState(null);
  const [pagination, setPagination] = useState(null);

  const { isOpen, open, close } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(userSchema)
  });

  useEffect(() => {
    if (userEdit) {
      reset(userEdit);
    } else {
      reset({});
    }
  }, [userEdit, reset]);

  useEffect(() => {
    fetchPacientes();
  }, [page]); // Se vuelve a ejecutar al cambiar el número de página

  const fetchPacientes = async () => {
    setLoading(true);
    const response = await getUsers(page);
    if (response?.status === 200) {
      setPacientes(response.data.data);
      setPagination(response.data.meta.pagination);
      setLoading(false);
    }
  };

  const handleSendData = async (data) => {
    try {
      let response;
      if (userEdit) {
        response = await editUser(data, userEdit.id_usuario);
        if (response.status === 200) {
          close();
          StatusAlertService.showSuccess("Usuario actualizado correctamente");
          fetchPacientes();
          setUserEdit(null);
        } else {
          close();
          StatusAlertService.showError("Hubo un error en el servidor.");
        }
      } else {
        response = await registerUser(data);
        if (response.status === 200) {
          reset({});
          close();
          fetchPacientes();
          StatusAlertService.showSuccess("Se registró correctamente el usuario");
        }
      }

      if (response.status === 400) {
        close();
        StatusAlertService.showWarning("Hubo un error, revisa tu información");
      }
    } catch (error) {
      close();
      StatusAlertService.showError("Error desde el servidor.");
    }
  };

  const handleEditUser = (data) => {
    setUserEdit(data);
    open();
  };

  const handleRemoveUser = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Si eliminas un usuario no podrás volver a recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, deseo borrarlo",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await removeUser(id);
        if (response.status === 200) {
          fetchPacientes();
          Swal.fire("¡Eliminado!", "El usuario se eliminó correctamente", "success");
        }
      }
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const headerTableUser = ["nombre", "apellido", "identificacion", "direccion", "telefono", "correo", "estado", ""];

  return (
    <>
      <StatusAlert />
      <div className="p-8">
        <div className="mb-6 flex justify-between">
          <h1 className="text-2xl font-semibold text-[#374957]">Lista de Usuarios</h1>
          <button
            className='cursor-pointer bg-verdebtn py-1 px-2 rounded-lg text-white hover:bg-verde1 transition-all'
            onClick={() => {
              reset({});
              setUserEdit(null);
              open();
            }}
          >
            <i className="fa-solid fa-user-plus mr-2 text-lg"></i>
            <span className='text-md'>Agregar Usuario</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {pacientes !== null ? (
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-[#6D8AFD] text-white">
                  <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                  {headerTableUser.map((item, key) => (
                    <th className="px-6 py-3 text-left text-sm font-medium" key={key}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{paciente.nombre_usuario}</td>
                    <td className="px-6 py-4">{paciente.apellido_usuario}</td>
                    <td className="px-6 py-4">{paciente.identificacion_usuario}</td>
                    <td className="px-6 py-4">{paciente.direccion_usuario}</td>
                    <td className="px-6 py-4">{paciente.telefono_usuario.substring(0, 10)}</td>
                    <td className="px-6 py-4">{paciente.correo_usuario.substring(0, 15)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${paciente.estado_usuario === "Activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}>
                        {paciente.estado_usuario}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-400"
                        onClick={() => handleEditUser(paciente)}
                      >
                        <i className="fa-solid fa-pencil text-xl"></i>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-400"
                        onClick={() => handleRemoveUser(paciente.id_usuario)}
                      >
                        <i className="fa-solid fa-trash text-xl"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center">
              <PuffLoader size={120} color={"#6D8AFD"} loading={loading} speedMultiplier={5} />
            </div>
          )}

          {/* Paginación */}
          {pagination && (
            <div className="flex flex-col items-center mt-6">
              <span className="text-md text-gray-700">
                Mostrando <span className="font-semibold text-gray-600">{pagination.currentPage}</span> de{" "}
                <span className="font-semibold text-gray-700">{pagination.totalPages}</span> páginas
              </span>
              <div className="inline-flex mt-2">
                <button
                  className="px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900"
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Anterior
                </button>
                <button
                  className="px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-r hover:bg-gray-900"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Usuario */}
      <AnimatedModal isOpen={isOpen} close={close} style={{ maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20 }}>
        {/* ...Formulario como ya lo tienes... */}
      </AnimatedModal>
    </>
  );
};

export default UsuarioPage;
