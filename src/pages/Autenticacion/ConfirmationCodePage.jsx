import React, { useState } from 'react'
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

    const { user } = useAuth();
    //const cookies = new Cookies();
    const navigate = useNavigate()

    const handleCode = async () => {
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
                        navigate("/dashboard")
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
                        <p className="text-grisRatonRodilla text-xl">Nosotros enviamos un código al correo: <br /> <span className='font-bold'>{user.correo || "ejemplo@ejemplo.com"}</span></p>
                    </div>
                    <div className="mt-6 flex flex-col items-center">
                        <div className="flex flex-col gap-4 justify-center mb-10">
                            <VerificationInput
                                value={code}
                                length={5}
                                placeholder=""
                                classNames={{
                                    container: "container",
                                    character: "character",
                                    characterInactive: "character--inactive",
                                    characterSelected: "character--selected",
                                    characterFilled: "character--filled",
                                }}
                                onChange={prev => setCode(prev)}
                                autoFocus={true}
                            />
                            {msgError && (
                                <p className="text-red-700 text-center text-md">Debes Completar el Código***</p>
                            )}
                        </div>
                        <ButtonLarge
                            text={"Enviar"}
                            onClick={handleCode}
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