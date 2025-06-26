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
    const [loadSave, setLoadSave] = useState(false);
    
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
        setLoadSave(true);
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
                StatusAlertService.showError("Hubo un error con la conexión del servidor");
            } else {
                StatusAlertService.showError(error.message || "Error de conexión o servidor.");
            }
        } finally {
            setLoadSave(false);
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
                                <button className='cursor-pointer bg-[#505ABB] text-white text-lg px-2 w-2/5 py-3 rounded-4xl' type='submit' disabled={loadSave}>
                                
                                {
                                    loadSave ?
                                        <div className="w-full flex justify-center items-center">
                                            <svg ariaHidden="true" className="w-8 h-8 text-blue-100 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                            </svg>
                                        </div>
                                    : <span className='text-md'>Iniciar sesión</span>
                                }
                                </button>
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