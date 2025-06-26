import React, { useState, useEffect, useContext, createContext } from 'react'
import VerificationInput from "react-verification-input";
import { jwtDecode } from 'jwt-decode';
import StatusAlert, { StatusAlertService } from 'react-status-alert'
//import Cookies from "js-cookie";
import {ButtonLarge, Input, Label} from "../../components/ui/"
import { recuperarW, verificarCodigoW, cambiarPasswordW } from '../../services/AuthService';
import { useAuth } from '../../context/PacienteContext/AuthContext';
import 'react-status-alert/dist/status-alert.css'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Cookie from "js-cookie";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const correoSchema = z.object({
    correo_usuario: z
      .string()
      .email({
        message: "Porfavor Ingresa un Email Válido",
      }),
});
const passwordSchema = z
  .object({
    nuevaContrasena: z.string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .max(20, "La nueva contraseña no puede exceder los 20 caracteres"),
    repetirContrasena: z.string()
  })
  .refine(data => data.nuevaContrasena === data.repetirContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["repetirContrasena"]
  })

export const ContextPassword = createContext();

export const PasswordProvider = ({children}) => {
    const [currentView, setCurrentView] = useState("sendEmailForRecovery");
    return(
        <ContextPassword.Provider
            value={{
                currentView, setCurrentView
            }}
        >
            {children}
        </ContextPassword.Provider>
    )
}

const WriteCode = () => {
    const [code, setCode] = useState(null);
    const [msgError, setMsgError] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // Inicializar con 15 minutos por defecto
    const [isExpired, setIsExpired] = useState(false);

    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const {setCurrentView} = useContext(ContextPassword)

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedExpiry = localStorage.getItem("code_expiry_time");

        if (!storedUser || !storedExpiry) {
            setCurrentView("sendEmailForRecovery")
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        const now = new Date().getTime();
        const expiry = parseInt(storedExpiry, 10);
        const remainingTime = Math.floor((expiry - now) / 1000);

        if (remainingTime <= 0) {
            setIsExpired(true);
        } else {
            setTimeLeft(remainingTime);
        }

        setLoading(false);
    }, [navigate]);

    const clearUserData = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("code_expiry_time");
    }

    // Función para formatear el tiempo en MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCode = async () => {
        if (isExpired) {
            StatusAlertService.showError("El código ha expirado");
            setTimeout(() => {
                setCurrentView("sendEmailForRecovery")
            }, 2000);
            return;
        }

        if(!code){
            setMsgError(true)
        }else{
            if(code.length > 4){
                setMsgError(false)
                try {
                    const result = await verificarCodigoW({
                        correo: currentUser.correo,
                        codigo: code
                    });
                    console.log(result);
                    StatusAlertService.showSuccess(result.data.message);

                    if(result.status === 200){
                        const authToken = jwtDecode(result.data.token) // Asumo que el token viene en result.data.token
                        if(authToken){
                            Cookie.set("login", result.data.token)
                            console.log( Cookie.get("login") )
                            StatusAlertService.showSuccess("Tus datos son correctos.");
                            console.log("Tokencito: ", Cookie.get("login"))
                        }
                    }

                    setTimeout(() => {
                        setCurrentView("writeNewPassword")
                    }, 4000)
                    /*try {
                        const authToken = jwtDecode(result.data.token)
                        console.log(authToken)
                        if(authToken){
                            cookies.set("login_authorization", result.data.token, {
                                expires: new Date(authToken.exp * 1000)
                            })
                            console.log( cookies.get("login_authorization") )

                        }
                    } catch (error) {
                        console.log(error)
                    }*/
                } catch (error) {
                    StatusAlertService.showError(error.message);
                }
                
                //console.log("Existe code: ", code)
            }else{
                setMsgError(true)
            }
        }
    }

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azulRodilla mx-auto mb-4"></div>
                    <p className="text-grisRatonRodilla">Verificando código...</p>
                </div>
            </div>
        );
    }



    return (
        <>
            <StatusAlert />
            <div className="mx-16 min-h-screen flex items-center line-bg">
                <div className="container mx-auto flex gap-12 h-full">
                    <div className="w-2/5 py-8">
                        <h1 className="text-5xl text-[#111111] font-semibold my-6">Bienvenido a QfindeR</h1>
                        <p className="text-grisRatonRodilla text-2xl">Porque tu eres lo más importante para nosotros, esperamos ofrecer el mejor servicio para ti</p>

                        <div className="text-center mt-6">
                            <i className="fa-solid fa-envelope-open text-azulRodilla text-6xl"></i>
                            <p className="text-3xl font-semibold my-1">Ingresa tu Código</p>
                            <p className="text-grisRatonRodilla text-xl">Nosotros enviamos un código al correo: <br /> <span className='font-bold'>{currentUser?.correo || "ejemplo@ejemplo.com"}</span></p>
                            
                            {/* Contador regresivo */}
                            <div className="mt-4">
                                <p className={`text-lg font-semibold ${timeLeft <= 60 ? 'text-red-600' : 'text-azulRodilla'}`}>
                                    Tiempo restante: {formatTime(timeLeft)}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 60 ? 'bg-red-600' : 'bg-azulRodilla'}`}
                                        style={{width: `${(timeLeft / (15 * 60)) * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex flex-col items-center">
                            <div className="flex flex-col gap-4 justify-center mb-10">
                                <VerificationInput
                                    value={code}
                                    length={5}
                                    placeholder=""
                                    disabled={isExpired}
                                    classNames={{
                                        container: "container",
                                        character: `character ${isExpired ? 'opacity-50' : ''}`,
                                        characterInactive: "character--inactive",
                                        characterSelected: "character--selected",
                                        characterFilled: "character--filled",
                                    }}
                                    onChange={prev => setCode(prev)}
                                    autoFocus={!isExpired}
                                />
                                {msgError && (
                                    <p className="text-red-700 text-center text-md">Debes Completar el Código***</p>
                                )}
                                {isExpired && (
                                    <p className="text-red-700 text-center text-md font-semibold">
                                        ⚠️ El código ha expirado. Serás redirigido al registro...
                                    </p>
                                )}
                            </div>
                            <ButtonLarge
                                text={isExpired ? "Código Expirado" : "Enviar"}
                                onClick={handleCode}
                                disabled={isExpired}
                                className={isExpired ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </div>
                        
                    </div>
                    <div className="w-3/5 flex justify-center items-center">
                        <img src="/images/send-code-email.png" alt="Imagen de verificacion de codigo" />
                    </div>
                </div>
            </div>
        </>
    )
}

