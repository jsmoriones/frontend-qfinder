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
import { useAuth } from '../../context/PacienteContext/AuthContext';


const Medicamentos = () => {
    const [searchParams, setSearchParams] = useSearchParams(); // Hook para manejar los parámetros de la URL

    const [loading, setLoading] = useState(true);
    const [medications, setMedications] = useState(null);
    const [medicationEdit, setMedicationEdit] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [loadSave, setLoadSave] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const { isOpen, open, close } = useModal();

    const {logout} = useAuth();

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
            logout();
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
        setLoadSave(true);
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
        }finally{
            setLoadSave(false);
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

    const handleViewMedication = (medication) => {
        setSelectedMedication(medication);
        setIsViewOpen(true);
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
                                                    className="text-gray-600 hover:text-gray-400 transition-all cursor-pointer"
                                                    onClick={() => handleViewMedication(medication)}
                                                >
                                                    <i className="fa-solid fa-eye text-xl"></i>
                                                </button>
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
                        {/* Paginación estilo Google con números */}
                        {pagination && pagination.totalPages > 0 && (
                        <div className="flex flex-col items-center mt-6">
                            {/* <span className="text-md text-gray-700">
                            Mostrando <span className="font-semibold text-gray-600">
                                {(currentPageFromUrl - 1) * pagination.itemsPerPage + 1}
                            </span> a <span className="font-semibold text-gray-600">
                                {Math.min(currentPageFromUrl * pagination.itemsPerPage, pagination.totalItems)}
                            </span> de <span className="font-semibold text-gray-700">
                                {pagination.totalItems}
                            </span> Medicamentos
                            </span> */}

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
                            className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all'
                            disabled={loadSave}>
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
            <AnimatedModal
                isOpen={isViewOpen}
                close={() => setIsViewOpen(false)}
                style={{ maxWidth: "500px", width: "100%", marginTop: 20, marginBottom: 20 }}
            >
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center text-[#111111]">Detalles del Medicamento</h2>
                    {selectedMedication && (
                        <>
                            <div>
                                <h3 className="font-semibold text-gray-700">Nombre:</h3>
                                <p className="text-gray-900">{selectedMedication.nombre}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Descripción:</h3>
                                <p className="text-gray-900 break-words whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                                {selectedMedication.descripcion}
                                </p>
                            </div>
                        </>
                    )}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={() => setIsViewOpen(false)}
                            className="bg-grisAzul hover:bg-oscurity text-white px-4 py-2 rounded-lg transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </AnimatedModal>
        </>
    );
};

export default Medicamentos;