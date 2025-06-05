import React, { useEffect, useState } from 'react';
import PacienteCardMini from '../../components/PacienteCardMini';
import { ButtonLarge } from '../../components/ui/ButtonLarge';
import { addMedication, editMedication, listMedications, removeMedication } from '../../services/MedicamentosService';
import { PuffLoader } from 'react-spinners';
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { medicationSchema } from '../../schemas/medications';
import { Input, Label, TextArea } from '../../components/ui';
import StatusAlert, { StatusAlertService } from 'react-status-alert';
import Swal from 'sweetalert2';


const Medicamentos = () => {
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState(null);
  const [medicationEdit, setMedicationEdit] = useState(null);

  

  const { isOpen, open, close } = useModal();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm({
    resolver: zodResolver(medicationSchema)
  });

  const fetchMedicamentos = async () => {
    try {
      const response = await listMedications();
      console.log(response)
      if(response?.status === 200){
        setLoading(false);
        setMedications(response.data);
      }
    } catch (error) {
      console.log("Error al realizar el fetch a medicamentos: ", error);
    }
  }

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const handleSendData = async (data) => {
    console.log("kllasndklansdknsald: ", medicationEdit)
    try {
      let response; //await registerUser(data);
      if(medicationEdit){
        response = await editMedication(data, medicationEdit.id_medicamento);
        console.log("response de cuando edito el usuario: ", response)
        if(response.status === 500){
            close();
            StatusAlertService.showError("Hubo un error en el servidor.");
        }else if(response.status === 200){
            close();
            StatusAlertService.showSuccess("Usuario actualizado correctamente");
            fetchMedicamentos();
            setMedicationEdit(null)
        }
      }else{
        response = await addMedication(data);
        if(response.status === 201){
          reset({});
          close();
          fetchMedicamentos();
          StatusAlertService.showSuccess("Se registro correctamente el medicamento");
        }
      }
      if(response.status === 400){
        close();
        StatusAlertService.showWarning("Hubo un error, revisa tu informacion");
      }

    } catch (error) {
      close();
      console.log("Error al registrar un medicamento: ", error);
      StatusAlertService.showError("Hay un error desde el servidor.");
    }
  }

  const handleEditMedication = (mdct) => {
    setMedicationEdit(mdct);
    open();
    reset(mdct)
  }

  const handleDeleteMedication = (id) => {
    console.log("ID medicamento: ", id)
    Swal.fire({
      title: "¿Estas seguro de realizar esta acción?",
      text: "Si eliminas un medicamento no podrás volver a recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, deseo borrarlo!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if(result.isConfirmed){
        const response = await removeMedication(id);
        console.log(response)
        if(response.status === 200){
          fetchMedicamentos();
          Swal.fire({
              title: "¡Eliminado!",
              text: "El fue Eliminado correctamente",
              icon: "success"
          });
        }
      }
    })
  }

  

  return (
    <>
      <StatusAlert />
      <div className="p-8">
        {/* Título principal */}
        {/* <h1 className="text-5xl font-bold mb-8">Medicamentos Asignados</h1> */}

        {/* Paciente */}
        {/* <div className="mb-6">
          <PacienteCardMini />
        </div> */}

        {/* Medicamentos asignados */}
        {/* <div className="bg-gray-100 rounded-lg p-4 mb-8">
          <h2 className="text-center text-xl text-gray-700 mb-4">Medicamentos asignados</h2>
          <div className="flex flex-wrap gap-4 justify-start">
            {[1, 2, 3].map((item, index) => (
              <div key={index} className="bg-white border border-gray-700 rounded-lg p-4 w-64 relative">
                <h3 className="font-bold text-md">Acetaminofén</h3>
                <p className="text-sm">Dosis: 150 mg</p>
                <p className="text-sm">Frecuencia: 2 veces al día</p>
                <button className="absolute top-2 right-2">
                  <img src="public\images\basura_imagen_boton.png" alt="Eliminar" className="w-5 h-5 cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <ButtonLarge text="Asignar medicamento" />
          </div>
        </div> */}

        {/* Lista de medicamentos */}
        <div>
          <h2 className="text-3xl font-bold mb-4">Lista de Medicamentos</h2>

          {/* Botón eliminar */}
          {/* <div className="flex justify-end mb-2">
            <button className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer">
              Eliminar
              <img src="public\images\basura_imagen_boton.png" alt="Eliminar" className="w-7 h-7 ml-2" />
            </button>
          </div> */}

          {/* Tabla */}
          <div className="overflow-x-auto">
            {
              medications !== null ?
                <table className="min-w-full border border-blue-500 rounded-lg bg-blue-100 text-center">
                  <thead className="bg-blue-400 text-white">
                    <tr>
                      <th className="px-4 py-2">Medicamento</th>
                      <th className="px-4 py-2">Descripción</th>
                      <th className="px-4 py-2">Tipo</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      medications.map((medication, key) => (
                        <tr key={key} className="bg-blue-50">
                          <td className="px-4 py-2">{medication.nombre}</td>
                          <td className="px-4 py-2">{medication.descripcion}</td>
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
                                  <i class="fa-solid fa-trash text-xl"></i>
                              </button>
                          </td>
                        </tr>
                      ))
                    }
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

          {/* Botón agregar medicamento */}
          <div className="mt-6 flex justify-center">
            <ButtonLarge text="Agregar medicamento" onClick={open} />
          </div>
        </div>
      </div>
      <AnimatedModal isOpen={isOpen} close={close} style={{maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20}}>
        <h1 className="text-lg md:text-2xl text-[#111111] font-semibold text-center">{medicationEdit ? "Editar Medicamento": "Agregar Medicamento"}</h1>
        <form className='mt-10 lg:mt-14' onSubmit={handleSubmit(handleSendData)}>
          <div className="flex flex-col mb-3">
            <Label htmlFor="nombre">Nombre de medicamento:</Label>
            <Input
              type="text"
              id="nombre"
              name="nombre"
              {...register(
                  "nombre",
                  {required: true}
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
                  {required: true}
              )}
              autoFocus
            />
            {errors.descripcion?.message && (
              <p className="text-red-500">{errors.descripcion?.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-3">
            <Label htmlFor="tipo">Descripción del medicamento:</Label>
            <select
              name="tipo"
              id="tipo"
              className={"border-1 border-gray-500"}
              {...register(
                "tipo",
                {required: true}
              )}
            >
              <option disabled selected>--- Seleccionar ---</option>
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
                  className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all'>
                  <span className='text-md'>Aceptar</span>
              </button>
              <button
                  className='cursor-pointer bg-rojobtn py-2 px-3 rounded-lg text-white hover:bg-rojo1 transition-all'
                  onClick={() => {
                    reset()
                    close()
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