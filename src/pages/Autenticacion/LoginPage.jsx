import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import StatusAlert, { StatusAlertService } from 'react-status-alert'
import { jwtDecode } from 'jwt-decode';
import Cookie from "js-cookie";

import { Input, Label } from '../../components/ui';
import { loginSchema } from '../../schemas/auth';
import { loginService } from '../../services/AuthService';
import { useAuth } from "../../context/PacienteContext/AuthContext";

//Estilos componentes Autenticacion
import "./style.css";

const LoginPage = () => {
    const [viewPassword, setViewPassword] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(loginSchema)
    })
    
    const {signIn, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    /*useEffect(() => {
        if(isAuthenticated){
            console.log("isAuthenticated: ", isAuthenticated)
            navigate("/dashboard")
        }
    }, [isAuthenticated])*/
    

    const handleSendData = async (data) => {
    try {
        const buildData = {
            correo_usuario: data.email,
            contrasena_usuario: data.password
        }
        const response = await signIn(buildData); // <-- Ahora 'response' puede tener un status 400 del contexto

        if(response.status === 200){
            // Esta parte solo se ejecutará si el rol es "Administrador"
            try {
                const authToken = jwtDecode(response.data.token) // Asumo que el token viene en response.data.token
                if(authToken){
                    Cookie.set("login", response.data.token)
                    console.log( Cookie.get("login") )
                    StatusAlertService.showSuccess("Tus datos son correctos, te redijiremos al Dashboard automaticamente");
                    console.log("Tokencito: ", Cookie.get("login"))
                    // isAuthenticated ya debería ser true en este punto por el AuthContext

                    setTimeout(() => {
                        navigate("/dashboard")
                    }, 3000);
                }
            } catch (error) {
                console.log(error.message)
            }
        } else if (response.status === 400) { // <-- Maneja la respuesta del contexto aquí
            StatusAlertService.showWarning(response.message);
        } else {
            // Manejar otros posibles errores o status si los hubiera
            StatusAlertService.showError("Ocurrió un error inesperado al iniciar sesión.");
        }
    } catch (error) {
        console.log(error);
        // Si el error viene de loginService o getUserInfo directamente, no tiene status
        // Puedes verificar si error.response existe para obtener un mensaje más específico
        if (error.response && error.response.data && error.response.data.message) {
            StatusAlertService.showError(error.response.data.message);
        } else {
            StatusAlertService.showError(error.message || "Error de conexión o servidor.");
        }
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

                        <form className='mt-10 lg:mt-14' onSubmit={handleSubmit(handleSendData)}>
                            <div className="flex flex-col mb-3">
                                <Label htmlFor="email">Nombre de usuario o Email:</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    defaultValue="juanmoriones012@gmail.com"
                                    {...register(
                                    "email",
                                    {required: true}
                                    )}
                                    
                                    autoFocus
                                />
                                {errors.email?.message && (
                                    <p className="text-red-500">{errors.email?.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <Label htmlFor="password">Tu contraseña:</Label>
                                    <button
                                        type='button'
                                        className='cursor-pointer'
                                        onClick={() => setViewPassword(prev => !prev)}
                                    >
                                        <i className={`fa-solid ${!viewPassword ? "fa-eye" : "fa-eye-slash"} text-[rgba(102,102,102,80%)]`}></i>
                                        <span className='text-[rgba(102,102,102,80%)] ml-2'>Hiden</span>
                                    </button>
                                </div>
                                <Input
                                    type={viewPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    defaultValue="Juan1234@"
                                    {...register(
                                    "password",
                                    {required: true}
                                    )}
                                    
                                    autoFocus
                                />
                                {errors.password?.message && (
                                    <p className="text-red-500">{errors.password?.message}</p>
                                )}
                            </div>
                            <div className="text-center my-6">
                                <button className='cursor-pointer bg-[#505ABB] text-white text-lg px-2 w-2/5 py-3 rounded-4xl' type='submit'>Iniciar sesión</button>
                            </div>
                        </form>
                        <div className="flex flex-col sm2:flex-row justify-center sm2:justify-between items-center">
                            <p className="text-[#333333] text-base text-center sm2:text-left">¿No tienes una cuenta? <Link to={"/register"} className='underline'>Registrate</Link> </p>
                            <a href="#" className='text-[#666666] text-base text-center sm2:text-right w-full'>Olvidaste tu contraseña</a>
                        </div>
                        <div className="flex flex-row items-center justify-between my-8">
                            <hr className="flex-1 border-.8 border-[rgba(102,102,102,45%)]" />
                            <span className='text-2xl text-[rgba(102,102,102,45%)] mx-3'>O</span>
                            <hr className="flex-1 border-.8 border-[rgba(102,102,102,45%)]" />
                        </div>

                        {/* <div className="">
                            <button className='flex flex-row justify-center cursor-pointer bg-white text-[#333333] text-lg rounded-4xl w-full border-1 py-3'>
                                <img src="/images/logo-gmail.png" className="hidden sm3:block" />
                                <span className='ml-4 text-[#333333] text-lg'>Continuar con Google</span>
                            </button>
                        </div> */}
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

export default LoginPage