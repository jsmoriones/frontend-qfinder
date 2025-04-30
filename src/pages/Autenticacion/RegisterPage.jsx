import React from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Label } from "../../components/ui/";
import { registerSchema } from '../../schemas/auth';
import { useAuth } from "../../context/PacienteContext/AuthContext";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const {signup} = useAuth()


  const hanldeSendData = (data) => {
    signup(data)
  }

  return (
    <>
        <div className="mx-16 min-h-screen flex items-center">
            <div className="container mx-auto flex gap-12 h-full">
                <div className="w-2/5 py-8">
                    <h1 className="text-5xl text-[#111111] font-semibold my-6">Bienvenido a QfindeR</h1>
                    <p className="text-[rgba(102,102,102,80%)] text-2xl">Para un mejor despertar, soñemos con la protección social</p>

                    <form className='mt-14' onSubmit={handleSubmit(hanldeSendData)}>
                      <div className="flex flex-col mb-3">
                        <Label htmlFor="names">Nombres:</Label>
                        <Input
                          type="text"
                          id="names"
                          name="nombre_usuario"
                          {...register(
                            "nombre_usuario",
                            {required: true}
                          )}
                          autoFocus
                        />
                        {errors.nombre_usuario?.message && (
                          <p className="text-red-500">{errors.nombre_usuario?.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col mb-3">
                        <Label htmlFor="lastName">Apellidos:</Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="apellido_usuario"
                          {...register("apellido_usuario",
                            {required: true})}
                          autoFocus
                        />
                        {errors.apellido_usuario?.message && (
                          <p className="text-red-500">{errors.apellido_usuario?.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col mb-3">
                        <Label htmlFor="identification">Identificación:</Label>
                        <Input
                          type="text"
                          id="identification"
                          name="identificacion_usuario"
                          {...register("identificacion_usuario",
                            {required: true})}
                          autoFocus
                        />
                        {errors.identificacion_usuario?.message && (
                          <p className="text-red-500">{errors.identificacion_usuario?.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col mb-3">
                        <Label htmlFor="address">Dirección residencial:</Label>
                        <Input
                          type="text"
                          id="address"
                          name="direccion_usuario"
                          {...register("direccion_usuario",
                            {required: true})}
                          autoFocus
                        />
                        {errors.direccion_usuario?.message && (
                          <p className="text-red-500">{errors.direccion_usuario?.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col mb-3">
                          <Label htmlFor="telephone">Teléfono:</Label>
                          <Input
                            type="phone"
                            id="telephone"
                            name="telefono_usuario"
                            {...register("telefono_usuario",
                              {required: true})}
                            autoFocus
                          />
                          {errors.telefono_usuario?.message && (
                          <p className="text-red-500">{errors.telefono_usuario?.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col mb-3">
                        <Label htmlFor="email">Correo Eléctronico:</Label>
                        <Input
                          type="email"
                          id="email"
                          name="correo_usuario"
                          {...register("correo_usuario",
                            {required: true})}
                          autoFocus
                        />
                        {errors.correo_usuario?.message && (
                          <p className="text-red-500">{errors.correo_usuario?.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col mb-3">
                        <Label htmlFor="password">Tu Contraseña:</Label>
                        <Input
                          type="password"
                          id="password"
                          name="contrasena_usuario"
                          {...register("contrasena_usuario",
                            {required: true})}
                          autoFocus
                        />
                        {errors.contrasena_usuario?.message && (
                          <p className="text-red-500">{errors.contrasena_usuario?.message}</p>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                          <p className="text-[#333333] text-base">¿No tienes una cuenta? <Link to={"/login"} className='underline'>Iniciar sesión</Link></p>
                      </div>
                      <div className="text-center my-6">
                          <button className='cursor-pointer bg-[#505ABB] text-white text-lg px-2 w-2/5 py-3 rounded-4xl'>Sign In</button>
                      </div>
                    </form>
                </div>
                <div className="w-3/5 flex justify-center items-center">
                    <img src="/images/grandfather-doctor.png" alt="Imagen de login, se encuentra anciano con doctores" />
                </div>
            </div>
        </div>
    </>
  )
}

export default RegisterPage