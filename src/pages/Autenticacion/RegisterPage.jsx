import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import StatusAlert, { StatusAlertService } from 'react-status-alert'
import { Input, Label } from "../../components/ui/";
import { registerSchema } from '../../schemas/auth';
import { useAuth } from "../../context/PacienteContext/AuthContext";
import 'react-status-alert/dist/status-alert.css'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
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
                <div className="flex justify-start">
                    <Link
                        to="/"
                        className='flex items-center space-x-3 bg-blue-900 px-3  py-1 rounded-3xl'
                    >
                        <i className="fa-solid fa-arrow-left text-3xl text-white"></i>
                        <span className='text-white'>Inicio</span>
                    </Link>
                </div>
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
                    {...register("nombre_usuario", { required: true })}
                  />
                  {!errors.nombre_usuario?.message && (
                    <p className="text-gray-500 text-sm">Ej: Carlos. Mínimo 3 caracteres.</p>
                  )}
                  {errors.nombre_usuario?.message && (
                    <p className="text-red-500 text-sm">{errors.nombre_usuario.message}</p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <Label htmlFor="lastName">Apellidos:</Label>
                  <Input
                    type="text"
                    id="lastName"
                    {...register("apellido_usuario", { required: true })}
                  />
                  {!errors.apellido_usuario?.message && (
                    <p className="text-gray-500 text-sm">Ej: Rodríguez. Mínimo 3 caracteres.</p>
                  )}
                  {errors.apellido_usuario?.message && (
                    <p className="text-red-500 text-sm">{errors.apellido_usuario.message}</p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <Label htmlFor="identification">Identificación:</Label>
                  <Input
                    type="text"
                    id="identification"
                    {...register("identificacion_usuario", { required: true })}
                  />
                  {!errors.identificacion_usuario?.message && (
                    <p className="text-gray-500 text-sm">Ej: 123456789. Mínimo 9 caracteres.</p>
                  )}
                  {errors.identificacion_usuario?.message && (
                    <p className="text-red-500 text-sm">{errors.identificacion_usuario.message}</p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <Label htmlFor="address">Dirección residencial:</Label>
                  <Input
                    type="text"
                    id="address"
                    {...register("direccion_usuario", { required: true })}
                  />
                  {!errors.direccion_usuario?.message && (
                    <p className="text-gray-500 text-sm">Ej: Calle 10 #23-45. Mínimo 3 caracteres.</p>
                  )}
                  {errors.direccion_usuario?.message && (
                    <p className="text-red-500 text-sm">{errors.direccion_usuario.message}</p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <Label htmlFor="telephone">Teléfono:</Label>
                  <Input
                    type="phone"
                    id="telephone"
                    {...register("telefono_usuario", { required: true })}
                  />
                  {!errors.telefono_usuario?.message && (
                    <p className="text-gray-500 text-sm">Ej: 3112345678. Mínimo 8 dígitos.</p>
                  )}
                  {errors.telefono_usuario?.message && (
                    <p className="text-red-500 text-sm">{errors.telefono_usuario.message}</p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <Label htmlFor="email">Correo Electrónico:</Label>
                  <Input
                    type="email"
                    id="email"
                    {...register("correo_usuario", { required: true })}
                  />
                  {!errors.correo_usuario?.message && (
                    <p className="text-gray-500 text-sm">Ej: ejemplo@correo.com</p>
                  )}
                  {errors.correo_usuario?.message && (
                    <p className="text-red-500 text-sm">{errors.correo_usuario.message}</p>
                  )}
                </div>

                
                <div className="flex flex-col mb-3 relative">
                  <Label htmlFor="password">Tu Contraseña:</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("contrasena_usuario", { required: true })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  {!errors.contrasena_usuario?.message && (
                    <p className="text-gray-500 text-sm">
                      Mínimo 8 caracteres, incluye una mayúscula y un símbolo.
                    </p>
                  )}
                  {errors.contrasena_usuario?.message && (
                    <p className="text-red-500 text-sm">{errors.contrasena_usuario.message}</p>
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