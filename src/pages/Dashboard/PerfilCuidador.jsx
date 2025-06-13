import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/PacienteContext/AuthContext';
import { actualizarPerfilAdmin } from '../../services/UserService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase/firebase';
import StatusAlert, { StatusAlertService } from 'react-status-alert';

const schema = z.object({
  nombre_usuario: z.string().min(1, 'Nombre requerido'),
  apellido_usuario: z.string().min(1, 'Apellido requerido'),
  identificacion_usuario: z.string().min(5, 'Identificación requerida'),
  direccion_usuario: z.string().min(5, 'Dirección requerida'),
  telefono_usuario: z.string().min(7, 'Teléfono inválido'),
  correo_usuario: z.string().email('Correo inválido'),
  imagen_usuario: z.string().optional()
});

const PerfilAdministrador = () => {
  const [editMode, setEditMode] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  const { infoUser, setInfoUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (infoUser) {
      reset({ ...infoUser, imagen_usuario: infoUser.imagen_usuario || '' });
      setCurrentImageUrl(infoUser.imagen_usuario || null);
    }
  }, [infoUser]);

  const onSubmit = async (data) => {
    try {
      let finalImageUrl = data.imagen_usuario;

      if (fileToUpload) {
        StatusAlertService.showAlert({
          type: 'info',
          message: 'Subiendo imagen a Firebase...',
          showProgress: true,
          timeout: 0
        });

        try {
          const storageRef = ref(storage, `perfilAdmin/${fileToUpload.name}`);
          const snapshot = await uploadBytes(storageRef, fileToUpload);
          const url = await getDownloadURL(snapshot.ref);
          finalImageUrl = url;
          StatusAlertService.showSuccess('Imagen subida con éxito a Firebase.');
        } catch (uploadError) {
          console.error('Error subiendo imagen:', uploadError);
          StatusAlertService.showError('Error al subir la imagen a Firebase.');
          return;
        }
      }

      const dataToSend = { ...data, imagen_usuario: finalImageUrl };
      const response = await actualizarPerfilAdmin(dataToSend, infoUser.id_usuario);

      if (response.status === 200) {
        setInfoUser(response.data.usuario);
        StatusAlertService.showSuccess('Perfil actualizado correctamente.');
        setEditMode(false);
        setFileToUpload(null);
        setCurrentImageUrl(response.data.usuario.imagen_usuario || null);
      } else {
        StatusAlertService.showWarning('No se pudo actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      StatusAlertService.showError('Hubo un error al guardar el perfil.');
    }
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
    }
  };

  const handleCancel = () => {
    reset({ ...infoUser });
    setEditMode(false);
    setFileToUpload(null);
    setCurrentImageUrl(infoUser.imagen_usuario || null);
  };

  return (
    <div className="p-6">
      <StatusAlert />
      <h2 className="text-3xl font-bold mb-6">Perfil del Administrador</h2>

      <div className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="bg-azulClaro2 p-6 w-full md:w-1/3 text-center">
          <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={currentImageUrl || "/images/avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            {editMode && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer">
                <i className="fa-solid fa-camera text-white text-2xl" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          {!editMode && (
            <figcaption className="mt-4 text-2xl font-semibold text-black">
              {infoUser.nombre_usuario} {infoUser.apellido_usuario}
            </figcaption>
          )}
        </div>

        <div className="bg-azulPastel1 p-6 w-full md:w-2/3">
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { label: 'Nombre', name: 'nombre_usuario' },
                { label: 'Apellido', name: 'apellido_usuario' },
                { label: 'Identificación', name: 'identificacion_usuario' },
                { label: 'Teléfono', name: 'telefono_usuario' },
                { label: 'Dirección', name: 'direccion_usuario' },
                { label: 'Correo', name: 'correo_usuario' }
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block font-medium text-azulPastel6">{label}</label>
                  <input
                    {...register(name)}
                    className="w-full mt-1 border-b-2 border-black bg-transparent outline-none text-lg px-1"
                  />
                  {errors[name] && <p className="text-sm text-red-500">{errors[name].message}</p>}
                </div>
              ))}

              <input type="hidden" {...register("imagen_usuario")} />

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg border-2 border-black cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-black cursor-pointer"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-lg">
              <div><span className="font-semibold text-azulPastel6">Identificación:</span> {infoUser.identificacion_usuario}</div>
              <div><span className="font-semibold text-azulPastel6">Teléfono:</span> {infoUser.telefono_usuario}</div>
              <div><span className="font-semibold text-azulPastel6">Correo:</span> {infoUser.correo_usuario}</div>
              <div><span className="font-semibold text-azulPastel6">Dirección:</span> {infoUser.direccion_usuario}</div>

              <button
                onClick={() => setEditMode(true)}
                className="mt-6 bg-azulPastel5 text-white font-bold px-6 py-2 rounded-lg border-2 border-black"
              >
                Editar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilAdministrador;
