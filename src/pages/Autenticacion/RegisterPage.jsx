import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import StatusAlert, { StatusAlertService } from 'react-status-alert'
import { Input, Label } from "../../components/ui/";
import { registerSchema } from '../../schemas/auth';
import { useAuth } from "../../context/PacienteContext/AuthContext";
import 'react-status-alert/dist/status-alert.css'

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const {signup} = useAuth()
  const navigate = useNavigate()

  const hanldeSendData = async (data) => {
    try {
      const response = await signup({...data, tipo_usuario: "Usuario"})
      StatusAlertService.showSuccess(response);

      setTimeout(() => {
        navigate("/verify");
      }, 4000)
      
    } catch (error) {
      const errorAwait = await error;
      console.log(errorAwait)
      StatusAlertService.showError(errorAwait.message);
    }
  }

  return (
    <>
      <StatusAlert />
      <div className="line-bg">
        <div className="mx-16 min-h-screen flex items-center">
          <div className="container mx-auto flex flex-col lg:flex-row gap-12 h-full">
              <div className="w-full lg:w-2/5 py-8">
                <h1 className="text-4xl md:text-5xl text-[#111111] font-semibold my-6 text-center lg:text-left">Bienvenido a QfindeR</h1>
                <p className="text-[rgba(102,102,102,80%)] text-lg md:text-2xl text-center lg:text-left">Para un mejor despertar, soñemos con la protección social</p>

                <div className="w-full justify-center items-center flex lg:hidden">
                  <img src="/images/grandfather-doctor.png" alt="Imagen de login, se encuentra anciano con doctores" />
                </div>

                <form className='mt-10 lg:mt-14' onSubmit={handleSubmit(hanldeSendData)}>
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
                      <button className='cursor-pointer bg-[#505ABB] text-white text-lg px-2 w-2/5 py-3 rounded-4xl'>Registrarme</button>
                  </div>
                </form>
            
              </div>
              <div className="w-3/5 justify-center items-center hidden lg:flex">
                <img src="/images/grandfather-doctor.png" alt="Imagen de login, se encuentra anciano con doctores" />
              </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage