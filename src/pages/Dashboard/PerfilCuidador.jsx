import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/PacienteContext/AuthContext';
import { actualizarPerfilAdmin } from '../../services/UserService';

const schema = z.object({
  nombre_usuario: z.string().min(1, 'Nombre requerido'),
  apellido_usuario: z.string().min(1, 'Apellido requerido'),
  identificacion_usuario: z.string().min(5, 'Identificación requerida'),
  direccion_usuario: z.string().min(5, 'Dirección requerida'),
  telefono_usuario: z.string().min(7, 'Teléfono inválido'),
  correo_usuario: z.string().email('Correo inválido'),
  imagen_usuario: z.any().optional()
});

const PerfilAdministrador = () => {
  const [editMode, setEditMode] = useState(false);

  const {infoUser, setInfoUser} = useAuth();

  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    /*defaultValues: {
      nombre_usuario: infoUser.nombre_usuario,
      apellido_usuario: infoUser.apellido_usuario,
      identificacion_usuario: infoUser.identificacion_usuario,
      direccion_usuario: infoUser.direccion_usuario,
      telefono_usuario: infoUser.telefono_usuario,
      imagen_usuario: null
    }*/
  });
  
  useEffect(() => {
    reset({...infoUser, imagen_usuario: "https://www.valoraanalitik.com/wp-content/uploads/2025/06/gustavo-petro-5-1024x597.jpg"})
  }, [])

  const imagenVista = watch('imagen_usuario');

  const onSubmit = async (data) => {
    const response = await actualizarPerfilAdmin(data, infoUser.id_usuario);
    if(response.status == 200){
      setInfoUser(response.data.usuario)
      //localStorage.setItem("infoUser", response.data)
    }
    console.log("Esta es la respuesta al editar el usuario: ", response)
    setEditMode(false);
  };

  const handleCancel = () => {
    reset();
    setEditMode(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Perfil del Administrador</h2>

      <div className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Lado izquierdo */}
        <div className="bg-azulClaro2 p-6 w-full md:w-1/3 text-center">
          <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={
                imagenVista
                  ? imagenVista
                  : "/images/avatar.png"
              }
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
                  {...register('imagen_usuario')}
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

        {/* Lado derecho */}
        <div className="bg-azulPastel1 p-6 w-full md:w-2/3">
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { label: 'Nombre', name: 'nombre_usuario' },
                { label: 'Apellido', name: 'apellido_usuario' },
                { label: 'Identificación', name: 'identificacion_usuario' },
                { label: 'Teléfono', name: 'telefono_usuario' },
                { label: 'Dirección', name: 'direccion_usuario' },
                { label: 'Correo_usuario', name: "correo_usuario" }
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
                  className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-black cursor-pointer"
                >
                  Guardar
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
