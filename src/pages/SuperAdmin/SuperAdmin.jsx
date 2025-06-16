import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import { useForm } from 'react-hook-form';
import StatusAlert, { StatusAlertService } from 'react-status-alert';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Swal from 'sweetalert2';

import { getUsers, registerUser, editUser, removeUser, buscarUsuario } from '../../services/UserService';
import { userSchema, searchUser } from '../../schemas/users';
import { Input, Label } from '../../components/ui';
import moment from 'moment';

const SuperAdmin = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEdit, setUserEdit] = useState(null);
    const [userView, setUserView] = useState(null); // NUEVO: usuario para ver info
    
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [pagination, setPagination] = useState(null);

    const { isOpen, open, close } = useModal();
    const { isOpen: isOpenView, open: openView, close: closeView } = useModal(); // NUEVO: modal ver info
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(userSchema)
    });

    const {
      register: registerSeach,
      handleSubmit: handleSubmitSearch,
      formState: { errors: errorSearch },
      reset: resetSeach
    } = useForm({
      resolver: zodResolver(searchUser)
    })

    useEffect(() => {
        if (userEdit) reset(userEdit);
        else reset({});
    }, [userEdit, reset]);

    const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    const handleLogout = () => {
      // Aquí puedes limpiar almacenamiento local o tokens
      navigate('/login');
    };
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchPacientes = useCallback(async (pageNumber) => {
        setLoading(true);
        try {
            const response = await getUsers(pageNumber);
            if (response?.status === 200) {
                setPacientes(response.data.data);
                setPagination(response.data.meta.pagination);
            } else {
                setPacientes([]);
                setPagination(null);
                StatusAlertService.showError("No se pudieron cargar los usuarios.");
            }
        } catch (error) {
            setPacientes([]);
            setPagination(null);
            StatusAlertService.showError("Hubo un problema de conexión al cargar usuarios.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPacientes(currentPageFromUrl);
    }, [currentPageFromUrl, fetchPacientes]);

    const handleSendData = async (data) => {
        try {
            let response;
            if (userEdit) {
                response = await editUser(data, userEdit.id_usuario);
                if (response.status === 200) {
                    close();
                    StatusAlertService.showSuccess("Usuario actualizado correctamente");
                    fetchPacientes(currentPageFromUrl);
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
                    fetchPacientes(currentPageFromUrl);
                    StatusAlertService.showSuccess("Se registró correctamente el usuario");
                }
            }
            if (response.status === 400) {
                close();
                StatusAlertService.showWarning("Hubo un error, revisa tu información");
            }
        } catch (error) {
            close();
            StatusAlertService.showError("Hay un error desde el servidor.");
        }
    };

    const handleEditUser = data => {
        setUserEdit(data);
        open();
    };

    const handleRemoveUser = (id) => {
        Swal.fire({
            title: "¿Estás seguro de realizar esta acción?",
            text: "Si eliminas un usuario no podrás volver a recuperarlo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, deseo borrarlo!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await removeUser(id);
                if (response.status === 200) {
                    fetchPacientes(currentPageFromUrl);
                    Swal.fire("¡Eliminado!", "El usuario se eliminó correctamente", "success");
                } else {
                    StatusAlertService.showError("No se pudo eliminar el usuario.");
                }
            }
        });
    };

    const handleShowInfoUser = (usuario) => {
        setUserView(usuario);
        openView();
    };

    const hanldeSearchUser = async (data) => {
      try {
        const response = await buscarUsuario(data)
        console.log(response)
      } catch (error) {
        console.log("Hubo un error al buscar el usuario: ", error);
      }
    }

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
            setSearchParams({ page: pageNumber.toString() });
        }
    };

    const headerTableUser = ["nombre", "apellido", "identificacion", "correo", "estado", "tipo", ""];

    return (
        <>
            <StatusAlert />
            <header className="w-full bg-white shadow px-6 py-4 flex justify-end items-center">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition"
        >
          SuperAdmin
          <ChevronDown className="ml-2 w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow z-50">
            <button
              onClick={() => navigate('/mi-perfil')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
            >
              <User className="w-4 h-4 mr-2 text-blue-600" /> Ver mi información
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
            <div className="p-8">

                <div className="flex items-center justify-center mx-auto w-3/12 mb-8">
                  <img src="/images/superAdminQfinder.png" alt="Imagen SuperAdmin"/>
                </div>

                <div className="mb-6 flex justify-between">
                    <h1 className="text-2xl font-semibold text-[#374957]">Lista de Usuarios</h1>
                    <button className='bg-verdebtn py-1 px-2 rounded-lg text-white hover:bg-verde1' onClick={() => { reset({}); setUserEdit(null); open(); }}>
                        <i className="fa-solid fa-user-plus mr-2"></i>Agregar Usuario
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <PuffLoader size={120} color="#6D8AFD" loading={loading} speedMultiplier={5} />
                        </div>
                    ) : pacientes && pacientes.length > 0 ? (
                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr className="bg-[#6D8AFD] text-white">
                                    <th className="px-6 py-3">#</th>
                                    {headerTableUser.map((item, key) => (
                                        <th key={key} className="px-6 py-3">{item}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.map((paciente, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{(currentPageFromUrl - 1) * pagination.itemsPerPage + index + 1}</td>
                                        <td className="px-6 py-4">{paciente.nombre_usuario}</td>
                                        <td className="px-6 py-4">{paciente.apellido_usuario}</td>
                                        <td className="px-6 py-4">{paciente.identificacion_usuario}</td>
                                        <td className="px-6 py-4">{paciente.correo_usuario?.substring(0, 15)}</td>
                                        <td className="px-6 py-4">
                                            {paciente.suscripcion ? <span className={`px-2 py-1 text-lg rounded-full`}>
                                                {paciente?.suscripcion.estado}
                                            </span> : "Sin suscripcion"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {paciente.suscripcion ? <span className={`px-2 py-1 text-lg rounded-full`}>
                                                {paciente?.suscripcion.tipo}
                                            </span> : "Sin suscripcion"}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button className="text-blue-600 cursor-pointer" onClick={() => handleEditUser(paciente)}><i className="fa-solid fa-pencil text-xl"></i></button>
                                            <button className="text-red-600 cursor-pointer" onClick={() => handleRemoveUser(paciente.id_usuario)}><i className="fa-solid fa-trash text-xl"></i></button>
                                            <button className="text-green-600 cursor-pointer" onClick={() => handleShowInfoUser(paciente)}><i className="fa-solid fa-eye text-xl"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex justify-center items-center h-48 text-gray-500">No hay usuarios para mostrar.</div>
                    )}

<div className="flex justify-between w-full items-center flex-wrap gap-4">
  {pagination && pagination.totalPages > 0 && (
    <div className="flex flex-col items-center mt-6">
      <span className="text-md text-gray-700">
        Mostrando <span className="font-semibold">{(currentPageFromUrl - 1) * pagination.itemsPerPage + 1}</span> a <span className="font-semibold">{Math.min(currentPageFromUrl * pagination.itemsPerPage, pagination.totalItems)}</span> de <span className="font-semibold">{pagination.totalItems}</span> Usuarios
      </span>
      <div className="inline-flex mt-2">
        <button
          onClick={() => goToPage(currentPageFromUrl - 1)}
          disabled={currentPageFromUrl === 1}
          className={`px-4 h-8 rounded-l-md font-medium ${
            currentPageFromUrl === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
        >
          Anterior
        </button>
        <button
          onClick={() => goToPage(currentPageFromUrl + 1)}
          disabled={currentPageFromUrl === pagination.totalPages}
          className={`px-4 h-8 rounded-r-md font-medium ${
            currentPageFromUrl === pagination.totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  )}

  <form className="w-full max-w-md" onSubmit={handleSubmitSearch(hanldeSearchUser)}>
    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
      Buscar
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-blue-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        id="default-search"
        className="block w-full p-3 ps-10 text-sm text-gray-800 placeholder-gray-500 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
        placeholder="Buscar usuarios..."
        {...registerSeach(
          "nombre_usuario",
          { required: true }
        )}
      />
      <button
        type="submit"
        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5"
        >
        Buscar
      </button>
    </div>
    {errorSearch.nombre_usuario?.message && (
      <p className="text-red-500">{errorSearch.nombre_usuario?.message}</p>
    )}
  </form>
</div>

                </div>
            </div>

            {/* MODAL PARA VER INFORMACIÓN DEL USUARIO */}
            <AnimatedModal isOpen={isOpenView} close={closeView} style={{ maxWidth: "500px", width: "100%", marginTop: 20, marginBottom: 20 }}>
                {userView && (
                    <div className="flex flex-col space-y-2 mt-3">
                        {userView.nombre_usuario && <div className="flex justify-between">
                            <p className="text-blue-500 font-semibold text-lg w-1/3">Nombre</p>
                            <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{userView.nombre_usuario}</p>
                        </div>}
                        {userView.apellido_usuario && <div className="flex justify-between">
                            <p className="text-blue-500 font-semibold text-lg w-1/3">Apellido</p>
                            <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{userView.apellido_usuario}</p>
                        </div>}
                        {userView.identificacion_usuario && <div className="flex justify-between">
                            <p className="text-blue-500 font-semibold text-lg w-1/3">Identificación</p>
                            <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{userView.identificacion_usuario}</p>
                        </div>}
                        {userView.direccion_usuario && <div className="flex justify-between">
                            <p className="text-blue-500 font-semibold text-lg w-1/3">Direccion</p>
                            <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{userView.direccion_usuario}</p>
                        </div>}
                        {userView.telefono_usuario && <div className="flex justify-between">
                            <p className="text-blue-500 font-semibold text-lg w-1/3">Telefono</p>
                            <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{userView.telefono_usuario}</p>
                        </div>}
                        {userView.correo_usuario && <div className="flex justify-between">
                            <p className="text-blue-500 font-semibold text-lg w-1/3">Correo</p>
                            <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{userView.correo_usuario}</p>
                        </div>}
                        {userView.estado_usuario && <div className="flex justify-between">
                            <p className="text-blue-500 font-semibold text-lg w-1/3">Estado</p>
                            <p className="text-gray-800 text-right w-2/3 flex flex-col justify-center">{userView.estado_usuario}</p>
                        </div>}
                        {userView.suscripcion ? (
                            <div className="bg-gray-100 p-3 rounded-lg w-full space-y-1">
                                <p className="font-semibold text-gray-600">Suscripción:</p>
                                <p><strong>Tipo:</strong> {userView.suscripcion.tipo}</p>
                                <p><strong>Estado:</strong> {userView.suscripcion.estado}</p>
                                <p><strong>Fecha Inicio:</strong> {moment(userView.suscripcion.fecha_inicio).format('LL')}</p>
                                <p><strong>Pacientes Permitidos:</strong> {userView.suscripcion.limite_pacientes}</p>
                                <p><strong>Cuidadores Permitidos:</strong> {userView.suscripcion.limite_cuidadores}</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">Este usuario no tiene suscripción activa.</p>
                        )}
                    </div>
                )}
            </AnimatedModal>

            <AnimatedModal isOpen={isOpen} close={close} style={{ maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll" }}>
                <h1 className="text-lg md:text-2xl text-[#111111] font-semibold text-center">{userEdit == null ? "Registrar usuario" : "Editar Usuario"}</h1>
                <form className='mt-10 lg:mt-14' onSubmit={handleSubmit(handleSendData)}>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="name">Nombre de usuario:</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            {...register(
                                "nombre_usuario",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.nombre_usuario?.message && (
                            <p className="text-red-500">{errors.nombre_usuario?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="lastName">Apellido de usuario:</Label>
                        <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            {...register(
                                "apellido_usuario",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.apellido_usuario?.message && (
                            <p className="text-red-500">{errors.apellido_usuario?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="identificacion">Identificación:</Label>
                        <Input
                            type="text"
                            id="identificacion"
                            name="identificacion"
                            {...register(
                                "identificacion_usuario",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.identificacion_usuario?.message && (
                            <p className="text-red-500">{errors.identificacion_usuario?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="direccion">Dirección residencial:</Label>
                        <Input
                            type="text"
                            id="direccion"
                            name="direccion"
                            {...register(
                                "direccion_usuario",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.direccion_usuario?.message && (
                            <p className="text-red-500">{errors.direccion_usuario?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="telefono">Teléfono del usuario:</Label>
                        <Input
                            type="text"
                            id="telefono"
                            name="telefono"
                            {...register(
                                "telefono_usuario",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.telefono_usuario?.message && (
                            <p className="text-red-500">{errors.telefono_usuario?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="email">Correo Electrónico:</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            {...register(
                                "correo_usuario",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.correo_usuario?.message && (
                            <p className="text-red-500">{errors.correo_usuario?.message}</p>
                        )}
                    </div>
                    {/* Solo muestra el campo de contraseña si no estamos editando un usuario */}
                    {!userEdit && (
                        <div className="flex flex-col mb-3">
                            <Label htmlFor="password">Contraseña:</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                {...register(
                                    "contrasena_usuario",
                                    { required: true }
                                )}
                                autoFocus
                            />
                            {errors.contrasena_usuario?.message && (
                                <p className="text-red-500">{errors.contrasena_usuario?.message}</p>
                            )}
                        </div>
                    )}
                    <div className="flex w-full justify-end space-x-2">
                        <button
                            type="submit" // Importante: el botón de submit debe ser de tipo "submit"
                            className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all'>
                            <span className='text-md'>Aceptar</span>
                        </button>
                        <button
                            type="button" // Importante: el botón de cancelar debe ser de tipo "button"
                            className='cursor-pointer bg-rojobtn py-2 px-3 rounded-lg text-white hover:bg-rojo1 transition-all'
                            onClick={() => {
                                close();
                                reset();
                                setUserEdit(null); // Limpiar userEdit al cancelar
                            }}>
                            <span className='text-md'>Cancelar</span>
                        </button>
                    </div>
                </form>
            </AnimatedModal>
        </>
    );
};

export default SuperAdmin;