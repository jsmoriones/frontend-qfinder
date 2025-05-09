import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import StatusAlert, { StatusAlertService } from 'react-status-alert'
import { jwtDecode } from 'jwt-decode';
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
    const navigate = useNavigate()

    const handleSendData = async (data) => {
        try {
            const buildData = {
                correo_usuario: data.email,
                contrasena_usuario: data.password
            }
            const response = await signIn(buildData);
            console.log(response)
            if(response.status === 200){
                try {
                    const authToken = jwtDecode(response.data.token)
                    if(authToken){
                        /*cookies.set("login_authorization", response.data.token, {
                            expires: new Date(authToken.exp * 1000)
                        })
                        console.log( cookies.get("login_authorization") )*/
                        StatusAlertService.showSuccess("Tus datos son correctos, te redijiremos al Dashboard automaticamente");

                        setTimeout(() => {
                            navigate("/dashboard")
                        }, 4000)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
            StatusAlertService.showError(error.message);
        }
    }
  return (
    <>
        <StatusAlert />
        <div className="mx-16 min-h-screen flex items-center line-bg">
            <div className="container mx-auto flex gap-12 h-full">
                <div className="w-2/5 py-8">
                    <h1 className="text-5xl text-[#111111] font-semibold my-6">Bienvenido a QfindeR</h1>
                    <p className="text-[rgba(102,102,102,80%)] text-2xl">Para un mejor despertar, soñemos con la protección social</p>

                    <form className='mt-14' onSubmit={handleSubmit(handleSendData)}>
                        <div className="flex flex-col mb-3">
                            <Label htmlFor="email">Nombre de usuario o Email:</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
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
                            <button className='cursor-pointer bg-[#505ABB] text-white text-lg px-2 w-2/5 py-3 rounded-4xl' type='submit'>Sign In</button>
                        </div>
                    </form>
                    <div className="flex justify-between items-center">
                        <p className="text-[#333333] text-base">¿No tienes una cuenta? <Link to={"/register"} className='underline'>Registrate</Link> </p>
                        <a href="#" className='text-[#666666] text-base'>Olvidaste tu contraseña</a>
                    </div>
                    <div className="flex flex-row items-center justify-between my-8">
                        <hr className="flex-1 border-.8 border-[rgba(102,102,102,45%)]" />
                        <span className='text-2xl text-[rgba(102,102,102,45%)] mx-3'>O</span>
                        <hr className="flex-1 border-.8 border-[rgba(102,102,102,45%)]" />
                    </div>

                    <div className="">
                        <button className='flex flex-row justify-center cursor-pointer bg-white text-[#333333] text-lg rounded-4xl w-full border-1 py-3'>
                            <img src="/images/logo-gmail.png" />
                            <span className='ml-4 text-[#333333] text-lg'>Continuar con Google</span>
                        </button>
                    </div>
                </div>
                <div className="w-3/5 flex justify-center items-center">
                    <img src="/images/grandfather-doctor.png" alt="Imagen de login, se encuentra anciano con doctores" />
                </div>
            </div>
        </div>
    </>
  )
}

export default LoginPage