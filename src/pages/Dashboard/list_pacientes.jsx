import React, { useEffect, useState, useCallback } from "react";
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import moment from 'moment';
import 'moment/locale/es';
import { useForm, Controller } from "react-hook-form"; // <-- ¡Importa Controller aquí!
import { zodResolver } from "@hookform/resolvers/zod";
import StatusAlert, { StatusAlertService } from 'react-status-alert';
import { useSearchParams } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

import { PacienteSchema } from "../../schemas/patient";
import { editPatient, listAllUsers, listPatients, registerPatient, removePatient } from "../../services/PacienteService";
import { Label, Input, TextArea } from "../../components/ui";

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase/firebase';
import Swal from "sweetalert2";
import { getUsers } from "../../services/UserService";

moment.locale('es');

const ListPacientes = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [pacientes, setPacientes] = useState(null);
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [users, setUsers] = useState(null);
    // const [selectedUser, setSelectedUser] = useState(null); // <-- ¡Ya no necesitas este estado!

    const { isOpen, open, close } = useModal();
    const { isOpen: isOpen2, open: open2, close: close2 } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control, // <-- ¡Importa control de useForm!
        setValue // <-- También es útil para establecer valores programáticamente
    } = useForm({
        resolver: zodResolver(PacienteSchema)
    });

    // Sincronizar el formulario con los datos de edición
    useEffect(() => {
        if (paciente) {
            console.log(paciente);
            reset(paciente);
            setCurrentImageUrl(paciente.imagen_paciente || null);

            // Si estás editando un paciente y ya tiene un usuario asignado (familiar)
            // Necesitas establecer el valor inicial del CreatableSelect
            if (paciente.id_usuario && users) {
                // Busca la opción correspondiente en tus datos transformados
                const initialSelectedUser = users.find(user => user.value === paciente.id_usuario);
                setValue('id_usuario', initialSelectedUser); // Establece el valor del campo 'id_usuario' en el formulario
            } else {
                setValue('id_usuario', null); // Asegúrate de que el select esté vacío si no hay usuario o no se encontraron los datos
            }
        } else {
            reset({});
            setCurrentImageUrl(null);
            setValue('id_usuario', null); // Limpiar el select cuando se agrega un nuevo paciente
        }
        setFileToUpload(null);
    }, [paciente, reset, users, setValue]); // Agrega `users` y `setValue` a las dependencias

    const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    const fetchPacientes = useCallback(async (pageNumber) => {
        setLoading(true);
        try {
            const response = await listPatients(pageNumber);
            if (response?.status === 200) {
                setPacientes(response.data.data);
                setPagination(response.data.meta.pagination);
            } else {
                console.error("Error al cargar pacientes:", response);
                setPacientes([]);
                setPagination(null);
                StatusAlertService.showError("No se pudieron cargar los pacientes.");
            }
        } catch (error) {
            console.error("Error en fetchPacientes:", error);
            setPacientes([]);
            setPagination(null);
            StatusAlertService.showError("Hubo un problema de conexión al cargar pacientes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPacientes(currentPageFromUrl);
    }, [currentPageFromUrl, fetchPacientes]);

    const handleShowInfoUser = data => {
        open();
        setPaciente(data);
    };

    const handleSendData = async data => {
        // En este punto, 'data.id_usuario' será el objeto seleccionado por react-select
        // Si necesitas solo el 'value' (que es tu id_usuario), accedes a data.id_usuario.value
        console.log("Datos del formulario a enviar:", data);
        console.log("ID del usuario para enviar:", data.id_usuario ? data.id_usuario.value : null);

        // Asegúrate de que el id_usuario que envías al servicio sea el valor, no el objeto completo
        const payload = {
            ...data
        };

        let finalImageUrl = payload.imagen_paciente;

        if (fileToUpload) {
            StatusAlertService.showAlert({
                type: 'info',
                message: 'Subiendo imagen del paciente...',
                showProgress: true,
                timeout: 0
            });

            try {
                const uploadRef = ref(storage, `imagenes_pacientes/${fileToUpload.name}`);
                const snapshot = await uploadBytes(uploadRef, fileToUpload);
                const url = await getDownloadURL(snapshot.ref);
                finalImageUrl = url;
                StatusAlertService.showSuccess("Imagen subida con éxito.");
            } catch (error) {
                console.error("Error al subir la imagen del paciente:", error);
                StatusAlertService.showError(`Error al subir imagen: ${error.message}`);
                return;
            }
        }

        payload.imagen_paciente = finalImageUrl;

        let response;
        try {
            if (paciente) {
                response = await editPatient(payload, paciente.id_paciente); // Usa payload
                if (response.status === 500) {
                    close2();
                    StatusAlertService.showError("Hubo un error en el servidor.");
                } else if (response.status === 200) {
                    close2();
                    StatusAlertService.showSuccess("Paciente actualizado correctamente");
                    fetchPacientes(currentPageFromUrl);
                    setPaciente(null);
                }
            } else {
                response = await registerPatient(payload); // Usa payload
                if (response.status === 201) {
                    reset({});
                    close2();
                    fetchPacientes(currentPageFromUrl);
                    StatusAlertService.showSuccess("Se registró correctamente el usuario");
                }
            }
            if (response.status === 400) {
                close2();
                StatusAlertService.showWarning("Hubo un error, revisa tu información");
            }
        } catch (error) {
            close2();
            console.error("Error al registrar o editar un paciente: ", error);
            StatusAlertService.showError("Hay un error desde el servidor.");
        }
    };

    const handleEditPatient = data => {
        open2();
        setPaciente(data);
        // `reset(data)` ya se encarga de rellenar los campos básicos
        // La lógica para el select se manejará en el `useEffect`
    };

    const handleRemovePatient = async id => {
        console.log("Paciente a Eliminar: ", id);

        Swal.fire({
            title: "¿Estás seguro de realizar esta acción?",
            text: "Si eliminas un paciente no podrás volver a recuperarlo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, deseo borrarlo!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await removePatient(id);
                if (response.status === 200) {
                    fetchPacientes(currentPageFromUrl);
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El paciente se eliminó correctamente",
                        icon: "success"
                    });
                } else {
                    StatusAlertService.showError("No se pudo eliminar el paciente.");
                }
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileToUpload(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setCurrentImageUrl(event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFileToUpload(null);
            if (!paciente?.imagen_paciente) {
                setCurrentImageUrl(null);
            }
        }
    };

    const formatFechaNacimiento = (fecha) => {
        if (!fecha) return 'N/A';
        return moment(fecha).format('LL');
    };

    const fetchUsers = async () => {
        let response = await listAllUsers();
        if (response.status === 200) {
            const transformedUsers = response.data.map(user => ({
                value: user.id_usuario,
                label: user.nombre_usuario + " " + user.apellido_usuario,
                id_usuario: user.id_usuario
            }));
            setUsers(transformedUsers);
        } else {
            setUsers(null);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Ya no necesitas un handleSelectChange separado para el estado,
    // Controller se encarga de eso.
    // La función que tenías aquí era para el estado local, no para `react-hook-form`.

    const getEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 'N/A';
        const nacimientoMoment = moment(fechaNacimiento);
        const hoyMoment = moment();
        return hoyMoment.diff(nacimientoMoment, 'years');
    };

    const goToPage = (pageNumber) => {
        if (pagination && pageNumber >= 1 && pageNumber <= pagination.totalPages) {
            setSearchParams({ page: pageNumber.toString() });
        }
    };

    return (
        <>
            <StatusAlert />
            <div className="p-6">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-2xl font-semibold text-[#374957]">Lista de Pacientes</h1>
                    <button
                        className='cursor-pointer bg-verdebtn py-1 px-2 rounded-lg text-white hover:bg-verde1 transition-all'
                        onClick={() => {
                            reset({});
                            setPaciente(null);
                            open2();
                        }}>
                        <i className="fa-solid fa-user-plus mr-2 text-lg"></i>
                        <span className='text-md'>Agregar Paciente</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <PuffLoader size={120} color={"#6D8AFD"} loading={loading} speedMultiplier={5} />
                        </div>
                    ) : pacientes && pacientes.length > 0 ? (
                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr className="bg-[#6D8AFD] text-white">
                                    <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Nombre</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Apellido</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Identificación</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.map((p, index) => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{(currentPageFromUrl - 1) * pagination.itemsPerPage + index + 1}</td>
                                        <td className="px-6 py-4 font-medium">{p.nombre}</td>
                                        <td className="px-6 py-4">{p.apellido}</td>
                                        <td className="px-6 py-4">{p.identificacion}</td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button onClick={() => handleEditPatient(p)} className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer">
                                                <i className="fa-solid fa-pencil text-xl"></i>
                                            </button>
                                            <button
                                                onClick={() => handleRemovePatient(p.id_paciente)}
                                                className="text-red-600 hover:text-red-400 transition-all cursor-pointer">
                                                <i className="fa-solid fa-trash text-xl"></i>
                                            </button>
                                            <button onClick={() => handleShowInfoUser(p)} className="text-green-600 hover:text-green-400 transition-all cursor-pointer">
                                                <i className="fa-solid fa-eye text-xl"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex justify-center items-center h-48 text-gray-500">
                            No hay pacientes para mostrar.
                        </div>
                    )}

                    {pagination && pagination.totalPages > 0 && (
                        <div className="flex flex-col items-center mt-6">
                            <span className="text-md text-gray-700">
                                Mostrando <span className="font-semibold text-gray-600">
                                    {(currentPageFromUrl - 1) * pagination.itemsPerPage + 1}
                                </span> a <span className="font-semibold text-gray-600">
                                    {Math.min(currentPageFromUrl * pagination.itemsPerPage, pagination.totalItems)}
                                </span> de <span className="font-semibold text-gray-700">
                                    {pagination.totalItems}
                                </span> Pacientes
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

            <AnimatedModal isOpen={isOpen} close={close} style={{ maxWidth: "500px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll" }}>
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
                                {paciente.usuario && (
                                    <div className="bg-gray-200 p-2 rounded-lg">
                                        <p className="text-gray-500 font-semibold text-xl mb-2">Pertenece a:</p>
                                        <div className="flex items-center">
                                            <p className="text-cyan-700 text-lg mr-2">Nombre(s):</p>
                                            <p className="text-gray-800 text-right">{paciente.usuario.nombre}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-cyan-700 text-lg mr-2">Apellido(s):</p>
                                            <p className="text-gray-800 text-right">{paciente.usuario.apellido}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-cyan-700 text-lg mr-2">Correo:</p>
                                            <p className="text-gray-800 text-right">{paciente.usuario.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null
                }
            </AnimatedModal>
            <AnimatedModal isOpen={isOpen2} close={close2} style={{ maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll" }}>
                <h1 className="text-lg md:text-2xl text-[#111111] font-semibold text-center">{paciente == null ? "Registrar paciente" : "Editar paciente"}</h1>
                <form className='mt-6' onSubmit={handleSubmit(handleSendData)}>

                    <div className="flex flex-col items-center max-w-[150px] mx-auto mb-6 relative">
                        <img src={currentImageUrl || "/images/avatar.png"} alt="Imagen de perfil" className="rounded-full aspect-square w-full" />
                        {paciente && <label htmlFor="imagen_paciente_file" className="absolute bottom-0 right-0 cursor-pointer">
                            <i className="fa-solid fa-camera text-xl text-white bg-gray-600 aspect-square rounded-full p-2 hover:scale-105 transition-all"></i>
                            <input type="file" id="imagen_paciente_file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="familiar">Seleccionar Familiar:</Label>
                        <Controller
                            name="id_usuario" // <--- ¡Importante que este sea el nombre correcto que Zod espera!
                            control={control}
                            rules={{ required: true }} // Si el campo es requerido
                            render={({ field }) => (
                                <CreatableSelect
                                    {...field} // Esto pasa value, onChange, onBlur a CreatableSelect
                                    id="familiar"
                                    isClearable
                                    options={users} // Asegúrate de que 'users' tiene 'value' y 'label'
                                    placeholder="Busca un usuario..."
                                    noOptionsMessage={() => "No hay usuarios disponibles"}
                                />
                            )}
                        />
                        {errors.id_usuario?.message && (
                            <p className="text-red-500">{errors.id_usuario?.message}</p>
                        )}
                        {/* Puedes agregar un mensaje de error personalizado si es requerido */}
                        {errors.id_usuario && errors.id_usuario.type === "required" && (
                            <p className="text-red-500">Este campo es requerido.</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="name">Nombre de paciente:</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            {...register(
                                "nombre",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.nombre?.message && (
                            <p className="text-red-500">{errors.nombre?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="apellido">Apellido de apellido:</Label>
                        <Input
                            type="text"
                            id="apellido"
                            name="apellido"
                            {...register(
                                "apellido",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.apellido?.message && (
                            <p className="text-red-500">{errors.apellido?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="identificacion">Identificación:</Label>
                        <Input
                            type="text"
                            id="identificacion"
                            name="identificacion"
                            {...register(
                                "identificacion",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.identificacion?.message && (
                            <p className="text-red-500">{errors.identificacion?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fecha_nacimiento">Fecha de nacimiento:</Label>
                        <Input
                            type="date"
                            id="fecha_nacimiento"
                            name="fecha_nacimiento"
                            {...register(
                                "fecha_nacimiento",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.fecha_nacimiento && (
                            <p className="text-red-500">{errors.fecha_nacimiento?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col my-3">
                        <Label htmlFor="sexo">Género:</Label>
                        <select
                            name="sexo"
                            id="sexo"
                            {...register(
                                "sexo",
                                { required: true }
                            )}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                            <option value="prefiero_no_decir">Prefiero no decir</option>
                        </select>
                        {errors.sexo?.message && (
                            <p className="text-red-500">{errors.sexo?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="diagnostico_principal">Diagnóstico Principal:</Label>
                        <TextArea
                            {...register(
                                "diagnostico_principal",
                                { required: true }
                            )}
                            id="diagnostico_principal"
                        />
                        {errors.diagnostico_principal?.message && (
                            <p className="text-red-500">{errors.diagnostico_principal?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="autonomia">Nivel de Autonomía:</Label>
                        <select
                            name="autonomia"
                            id="autonomia"
                            className="text-center w-full"
                            {...register(
                                "nivel_autonomia",
                                { required: true }
                            )}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="alta">Alta</option>
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                        </select>
                        {errors.autonomia?.message && (
                            <p className="text-red-500">{errors.autonomia?.message}</p>
                        )}
                    </div>
                    <div className="flex w-full justify-end space-x-2 mt-6">
                        <button type="submit" className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all'>
                            <span className='text-md'>Aceptar</span>
                        </button>
                        <button
                            type="button"
                            className='cursor-pointer bg-rojobtn py-2 px-3 rounded-lg text-white hover:bg-rojo1 transition-all'
                            onClick={() => {
                                close2();
                                reset();
                                setPaciente(null);
                                setFileToUpload(null);
                                setCurrentImageUrl(null);
                            }}>
                            <span className='text-md'>Cancelar</span>
                        </button>
                    </div>
                </form>
            </AnimatedModal>
        </>
    );
};

export default ListPacientes;