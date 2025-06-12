import { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal'
import { useForm, Controller } from 'react-hook-form'; // Importa Controller
import { zodResolver } from '@hookform/resolvers/zod';
import StatusAlert, { StatusAlertService } from 'react-status-alert';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase/firebase';

import { TitleDashboardSection } from "../../components/ui/TitleDashboardSection";
import { ButtonLarge } from "../../components/ui/ButtonLarge";
import { createCommunity, deleteCommunity, editCommunity, getCommunity } from "../../services/ComunidadService";
import { comunidadSchema } from "../../schemas/comunidad"; // Asegúrate de que esta ruta es correcta y el esquema
import { Label, Input, TextArea } from "../../components/ui";
import Swal from "sweetalert2";

const Comunidad = () => {
  const [comunidades, setComunidades] = useState(null);
  const [communityEdit, setCommunityEdit] = useState(null);
  const [getComunidad, setGetCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cleanRedes, setCleanRedes] = useState(false);
  
  // Estado para el archivo seleccionado por el usuario
  const [fileToUpload, setFileToUpload] = useState(null); 
  // Estado para la URL de la imagen que se usará para mostrar o enviar
  const [currentImageUrl, setCurrentImageUrl] = useState(null); 
  
  // Estados para la carga de imagen (serán cubiertos por isSubmitting ahora)
  // const [isUploadingImage, setIsUploadingImage] = useState(false); // No es tan necesario si usas isSubmitting
  // const [imageUploadError, setImageUploadError] = useState(null); // Los errores se mostrarán con StatusAlertService

  const { isOpen, open, close } = useModal();
  const { isOpen: isOpenGetCom, open: openGetCom, close: closeGetCom } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // <-- isSubmitting es clave aquí
    reset,
    setValue, // <-- setValue es clave para la URL
    control // <-- control es clave para Controller
  } = useForm({
    resolver: zodResolver(comunidadSchema),
    defaultValues: { // Asegúrate de que tus campos tienen valores por defecto
      nombre_red: '',
      descripcion_red: '',
      imagen_red: '', // Valor por defecto para la URL de la imagen
    }
  });

  const fetchCommunities = async () => {
    try {
      const response = await getCommunity();
      
      if(response?.status == 200){
        setLoading(false)
        setComunidades(response.data.data)
        console.log(response);
      }

      if(response.status == 404){
        setCleanRedes(true)
      }
    } catch (error) {
      console.log("Hubo un error en la consulta a las comunidades: ", error);
    }
  }

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if(!communityEdit){
      reset({})
    }
  }, [communityEdit])

  // Función principal de envío del formulario
  const handleSendData = async (data) => {
    console.log("Datos del formulario recibidos por handleSendData:", data);

    try {
      let finalImageUrl = data.imagen_red; // Asume la URL actual (si viene de edición o ya se cargó)

      // 1. Si hay un nuevo archivo seleccionado, súbelo a Firebase
      if (fileToUpload) {
        // setIsUploadingImage(true); // Opcional si isSubmitting cubre esto
        StatusAlertService.showAlert({
            type: 'info',
            message: 'Subiendo imagen a Firebase...',
            showProgress: true,
            timeout: 0 // Mantener hasta que termine la subida o error
        });

        try {
          const uploadRef = ref(storage, `redes/${fileToUpload.name}`);
          const snapshot = await uploadBytes(uploadRef, fileToUpload);
          const url = await getDownloadURL(snapshot.ref);
          console.log('Imagen subida a Firebase Storage. URL:', url);
          finalImageUrl = url; // Usa esta nueva URL
          StatusAlertService.showSuccess("Imagen subida con éxito a Firebase.");
        } catch (firebaseError) {
          console.error("Error al subir la imagen a Firebase:", firebaseError);
          StatusAlertService.showError(`Error al subir imagen: ${firebaseError.message}. Verifica tus reglas de Storage.`);
          // Si falla la subida, detén el proceso de envío del formulario
          return; 
        } finally {
          // setIsUploadingImage(false);
          
        }
      } else if (communityEdit && !fileToUpload && communityEdit.imagen_red) {
        // Si estamos editando y no se seleccionó un nuevo archivo, usamos la URL existente
        finalImageUrl = communityEdit.imagen_red;
      } else {
        // Si no hay archivo nuevo y no hay URL existente (caso de creación sin imagen o edición donde se quitó)
        finalImageUrl = ''; // O null, dependiendo de tu esquema y backend
      }

      // Actualiza el campo imagen_red en el objeto `data` que se enviará
      data.imagen_red = finalImageUrl;

      // VALIDACIÓN FINAL (opcional, si Zod ya lo maneja bien)
      // Si imagen_red es obligatorio para CREAR y no tiene URL final:
      if (!communityEdit && comunidadSchema.shape.imagen_red.isOptional() === false && !data.imagen_red) {
          StatusAlertService.showWarning("La imagen de la comunidad es obligatoria.");
          return;
      }

      let response;
      if(communityEdit){
        response = await editCommunity(data, communityEdit.id_red); 
        console.log("Respuesta de edición:", response);

        if(response.status === 400){
          StatusAlertService.showWarning("No se pudo actualizar la comunidad.");
        } else if(response.status === 404){
          StatusAlertService.showWarning("La comunidad no fue encontrada");
        } else if(response.status === 500){
          close();
          StatusAlertService.showError("Hubo un error en el servidor.");
        } else if(response.status === 200){
          close();
          StatusAlertService.showSuccess("Red Actualizada Correctamente");
          fetchCommunities();
          setCommunityEdit(null);
          setFileToUpload(null); // Limpiar archivo seleccionado
          setCurrentImageUrl(null); // Limpiar URL mostrada
          reset(); // Resetea el formulario de RHF (incluyendo imagen_red)
        }
      } else {
        response = await createCommunity(data);
        console.log("Respuesta de creación:", response);
 
        if(response.status === 400){
          StatusAlertService.showWarning("Hubo un error en el servidor.");
        } else if(response.status === 201){
          close();
          StatusAlertService.showSuccess("Comunidad creada correctamente");
          fetchCommunities();
          setFileToUpload(null); // Limpiar archivo seleccionado
          setCurrentImageUrl(null); // Limpiar URL mostrada
          reset(); // Resetea el formulario de RHF
        }
      }
    } catch (error) {
      console.error("Hubo un error en el envío del formulario:", error);
      StatusAlertService.showError("Hubo un error en el servidor o al procesar la imagen.");
    }
  }

  const handleEditCommunity = async (cmt) => {
    setCommunityEdit(cmt);
    open();
    reset(cmt); // Establece los valores del formulario
    
    // Si la comunidad tiene una imagen_red, inicializa el estado local y el campo de RHF
    if (cmt.imagen_red) {
      setCurrentImageUrl(cmt.imagen_red);
      // setea el valor en RHF para que Zod lo valide y esté listo para el envío
      setValue('imagen_red', cmt.imagen_red, { shouldValidate: true });
    } else {
      setCurrentImageUrl(null); // Limpiar si no hay imagen_red
      setValue('imagen_red', '', { shouldValidate: true }); // Asegura que RHF tenga una cadena vacía
    }
    setFileToUpload(null); // Limpiar cualquier archivo seleccionado previamente
    // setImageUploadError(null); // No necesario si StatusAlertService maneja esto
  }

  const handleCloseAlert = () => {
    reset({}); // Limpia todos los campos del formulario
    setCommunityEdit(null);
    setCurrentImageUrl(null); // Limpiar la URL al cerrar el modal
    setFileToUpload(null); // Limpiar el archivo seleccionado
    // setImageUploadError(null);
    // setIsUploadingImage(false);
     // Ocultar cualquier alerta activa
  }

  // Captura el archivo seleccionado del input[type="file"]
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
      // setImageUploadError(null); // Limpiar errores anteriores
      // Muestra una vista previa si es posible (opcional)
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentImageUrl(event.target.result); // Muestra la imagen seleccionada temporalmente
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFileToUpload(null);
      // Si no se selecciona archivo en edición, mantén la URL existente si hay
      if (!communityEdit || !communityEdit.imagen_red) {
        setCurrentImageUrl(null); 
      }
    }
  };

  const handleGetCommunity = com => {
    openGetCom()
    setGetCommunity(com);
    console.log(com)
  }

  const handleCloseGetCom = () => {
    setGetCommunity(null);
    closeGetCom()
  }

  const handleRemoveCommunity = id => {
    Swal.fire({
      title: "¿Estás seguro de realizar esta acción?",
      text: "Si eliminas una red no podrás volver a recuperarla",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo borrarlo!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteCommunity(id);
        if (response.status === 200) {
            fetchCommunities()
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
  }

  return (
    <>
      <StatusAlert />
      <div className="flex h-screen">
        <div className="flex-1 flex">
          {/* Community List (tu código existente) */}
          <div className="w-1/1 bg-[rgba(109,138,253,0.25)] bg-opacity-20 p-4 overflow-y-auto">
            <div className="flex items-center mb-4 justify-between">
            <TitleDashboardSection text="Comunidad" />
              {/* <div className="mr-4 w-full">
                <Input placeholder="Search" className="px-3 py-2 w-full" />
              </div> */}
              <button
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded shadow"
                onClick={() => {
                  reset({})
                  setCurrentImageUrl(null); // Limpiar URL de imagen al crear nueva
                  setFileToUpload(null);
                  setCommunityEdit(null)
                  // setImageUploadError(null);
                  open()
                }}>
                Crear comunidad
              </button>
            </div>

            {
              cleanRedes ?
              <p className="text-center mt-8 text-2xl italic">No hay redes, empieza por crear una nueva red.</p> :
              loading ? (
                <div className="flex justify-center items-center">
                  <PuffLoader
                    size={120}
                    color={"#6D8AFD"}
                    loading={loading}
                    speedMultiplier={5}
                  />
                </div>
              ) : (
                comunidades && comunidades.map((community, i) => (
                  <div
                    key={i}
                    className="flex items-center mt-4 justify-between px-3 mb-3 bg-blue-200 rounded-lg"
                  >
                    <div
                      className="flex items-center space-x-2 cursor-pointer py-3 pr-24"
                      onClick={() => handleGetCommunity(community)}>
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow">
                        <img
                          src={community.imagen_red || "/images/comunidadimagen1.png"} // Usar URL de Firebase o placeholder
                          alt="Avatar comunidad"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="">
                        <p className="font-bold">{community.nombre_red}</p>
                        <p className="text-sm">{community.descripcion_red.substr(0,50)}...</p>
                      </div>
                    </div>
                    <div className="flex justify-around py-3 space-x-3">
                      <button
                        className="flex items-center px-3 py-3 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEditCommunity(community)}>
                        <span>Editar</span>
                      </button>
                      <div
                        className="flex items-center px-3 py-2 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRemoveCommunity(community.id_red)}>
                        <button className="flex items-center text-red-600 text-sm space-x-1">
                          <i className="fa-solid fa-trash"></i>
                          <a>Eliminar</a>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )
            }
          </div>
        </div>

        {/* Info Panel - Modal para el formulario */}
      </div>
      {getComunidad && <AnimatedModal isOpen={isOpenGetCom} close={closeGetCom} style={{maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll"}} onClose={handleCloseGetCom}>
        <div className="flex flex-col items-center">
          <div className="flex justify-center">
            <img src={getComunidad.imagen_red} alt="Imagen de Red" className="aspect-square rounded-full object-cover w-1/3" />
          </div>
          <div className="mt-2">
            <h3 className="text-blue-500 font-semibold text-2xl">{getComunidad.nombre_red}</h3>
          </div>
          <div className="flex justify-start w-full mt-6">
            <p className="text-lg text-gray-900 text-justify">{getComunidad.descripcion_red}</p>
          </div>
        </div>
      </AnimatedModal>}
      <AnimatedModal isOpen={isOpen} close={close} style={{maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll"}} onClose={handleCloseAlert}>
        <h1 className="text-lg md:text-2xl text-[#111111] font-semibold text-center">{communityEdit !== null ? "Editar Comunidad" : "Agregar Comunidad"}</h1>
        <form className='mt-10 lg:mt-14' onSubmit={handleSubmit(handleSendData)}>
          <div className="flex flex-col mb-3">
            <Label htmlFor="nombre_red">Nombre de la Comunidad:</Label>
            <Input
              type="text"
              id="nombre_red"
              {...register("nombre_red")}
              autoFocus
            />
            {errors.nombre_red?.message && (
              <p className="text-red-500">{errors.nombre_red?.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-3">
            <Label htmlFor="descripcion_red">Descripción de la Comunidad:</Label>
            <TextArea
              id="descripcion_red"
              {...register("descripcion_red")}
              autoFocus
            />
            {errors.descripcion_red?.message && (
              <p className="text-red-500">{errors.descripcion_red?.message}</p>
            )}
          </div>

          {/* CAMPO DE IMAGEN REVISADO PARA SUBIDA EN SUBMIT */}
          {communityEdit && <div className="flex flex-col mb-3">
            <Label htmlFor="imagen_red_file">Imagen de la Red:</Label>
            <input
              type="file"
              id="imagen_red_file"
              className="w-full text-slate-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
              onChange={handleFileChange} // Capturamos el archivo aquí
              // !!! IMPORTANTE: NO USES {...register("imagen_red")} AQUI EN EL INPUT[TYPE="FILE"] !!!
              // Dejamos que RHF maneje el campo 'imagen_red' (la URL) a través del Controller
              // y setValue, no directamente con este input de archivo.
            />
            {/* Si necesitas mostrar un error específico para la selección de archivo */}
            {fileToUpload && <p className="text-sm text-gray-500 mt-1">Archivo seleccionado: {fileToUpload.name}</p>}
            
            {currentImageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Previsualización/Imagen actual:</p>
                <img src={currentImageUrl} alt="Imagen de la red" className="w-24 h-24 object-cover rounded-md mt-1" />
              </div>
            )}
            
            {/* ESTE ES EL CAMPO OCULTO QUE REACT HOOK FORM GESTIONARÁ CON LA URL FINAL */}
            <Controller
                name="imagen_red" // Este es el nombre del campo en tu Zod schema (la URL)
                control={control} // Viene de useForm
                render={({ field }) => (
                    // field.value contendrá la URL final (vacía, previa o recién subida)
                    <input type="hidden" {...field} />
                )}
            />
            {/* Este error es de Zod para 'imagen_red' (si no es una URL válida o es requerida y falta) */}
            {errors.imagen_red?.message && (
              <p className="text-red-500">{errors.imagen_red?.message}</p>
            )}
          </div>}

          <div className="flex w-full justify-end space-x-2">
            <button
              type="submit"
              disabled={isSubmitting} // Deshabilita el botón mientras se envía (incluye la subida a Firebase)
              className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all'>
              <span className='text-md'>{isSubmitting ? 'Enviando...' : 'Aceptar'}</span>
            </button>
            <button
              type="button" // Tipo botón para que no envíe el formulario
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