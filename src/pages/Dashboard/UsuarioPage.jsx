import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import { useForm } from 'react-hook-form';
import StatusAlert, { StatusAlertService } from 'react-status-alert';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Swal from 'sweetalert2';

import { getUsers, registerUser, editUser, removeUser, buscarUsuario, listarAdmin } from '../../services/UserService';
import { userSchema, searchUser, userSchemaAct } from '../../schemas/users';
import { Input, Label } from '../../components/ui';
import moment from 'moment';
import { useAuth } from '../../context/PacienteContext/AuthContext';

const UsuarioPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEdit, setUserEdit] = useState(null);
    const [userView, setUserView] = useState(null);
    const [searchData, setSearchData] = useState(false);
    const [loadSave, setLoadSave] = useState(false);
    
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [pagination, setPagination] = useState(null);

    const { isOpen, open, close } = useModal();
    const { isOpen: isOpenView, open: openView, close: closeView } = useModal(); // NUEVO: modal ver info
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const {logout} = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(userEdit ? userSchemaAct : userSchema)
    });

    
    const {
        register: registerSeach,
        handleSubmit: handleSubmitSearch,
        formState: { errors: errorSearch },
        reset: resetSeach,
        watch
    } = useForm({
        resolver: zodResolver(searchUser)
    })
    const nombreUsuario = watch("nombre_usuario");

    useEffect(() => {
        if (nombreUsuario?.trim() === "") {
            console.log("El campo está vacío");
            fetchPacientes()
            // Aquí puedes resetear los resultados, mostrar mensaje, etc.
        } else {
        console.log("Texto:", nombreUsuario);
        // Aquí puedes ejecutar tu lógica de búsqueda
        }
    }, [nombreUsuario]);
    
    useEffect(() => {
        if (userEdit) reset({...userEdit, estado_suscripcion: userEdit.suscripcion?.estado || "", tipo_suscripcion: userEdit.suscripcion?.tipo || ""});
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
                setSearchData(false)
                setPacientes(response.data.data);
                setPagination(response.data.meta.pagination);
            } else {
                setPacientes([]);
                setPagination(null);
                StatusAlertService.showError("No se pudieron cargar los usuarios.");
            }
        } catch (error) {
            logout();
            console.log(error)
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
        setLoadSave(true);
        try {
            let response;
            if (userEdit) {
                response = await editUser({...data, imagen_usuario: "https://upload.wikimedia.org/wikipedia/commons/0/0b/2023-11-16_Gala_de_los_Latin_Grammy%2C_03_%28cropped%2901.jpg"}, userEdit.id_usuario);
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
                response = await registerUser({...data, tipo_usuario: "Usuario"});
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
        }finally {
            setLoadSave(false);
        }
    };

    const handleEditUser = data => {
        console.log("handleEditUser: ", data)
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
        setLoading(true)
        try {
            const response = await buscarUsuario(data)
            console.log(response.data.data)
            if(response.status === 200 && response.data.data.length > 0){
                setSearchData(true);
                setPacientes(response.data.data);
            }else{
                StatusAlertService.showInfo(`No existen registros con valor "${data.nombre_usuario}"`);
                fetchPacientes();
            }
        } catch (error) {
            console.log("Hubo un error al buscar el usuario: ", error);
        }finally{
            setSearchData(false);
            setLoading(false)
        }
    }

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
            setSearchParams({ page: pageNumber.toString() });
        }
    };

    const headerTableUser = ["nombre", "apellido", "identificacion", "correo", "estado", "tipo", ""];
    //const headerTableUser = ["nombre", "apellido", "identificacion", "correo", "direccion", "telefono", ""];

    return (
        <>
            <StatusAlert />
            <div className="p-8">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-2xl font-semibold text-[#374957]">Lista de Usuarios</h1>
                    <button className='bg-verdebtn py-1 px-2 rounded-lg text-white hover:bg-verde1 cursor-pointer' onClick={() => { reset({}); setUserEdit(null); open(); }}>
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
                                            <td className="px-6 py-4 text-center">{paciente.id_usuario}</td>
                                            <td className="px-6 py-4 text-center">{paciente.nombre_usuario}</td>
                                            <td className="px-6 py-4 text-center">{paciente.apellido_usuario}</td>
                                            <td className="px-6 py-4 text-center">{paciente.identificacion_usuario}</td>
                                            <td className="px-6 py-4 text-center">{paciente.correo_usuario}</td>
                                            {/* <td className="px-6 py-4 text-center">{paciente.direccion_usuario}</td>
                                            <td className="px-6 py-4 text-center">{paciente.telefono_usuario}</td> */}
                                            <td className="px-6 py-4">
                                                {paciente.suscripcion ? <span className={`
                                                    px-2 py-1 text-lg rounded-full text-center w-full block
                                                    ${paciente?.suscripcion.estado === "active" ? "bg-[#2ECC71]" : ""}
                                                    ${paciente?.suscripcion.estado === "pending" ? "bg-[#F1C40F]" : ""}
                                                    ${paciente?.suscripcion.estado === "paused" ? "bg-[#3498DB]" : ""}
                                                    ${paciente?.suscripcion.estado === "cancelled" ? "bg-[#E74C3C]" : ""}
                                                `}>
                                                    {paciente?.suscripcion.estado}
                                                </span> : <span className='px-2 py-1 text-lg rounded-full block text-center line-through'>Sin suscripcion</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {paciente.suscripcion ? <span className={`px-2 py-1 text-lg rounded-full block text-center`}>
                                                    {paciente?.suscripcion.tipo}
                                                </span> : <span className='px-2 py-1 text-lg rounded-full block text-center line-through'>Sin suscripcion</span>}
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

<div className="flex justify-between w-full items-center flex-wrap gap-4 mt-6">
  {/* Paginación estilo Google con números */}
{pagination && pagination.totalPages > 0 && (
  <div className="flex flex-col items-center mt-6">

    <div className="flex mt-4 space-x-1">
      {/* Botón Anterior */}
      <button
        onClick={() => goToPage(currentPageFromUrl - 1)}
        disabled={currentPageFromUrl === 1}
        className="px-3 py-1 mx-1 text-sm rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
      >
        Anterior
      </button>

      {/* Páginas dinámicas */}
      {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
        const startPage = Math.max(
          1,
          currentPageFromUrl - 2
        );
        const page = startPage + i;

        if (page > pagination.totalPages) return null;

        return (
          <button
            key={i}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 mx-1 text-sm rounded-md ${
              currentPageFromUrl === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Puntos suspensivos si hay más páginas */}
      {pagination.totalPages > 5 && currentPageFromUrl < pagination.totalPages - 2 && (
        <span className="px-3 py-1 mx-1 text-sm">...</span>
      )}

      {/* Última página si no está mostrada */}
      {pagination.totalPages > 5 &&
        currentPageFromUrl < pagination.totalPages - 1 && (
          <button
            onClick={() => goToPage(pagination.totalPages)}
            className="px-3 py-1 mx-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
          >
            {pagination.totalPages}
          </button>
        )}

      {/* Botón Siguiente */}
      <button
        onClick={() => goToPage(currentPageFromUrl + 1)}
        disabled={currentPageFromUrl === pagination.totalPages}
        className="px-3 py-1 mx-1 text-sm rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
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
                    {userEdit && <><div className="flex flex-col mb-3">
                        <Label htmlFor="estado_suscripcion">Estado de suscripción:</Label>
                        <select
                            name="estado_suscripcion"
                            id="estado_suscripcion"
                            {...register(
                                "estado_suscripcion",
                                { required: true }
                            )}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="active">Activa</option>
                            <option value="pending">Pendiente</option>
                            <option value="paused">En pausa</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                        {errors.estado_suscripcion?.message && (
                            <p className="text-red-500">{errors.estado_suscripcion?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="tipo_suscripcion">Tipo de suscripción:</Label>
                        <select
                            name="tipo_suscripcion"
                            id="tipo_suscripcion"
                            {...register(
                                "tipo_suscripcion",
                                { required: true }
                            )}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="free">Free</option>
                            <option value="plus">Plus</option>
                            <option value="pro">Pro</option>
                        </select>
                        {errors.tipo_suscripcion?.message && (
                            <p className="text-red-500">{errors.tipo_suscripcion?.message}</p>
                        )}
                    </div></>}
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
                            className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all' disabled={loadSave}>
                            {
                                loadSave ?
                                    <div className="w-full flex justify-center items-center">
                                        <svg ariaHidden="true" className="w-8 h-8 text-blue-100 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                    </div>
                                : <span className='text-md'>Aceptar</span>
                            }
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

export default UsuarioPage;