import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import moment from 'moment';
import 'moment/locale/es';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StatusAlert, { StatusAlertService } from 'react-status-alert';

import { PacienteSchema } from "../../schemas/patient";
import { editPatient, listPatients, registerPatient } from "../../services/PacienteService";
import { Label, Input, TextArea } from "../../components/ui";

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase/firebase';

moment.locale('es');

const ListPacientes = () => {
  const [pacientes, setPacientes] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  const { isOpen, open, close } = useModal();
  const { isOpen: isOpen2, open: open2, close: close2 } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(PacienteSchema)
  });

  useEffect(() => {
    fetchPacientes();
  }, []);

  useEffect(() => {
    if (paciente) {
      reset(paciente);
      setCurrentImageUrl(paciente.imagen_paciente || null);
    } else {
      reset({});
      setCurrentImageUrl(null);
    }
    setFileToUpload(null);
  }, [paciente, reset]);

  const fetchPacientes = async () => {
    const response = await listPatients();
    if (response?.status === 200) {
      setPacientes(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleShowInfoUser = data => {
    open();
    setPaciente(data);
  };

  const handleSendData = async data => {
    let finalImageUrl = data.imagen_paciente;

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

    data.imagen_paciente = finalImageUrl;

    let response;
    try {
      if (paciente) {
        response = await editPatient(data, paciente.id_paciente);
        if (response.status === 500) {
          close2();
          StatusAlertService.showError("Hubo un error en el servidor.");
        } else if (response.status === 200) {
          close2();
          StatusAlertService.showSuccess("Paciente actualizado correctamente");
          fetchPacientes();
          setPaciente(null);
        }
      } else {
        response = await registerPatient(data);
        if (response.status === 201) {
          reset({});
          close2();
          fetchPacientes();
          StatusAlertService.showSuccess("Se registró correctamente el usuario");
        }
      }
    } catch (error) {
      console.log("Error al registrar un paciente: ", error);
    }
  };

  const handleEditPatient = data => {
    open2();
    setPaciente(data);
    reset(data);
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

  const getEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const nacimientoMoment = moment(fechaNacimiento);
    const hoyMoment = moment();
    return hoyMoment.diff(nacimientoMoment, 'years');
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
          {pacientes !== null && !loading ? (
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
                {pacientes.map((paciente, index) => (
                  <tr key={paciente.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{paciente.nombre}</td>
                    <td className="px-6 py-4">{paciente.apellido}</td>
                    <td className="px-6 py-4">{paciente.identificacion}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => handleEditPatient(paciente)} className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer">
                        <i className="fa-solid fa-pencil text-xl"></i>
                      </button>
                      <button className="text-red-600 hover:text-red-400 transition-all cursor-pointer">
                        <i className="fa-solid fa-trash text-xl"></i>
                      </button>
                      <button onClick={() => handleShowInfoUser(paciente)} className="text-green-600 hover:text-green-400 transition-all cursor-pointer">
                        <i className="fa-solid fa-eye text-xl"></i>
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
        </div>
      </div>

    <AnimatedModal isOpen={isOpen} close={close} style={{maxWidth: "500px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll"}}>
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
                <div className="bg-gray-200 p-2 rounded-lg">
                  <p className="text-gray-500 font-semibold text-xl mb-2">Pertenece a:</p>
                  <div className="flex items-center">
                    <p className="text-cyan-700 text-lg mr-2">Nombre(s):</p>
                    <p className="text-gray-800 text-right">{paciente.usuario.nombre_usuario}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-cyan-700 text-lg mr-2">Apellido(s):</p>
                    <p className="text-gray-800 text-right">{paciente.usuario.apellido_usuario}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-cyan-700 text-lg mr-2">Correo:</p>
                    <p className="text-gray-800 text-right">{paciente.usuario.correo_usuario}</p>
                  </div>
                </div>
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
            <label htmlFor="imagen_paciente_file" className="absolute bottom-0 right-0 cursor-pointer">
              <i className="fa-solid fa-camera text-xl text-white bg-gray-600 aspect-square rounded-full p-2 hover:scale-105 transition-all"></i>
              <input type="file" id="imagen_paciente_file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
          <div className="flex flex-col mb-3">
        <Label htmlFor="name">Nombre de paciente:</Label>
        <Input
            type="text"
            id="name"
            name="name"
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
        <Label htmlFor="apellido">Apellido de apellido:</Label>
        <Input
            type="text"
            id="apellido"
            name="apellido"
            {...register(
                "apellido",
                {required: true}
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
                {required: true}
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
            {required: true}
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
            {required: true}
            )}
        >
            <option disabled selected>--- Seleccionar ---</option>
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
        <Label htmlFor="diagnostico_principal">Diagnostico Principal:</Label>
        <TextArea
            {...register(
                "diagnostico_principal",
                {required: true}
            )}
            id="diagnostico_principal"
        />
        {errors.diagnostico_principal?.message && (
            <p className="text-red-500">{errors.diagnostico_principal?.message}</p>
        )}
    </div>
    <div className="flex flex-col gap-2">
        <Label htmlFor="autonomia">Nivel de Autonomia:</Label>
        <select
            name="autonomia"
            id="autonomia"
            className="text-center w-1/2"
            {...register(
                "nivel_autonomia",
                {required: true}
            )}
        >
            <option selected disabled>--- Seleccionar ---</option>
            <option value="alta">Alta</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
        </select>
        {errors.autonomia?.message && (
        <p className="text-red-500">{errors.autonomia?.message}</p>
        )}
    </div>
          <div className="flex w-full justify-end space-x-2">
            <button type="submit" className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all'>
              <span className='text-md'>Aceptar</span>
            </button>
            <button
              type="button"
              className='cursor-pointer bg-rojobtn py-2 px-3 rounded-lg text-white hover:bg-rojo1 transition-all'
              onClick={() => {
                close2();
                reset();
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
