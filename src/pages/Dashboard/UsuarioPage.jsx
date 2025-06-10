import React, { useEffect, useState, useCallback } from 'react';
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import { useForm } from 'react-hook-form';
import StatusAlert, { StatusAlertService } from 'react-status-alert';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';

import { getUsers, registerUser, editUser, removeUser } from '../../services/UserService';
import { userSchema } from '../../schemas/users';
import { Input, Label } from '../../components/ui';

const UsuarioPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate(); // Hook para la navegación programática

    const [pacientes, setPacientes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEdit, setUserEdit] = useState(null);
    // Elimina currentPage de useState, ya que se manejará con searchParams
    // const [currentPage, setCurrentPage] = useState(1);
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

    // Sincronizar el formulario con los datos de edición
    useEffect(() => {
        if (userEdit) {
            reset(userEdit);
        } else {
            reset({});
        }
    }, [userEdit, reset]);

    // Obtener el número de página de la URL
    const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    // Usa useCallback para memoizar fetchPacientes y evitar recreaciones innecesarias
    const fetchPacientes = useCallback(async (pageNumber) => {
        setLoading(true); // Mostrar loader al iniciar la carga de pacientes
        try {
            const response = await getUsers(pageNumber); // Envía el número de página
            console.log(response.data);
            if (response?.status === 200) {
                setPacientes(response.data.data);
                setPagination(response.data.meta.pagination);
            } else {
                // Manejar errores si la API no devuelve 200
                console.error("Error al cargar pacientes:", response);
                setPacientes([]); // Vaciar pacientes en caso de error
                setPagination(null);
                StatusAlertService.showError("No se pudieron cargar los usuarios.");
            }
        } catch (error) {
            console.error("Error en fetchPacientes:", error);
            setPacientes([]); // Vaciar pacientes en caso de error
            setPagination(null);
            StatusAlertService.showError("Hubo un problema de conexión al cargar usuarios.");
        } finally {
            setLoading(false); // Ocultar loader al finalizar
        }
    }, []); // Dependencias vacías porque no depende de props o estados internos que cambien a menudo

    // Cargar pacientes cuando el componente se monta o la página de la URL cambia
    useEffect(() => {
        fetchPacientes(currentPageFromUrl);
    }, [currentPageFromUrl, fetchPacientes]); // Dependencia de currentPageFromUrl y fetchPacientes

    const handleSendData = async (data) => {
        try {
            let response;
            if (userEdit) {
                response = await editUser(data, userEdit.id_usuario);
                console.log("response de cuando edito el usuario: ", response);

                if (response.status === 500) {
                    close();
                    StatusAlertService.showError("Hubo un error en el servidor.");
                } else if (response.status === 200) {
                    close();
                    StatusAlertService.showSuccess("Usuario actualizado correctamente");
                    fetchPacientes(currentPageFromUrl); // Recargar la página actual
                    setUserEdit(null);
                }
            } else {
              alert("kiosndklasnfklsndfnsdkl")
                response = await registerUser(data);
                if (response.status === 200) {
                    reset({});
                    close();
                    fetchPacientes(currentPageFromUrl); // Recargar la página actual
                    StatusAlertService.showSuccess("Se registró correctamente el usuario");
                }
            }
            if (response.status === 400) {
                close();
                StatusAlertService.showWarning("Hubo un error, revisa tu información");
            }

        } catch (error) {
            close();
            console.error("Error al registrar o editar un usuario: ", error);
            StatusAlertService.showError("Hay un error desde el servidor.");
        }
    };

    const handleEditUser = data => {
        console.log("Usuario a editar: ", data);
        setUserEdit(data);
        open();
    };

    const handleRemoveUser = (id) => {
        console.log("Usuario a Eliminar: ", id);

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
                    fetchPacientes(currentPageFromUrl); // Recargar la página actual
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El usuario se eliminó correctamente",
                        icon: "success"
                    });
                } else {
                    StatusAlertService.showError("No se pudo eliminar el usuario.");
                }
            }
        });
    };

    // Funciones para manejar la navegación de paginación
    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
            setSearchParams({ page: pageNumber.toString() });
            // navigate(`?page=${pageNumber}`); // También puedes usar navigate directamente si prefieres
        }
    };

    const headerTableUser = ["nombre", "apellido", "identificacion", "direccion", "telefono", "correo", "estado", ""];

    return (
        <>
            <StatusAlert />
            <div className="p-8">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-2xl font-semibold text-[#374957]">
                        Lista de Usuarios
                    </h1>
                    <button
                        className='cursor-pointer bg-verdebtn py-1 px-2 rounded-lg text-white hover:bg-verde1 transition-all'
                        onClick={() => {
                            reset({});
                            setUserEdit(null);
                            open();
                        }}>
                        <i className="fa-solid fa-user-plus mr-2 text-lg"></i>
                        <span className='text-md'>Agregar Usuario</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <PuffLoader
                                size={120}
                                color={"#6D8AFD"}
                                loading={loading}
                                speedMultiplier={5}
                            />
                        </div>
                    ) : pacientes && pacientes.length > 0 ? (
                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr className="bg-[#6D8AFD] text-white">
                                    <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                                    {
                                        headerTableUser.map((item, key) => (
                                            <th className="px-6 py-3 text-left text-sm font-medium" key={key}>
                                                {item}
                                            </th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pacientes.map((paciente, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{(currentPageFromUrl - 1) * pagination.itemsPerPage + index + 1}</td>
                                            <td className="px-6 py-4">{paciente.nombre_usuario}</td>
                                            <td className="px-6 py-4">{paciente.apellido_usuario}</td>
                                            <td className="px-6 py-4">{paciente.identificacion_usuario}</td>
                                            <td className="px-6 py-4">{paciente.direccion_usuario}</td>
                                            <td className="px-6 py-4">{paciente.telefono_usuario?.substring(0, 10)}</td>
                                            <td className="px-6 py-4">{paciente.correo_usuario?.substring(0, 15)}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        paciente.estado_usuario === "Activo"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {paciente.estado_usuario}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer"
                                                    onClick={() => handleEditUser(paciente)}>
                                                    <i className="fa-solid fa-pencil text-xl"></i>
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-400 transition-all cursor-pointer"
                                                    onClick={() => handleRemoveUser(paciente.id_usuario)}>
                                                    <i className="fa-solid fa-trash text-xl"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex justify-center items-center h-48 text-gray-500">
                            No hay usuarios para mostrar.
                        </div>
                    )}

                    {/* Componente de Paginación */}
                    {pagination && pagination.totalPages > 0 && (
                        <div className="flex flex-col items-center mt-6">
                            <span className="text-md text-gray-700">
                                Mostrando <span className="font-semibold text-gray-600">
                                    {(currentPageFromUrl - 1) * pagination.itemsPerPage + 1}
                                </span> a <span className="font-semibold text-gray-600">
                                    {Math.min(currentPageFromUrl * pagination.itemsPerPage, pagination.totalItems)}
                                </span> de <span className="font-semibold text-gray-700">
                                    {pagination.totalItems}
                                </span> Usuarios
                            </span>

                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    className="flex items-center justify-center px-4 h-8 text-sm font-medium text-white bg-gray-800 rounded-l-md hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => goToPage(currentPageFromUrl - 1)}
                                    disabled={currentPageFromUrl === 1}
                                >
                                    Anterior
                                </button>
                                <button
                                    className="flex items-center justify-center px-4 h-8 text-sm font-medium text-white bg-gray-800 rounded-r-md hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => goToPage(currentPageFromUrl + 1)}
                                    disabled={currentPageFromUrl === pagination.totalPages}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
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

export default UsuarioPage;