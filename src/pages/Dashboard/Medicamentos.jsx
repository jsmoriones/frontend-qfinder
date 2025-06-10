import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom'; // Importamos useSearchParams
import { PuffLoader } from 'react-spinners';
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import StatusAlert, { StatusAlertService } from 'react-status-alert';
import Swal from 'sweetalert2';

import { ButtonLarge } from '../../components/ui/ButtonLarge'; // Asegúrate de que esta ruta sea correcta
import { addMedication, editMedication, listMedications, removeMedication } from '../../services/MedicamentosService';
import { medicationSchema } from '../../schemas/medications';
import { Input, Label, TextArea } from '../../components/ui';


const Medicamentos = () => {
    const [searchParams, setSearchParams] = useSearchParams(); // Hook para manejar los parámetros de la URL

    const [loading, setLoading] = useState(true);
    const [medications, setMedications] = useState(null);
    const [medicationEdit, setMedicationEdit] = useState(null);
    const [pagination, setPagination] = useState(null); // Nuevo estado para la información de paginación

    const { isOpen, open, close } = useModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(medicationSchema)
    });

    // Obtener el número de página de la URL
    const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    // Usa useCallback para memoizar fetchMedicamentos
    const fetchMedicamentos = useCallback(async (pageNumber) => {
        setLoading(true); // Mostrar loader al iniciar la carga
        try {
            const response = await listMedications(pageNumber); // Envía el número de página al servicio
            console.log("fetchMedicamentos: ", response.data);
            if (response?.status === 200) {
                setMedications(response.data.data);
                setPagination(response.data.meta.pagination); // Asume que la API devuelve la paginación en `meta.pagination`
            } else {
                console.error("Error al cargar medicamentos:", response);
                setMedications([]); // Vaciar medicamentos en caso de error
                setPagination(null);
                StatusAlertService.showError("No se pudieron cargar los medicamentos.");
            }
        } catch (error) {
            console.error("Error en fetchMedicamentos:", error);
            setMedications([]); // Vaciar medicamentos en caso de error
            setPagination(null);
            StatusAlertService.showError("Hubo un problema de conexión al cargar medicamentos.");
        } finally {
            setLoading(false); // Ocultar loader al finalizar
        }
    }, []); // Dependencias vacías porque no depende de props o estados internos que cambien a menudo

    // Cargar medicamentos cuando el componente se monta o la página de la URL cambia
    useEffect(() => {
        fetchMedicamentos(currentPageFromUrl);
    }, [currentPageFromUrl, fetchMedicamentos]); // Dependencia de currentPageFromUrl y fetchMedicamentos

    // Sincronizar el formulario con los datos de edición
    useEffect(() => {
        if (medicationEdit) {
            reset(medicationEdit);
        } else {
            reset({});
        }
    }, [medicationEdit, reset]);


    const handleSendData = async (data) => {
        try {
            let response;
            if (medicationEdit) {
                response = await editMedication(data, medicationEdit.id_medicamento);
                if (response.status === 500) {
                    close();
                    StatusAlertService.showError("Hubo un error en el servidor.");
                } else if (response.status === 200) {
                    close();
                    StatusAlertService.showSuccess("Medicamento actualizado correctamente");
                    fetchMedicamentos(currentPageFromUrl); // Recargar la página actual
                    setMedicationEdit(null);
                }
            } else {
                response = await addMedication(data);
                if (response.status === 201) {
                    reset({});
                    close();
                    fetchMedicamentos(currentPageFromUrl); // Recargar la página actual
                    StatusAlertService.showSuccess("Se registró correctamente el medicamento");
                }
            }
            if (response.status === 400) {
                close();
                StatusAlertService.showWarning("Hubo un error, revisa tu información");
            }

        } catch (error) {
            close();
            console.log("Error al registrar o editar un medicamento: ", error);
            StatusAlertService.showError("Hay un error desde el servidor.");
        }
    };

    const handleEditMedication = (mdct) => {
        setMedicationEdit(mdct);
        open();
        reset(mdct);
    };

    const handleDeleteMedication = (id) => {
        Swal.fire({
            title: "¿Estás seguro de realizar esta acción?",
            text: "Si eliminas un medicamento no podrás volver a recuperarlo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, deseo borrarlo!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await removeMedication(id);
                if (response.status === 200) {
                    fetchMedicamentos(currentPageFromUrl); // Recargar la página actual
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El medicamento se eliminó correctamente",
                        icon: "success"
                    });
                } else {
                    StatusAlertService.showError("No se pudo eliminar el medicamento.");
                }
            }
        });
    };

    // Función para manejar la navegación de paginación
    const goToPage = (pageNumber) => {
        if (pagination && pageNumber >= 1 && pageNumber <= pagination.totalPages) {
            setSearchParams({ page: pageNumber.toString() });
        }
    };

    return (
        <>
            <StatusAlert />
            <div className="p-8">
                <div>
                    <h2 className="text-3xl font-bold mb-4">Lista de Medicamentos</h2>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <PuffLoader size={120} color={"#6D8AFD"} loading={loading} speedMultiplier={5} />
                            </div>
                        ) : medications && medications.length > 0 ? (
                            <table className="min-w-full border border-blue-500 rounded-lg bg-blue-100 text-center">
                                <thead className="bg-blue-400 text-white">
                                    <tr>
                                        <th className="px-4 py-2">#</th>
                                        <th className="px-4 py-2">Medicamento</th>
                                        <th className="px-4 py-2">Descripción</th>
                                        <th className="px-4 py-2">Tipo</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medications.map((medication, index) => (
                                        <tr key={medication.id_medicamento} className="bg-blue-50">
                                            <td className="px-4 py-2">{(currentPageFromUrl - 1) * pagination.itemsPerPage + index + 1}</td>
                                            <td className="px-4 py-2">{medication.nombre}</td>
                                            <td className="px-4 py-2">{medication.descripcion.substring(0, 50)}...</td>
                                            <td className="px-4 py-2">{medication.tipo}</td>
                                            <td className="px-6 py-4 space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer"
                                                    onClick={() => handleEditMedication(medication)}>
                                                    <i className="fa-solid fa-pencil text-xl"></i>
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-400 transition-all cursor-pointer"
                                                    onClick={() => handleDeleteMedication(medication.id_medicamento)}>
                                                    <i className="fa-solid fa-trash text-xl"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex justify-center items-center h-48 text-gray-500">
                                No hay medicamentos para mostrar.
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
                                    </span> Medicamentos
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

                    {/* Botón agregar medicamento */}
                    <div className="mt-6 flex justify-center">
                        <ButtonLarge text="Agregar medicamento" onClick={() => { setMedicationEdit(null); reset({}); open(); }} />
                    </div>
                </div>
            </div>
            <AnimatedModal isOpen={isOpen} close={close} style={{ maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20 }}>
                <h1 className="text-lg md:text-2xl text-[#111111] font-semibold text-center">{medicationEdit ? "Editar Medicamento" : "Agregar Medicamento"}</h1>
                <form className='mt-10 lg:mt-14' onSubmit={handleSubmit(handleSendData)}>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="nombre">Nombre de medicamento:</Label>
                        <Input
                            type="text"
                            id="nombre"
                            name="nombre"
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
                        <Label htmlFor="descripcion">Descripción del medicamento:</Label>
                        <TextArea
                            id="descripcion"
                            name="descripcion"
                            {...register(
                                "descripcion",
                                { required: true }
                            )}
                            autoFocus
                        />
                        {errors.descripcion?.message && (
                            <p className="text-red-500">{errors.descripcion?.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col mb-3">
                        <Label htmlFor="tipo">Tipo de medicamento:</Label> {/* Changed text for clarity */}
                        <select
                            name="tipo"
                            id="tipo"
                            className={"border-1 border-gray-500"}
                            {...register(
                                "tipo",
                                { required: true }
                            )}
                        >
                            <option value="">--- Seleccionar ---</option> {/* Added value="" for default */}
                            {
                                ['psiquiatrico', 'neurologico', 'general', 'otro'].map((ot, key) => (
                                    <option value={ot} key={key}>{ot}</option>
                                ))
                            }
                        </select>
                        {errors.tipo?.message && (
                            <p className="text-red-500">{errors.tipo?.message}</p>
                        )}
                    </div>
                    <div className="flex w-full justify-end space-x-2">
                        <button
                            type="submit"
                            className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all'>
                            <span className='text-md'>Aceptar</span>
                        </button>
                        <button
                            type="button"
                            className='cursor-pointer bg-rojobtn py-2 px-3 rounded-lg text-white hover:bg-rojo1 transition-all'
                            onClick={() => {
                                reset();
                                close();
                                setMedicationEdit(null); // Importante para limpiar el estado de edición al cerrar
                            }}>
                            <span className='text-md'>Cancelar</span>
                        </button>
                    </div>
                </form>
            </AnimatedModal>
        </>
    );
};

export default Medicamentos;