const SendEmailForRecovery = () => {
    const [loading, setLoading] = useState(false);

    const {setCurrentView} = useContext(ContextPassword)

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(correoSchema)
    });

    const handleSendData = async (data) => {
        setLoading(true);
        try {
            const response = await recuperarW(data);
            if (response.status === 200) {
                StatusAlertService.showSuccess(response.data.mensaje);

                // Guardar el correo y el tiempo de expiración en localStorage
                localStorage.setItem("user", JSON.stringify({ correo: data.correo_usuario }));
                const expiryTime = new Date().getTime() + 15 * 60 * 1000;
                localStorage.setItem("code_expiry_time", expiryTime.toString());

                setCurrentView("writeCode");
            }
        } catch (error) {
            StatusAlertService.showWarning(error.message);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="mx-16 min-h-screen flex items-center line-bg">
                <div className="container mx-auto flex gap-12 h-full">
                    <div className="w-2/5 py-8">
                        <h1 className="text-5xl text-[#111111] font-semibold my-6">Bienvenido a QfindeR</h1>
                        <p className="text-grisRatonRodilla text-2xl">Porque tu eres lo más importante para nosotros, esperamos ofrecer el mejor servicio para ti</p>

                        <div className="text-center mt-6">
                            <i className="fa-solid fa-at text-azulRodilla text-6xl"></i>
                            <p className="text-3xl font-semibold my-1">Porfavor, ingresa tu correo electornico</p>
                            <form className='' onSubmit={handleSubmit(handleSendData)}>
                                <div className="flex flex-col mb-3">
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="correo@correo.com"
                                        autoFocus
                                        {...register(
                                            "correo_usuario",
                                            {required: true}
                                        )}
                                    />
                                    {errors.correo_usuario?.message && (
                                        <p className="text-red-500">{errors.correo_usuario?.message}</p>
                                    )}
                                </div>
                                {
                                    loading ?
                                        <div className="w-full flex justify-center items-center">
                                            <svg ariaHidden="true" className="w-8 h-8 text-[#505ABB] animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                            </svg>
                                        </div>
                                    : <button className='cursor-pointer bg-[#505ABB] text-white text-lg px-2 w-2/5 py-3 rounded-4xl' type='submit'>Enviar</button>
                                }
                            </form>
                            {/* <p className="text-grisRatonRodilla text-xl">Nosotros enviamos un código al correo: <br /> <span className='font-bold'>ejemplo@ejemplo.com</span></p> */}
                            
                        </div>
                        
                    </div>
                    <div className="w-3/5 flex justify-center items-center">
                        <img src="/images/send-code-email.png" alt="Imagen de verificacion de codigo" />
                    </div>
                </div>
            </div>
    )
}

