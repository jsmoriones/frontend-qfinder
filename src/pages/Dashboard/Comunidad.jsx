import { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';;
import StatusAlert, { StatusAlertService } from 'react-status-alert';

import { TitleDashboardSection } from "../../components/ui/TitleDashboardSection";
import { ButtonLarge } from "../../components/ui/ButtonLarge";
import { createCommunity, editCommunity, getCommunity } from "../../services/ComunidadService";
import { comunidadSchema } from "../../schemas/comunidad";
import { Label, Input, TextArea } from "../../components/ui";

const Comunidad = () => {
  const [comunidades, setComunidades] = useState(null);
  const [communityEdit, setCommunityEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, open, close } = useModal();

  const {
      register,
      handleSubmit,
      formState: {errors},
      reset
  } = useForm({
      resolver: zodResolver(comunidadSchema)
  });

  const fetchCommunities = async () => {
    try {
      const response = await getCommunity();
      if(response?.status == 200){
        setLoading(false)
        setComunidades(response.data.data)
        console.log(response);
      }
    } catch (error) {
      console.log("Hubo un error en la consulta a las comunidades: ", error);
    }
  }

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleSendData = async (data) => {
    alert("koiasdhajsdbjkasbdjks")
    console.log("communityEdit: ", communityEdit)
    try {
      let response;
      if(communityEdit){
        response = await editCommunity(communityEdit, communityEdit.id_red);
        console.log(response)
        if(response.status === 400){
          StatusAlertService.showWarning("No se pudo actualizar la comunidad.");
        }
        if(response.status === 404){
          StatusAlertService.showWarning("La comunidad no fue encontrada");
        }

        if(response.status === 500){
          close();
          StatusAlertService.showError("Hubo un error en el servidor.");
        }else if(response.status === 200){
          close();
          StatusAlertService.showSuccess("Red Actualizada Correctamente");
          fetchCommunities();
          setCommunityEdit(null);
        }
      }else{
        response = await createCommunity(data);
  
        if(response.status === 400){
          StatusAlertService.showWarning("Hubo un error en el servidor.");
        }
        if(response.status === 201){
          reset()
          close();
          StatusAlertService.showSuccess("Usuario actualizado correctamente");
          fetchCommunities();
          setComunidades(null)
        }
      }
    } catch (error) {
      console.log("Hubo un error al registrar una comunidad: ", error);
      StatusAlertService.showError("Hay un error desde el servidor.");
    }
  }

  const handleEditCommunity = async (cmt) => {
    setCommunityEdit(cmt)
    open()
    reset(cmt)
  }

  const handleCloseAlert = () => {
    reset({})
    setCommunityEdit(null)
  }

  return (
    <>
      <StatusAlert />
      <div className="flex h-screen">
        <div className="flex-1 flex">
          {/* Community List */}
          <div className="w-1/1 bg-[rgba(109,138,253,0.25)] bg-opacity-20 p-4 overflow-y-auto  ">
            <TitleDashboardSection text="Comunidad" />
            <div className="flex items-center mb-4">
              <div className="mr-4 w-full">
                <Input placeholder="Search" className="px-3 py-2 w-full" />
              </div>
              <button
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded shadow"
                onClick={() => {
                  setCommunityEdit(null)
                  reset({})
                  open()
                }}>
                Crear comunidad
              </button>
            </div>

            {
              comunidades !== null ?
                comunidades.map((community, i) => (
                  <div
                    key={i}
                    className="flex items-center mt-4 justify-between p-3 mb-3 bg-blue-200 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow  ">
                        <img
                          src="public\images\comunidadimagen1.png"
                          alt="Avatar comunidad"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>

                      <div className="">
                        <p className="font-bold">{community.nombre_red}</p>
                        <p className="text-sm">{community.descripcion_red}</p>
                      </div>
                    </div>
                    <div className="flex justify-around mb-4 pb-4">
                      <button
                        className="flex items-center  px-3 py-3 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEditCommunity(community)}>
                        <span>Editar</span>
                      </button>
                      <div className="flex items-center px-3 py-2 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer">
                        <button className="flex items-center text-red-600 text-sm space-x-1">
                          <i class="fa-solid fa-trash "></i>
                          <a>Eliminar</a>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
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

        {/* Info Panel */}
      </div>
      <AnimatedModal isOpen={isOpen} close={close} style={{maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll"}} onClose={handleCloseAlert} >
        <h1 className="text-lg md:text-2xl text-[#111111] font-semibold text-center">{communityEdit !== null ? "Editar Comunidad" : "Agregar Comunidad"}</h1>
        <form className='mt-10 lg:mt-14' onSubmit={handleSubmit(handleSendData)}>
          <div className="flex flex-col mb-3">
            <Label htmlFor="nameCommunity">Nombre de la Comunidad:</Label>
            <Input
              type="text"
              id="nameCommunity"
              name="nameCommunity"
              {...register(
                "nombre_red",
                {required: true}
              )}
              autoFocus
            />
            {errors.nombre_red?.message && (
              <p className="text-red-500">{errors.nombre_red?.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-3">
            <Label htmlFor="descripcion">Descripción de la Comunidad:</Label>
            <TextArea
              id="descripcion"
              name="descripcion"
              {...register(
                "descripcion_red",
                {required: true}
              )}
              autoFocus
            />
            {errors.descripcion_red?.message && (
              <p className="text-red-500">{errors.descripcion_red?.message}</p>
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
                reset({})
                close()
              }}>
              <span className='text-md'>Cancelar</span>
            </button>
          </div>
        </form>
      </AnimatedModal>
    </>
  );
}

export default Comunidad;