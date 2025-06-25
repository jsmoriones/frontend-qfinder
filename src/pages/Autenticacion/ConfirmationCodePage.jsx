import React, { useState, useEffect } from 'react'
import VerificationInput from "react-verification-input";
import { jwtDecode } from 'jwt-decode';
import StatusAlert, { StatusAlertService } from 'react-status-alert'
//import Cookies from "js-cookie";
import {ButtonLarge} from "../../components/ui/"
import { verifyCount } from '../../services/AuthService';
import { useAuth } from '../../context/PacienteContext/AuthContext';
import 'react-status-alert/dist/status-alert.css'
import { useNavigate } from 'react-router-dom';

const ConfirmationCodePage = () => {
    const [code, setCode] = useState(null);
    const [msgError, setMsgError] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // Inicializar con 15 minutos por defecto
    const [isExpired, setIsExpired] = useState(false);

    const { user, loading, getTimeRemaining, isCodeStillValid, clearUserData, initializeCodeExpiry } = useAuth();
    const navigate = useNavigate();

    // Efecto para inicializar el tiempo de expiración cuando se carga el componente
    useEffect(() => {
        if (!loading && user) {
            // Inicializar el tiempo de expiración si no existe
            initializeCodeExpiry();
            
            // Obtener el tiempo restante
            const remainingTime = getTimeRemaining();
            console.log("Tiempo restante al cargar:", remainingTime);
            setTimeLeft(remainingTime);
            
            if (remainingTime <= 0) {
                setIsExpired(true);
            }
        }
    }, [loading, user, getTimeRemaining, initializeCodeExpiry]);

    // Efecto para el contador regresivo
    useEffect(() => {
        if (timeLeft <= 0 && timeLeft !== null) {
            setIsExpired(true);
            StatusAlertService.showError("Tu código ha expirado. Serás redirigido al registro.");
            clearUserData(); // Limpiar datos del contexto
            setTimeout(() => {
                navigate("/register");
            }, 3000);
            return;
        }

        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    const newTime = prevTime - 1;
                    // Actualizar también el localStorage para mantener sincronización
                    if (newTime <= 0) {
                        localStorage.removeItem("code_expiry_time");
                        localStorage.removeItem("user");
                    }
                    return newTime;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeLeft, navigate, clearUserData]);

    // Efecto para verificar si el usuario existe después de la carga
    // CORRECCIÓN: Solo redirigir si loading es false Y no hay usuario Y no hay datos en localStorage
    useEffect(() => {
        if (!loading) {
            // Verificar si hay datos del usuario en localStorage como respaldo
            const storedUser = localStorage.getItem("user");
            
            if (!user && !storedUser) {
                // Solo redirigir si no hay usuario ni en el contexto ni en localStorage
                console.log("No hay usuario en contexto ni localStorage, redirigiendo al registro...");
                navigate("/register");
            }
        }
    }, [user, loading, navigate]);

    // Función para formatear el tiempo en MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCode = async () => {
        if (isExpired) {
            StatusAlertService.showError("El código ha expirado. Serás redirigido al registro.");
            setTimeout(() => {
                navigate("/register");
            }, 2000);
            return;
        }

        if(!code){
            setMsgError(true)
        }else{
            if(code.length > 4){
                setMsgError(false)
                try {
                    const result = await verifyCount({
                        correo_usuario: user.correo,
                        codigo: code
                    });
                    console.log(result);
                    StatusAlertService.showSuccess(result.data.message);
                    setTimeout(() => {
                        navigate("/UserMessageRegister")
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

    // CORRECCIÓN: Verificar también localStorage antes de mostrar redirección
    const storedUser = localStorage.getItem("user");
    if (!user && !storedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-grisRatonRodilla">Redirigiendo al registro...</p>
                </div>
            </div>
        );
    }

    // CORRECCIÓN: Usar el usuario del contexto o del localStorage como fallback
    const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

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

export default ConfirmationCodePage