const WriteNewPassword = () => {
    const [loading, setLoading] = useState(false);

    const {setCurrentView} = useContext(ContextPassword)
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(passwordSchema)
    })

    const onSubmit = async (data) => {
    setLoading(true)
    try {
      const token = Cookie.get("login")
      if (!token) {
        StatusAlertService.showError("Token de autenticación no encontrado.")
        return
      }

      const payload = {
        nuevaContrasena: data.nuevaContrasena
      }

      await cambiarPasswordW(payload)

      StatusAlertService.showSuccess("Contraseña actualizada correctamente. Serás redirigido...")
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      StatusAlertService.showError(error.message || "Ocurrió un error al actualizar la contraseña.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <StatusAlert />
      <div className="mx-16 min-h-screen flex items-center line-bg">
        <div className="container mx-auto flex gap-12 h-full">
          <div className="w-2/5 py-8">
            <h1 className="text-5xl text-[#111111] font-semibold my-6">Restablecer Contraseña</h1>
            <p className="text-grisRatonRodilla text-2xl">Ingresa una nueva contraseña segura para tu cuenta</p>

            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Nueva contraseña"
                    {...register("nuevaContrasena")}
                  />
                  {errors.nuevaContrasena && (
                    <p className="text-red-600 text-sm">{errors.nuevaContrasena.message}</p>
                  )}
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Repetir contraseña"
                    {...register("repetirContrasena")}
                  />
                  {errors.repetirContrasena && (
                    <p className="text-red-600 text-sm">{errors.repetirContrasena.message}</p>
                  )}
                </div>

                <div className="w-full flex justify-center mt-4">
                  {loading ? (
                    <svg ariaHidden="true" className="w-8 h-8 text-[#505ABB] animate-spin fill-white" viewBox="0 0 100 101" fill="none">
                      <path d="M100 50.5908C100 78.2051..." fill="currentColor" />
                      <path d="M93.9676 39.0409..." fill="currentFill" />
                    </svg>
                  ) : (
                    <button
                      type="submit"
                      className="bg-[#505ABB] text-white px-6 py-3 rounded-4xl text-lg"
                    >
                      Guardar Contraseña
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="w-3/5 flex justify-center items-center">
            <img src="/images/send-code-email.png" alt="Imagen cambio contraseña" />
          </div>
        </div>
      </div>
    </>
  )
}

const RecoveryPassword = () => {

    const {currentView} = useContext(ContextPassword)

    return (
        <>
            <StatusAlert />
            {currentView === "sendEmailForRecovery" ? <SendEmailForRecovery /> : null}
            {currentView === "writeCode" ? <WriteCode /> : null}
            {currentView === "writeNewPassword" ? <WriteNewPassword /> : null}
        </>
    )
}

export default RecoveryPassword