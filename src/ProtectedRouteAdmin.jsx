import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "./context/PacienteContext/AuthContext";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import StatusAlert, { StatusAlertService } from "react-status-alert";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function ProtectedRouteAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [load, setLoad] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {signIn, isAuthenticated} = useAuth();
  const navigate = useNavigate()

  const onSubmit = async(data) => {
    try {
      setLoad(true)
      const buildData = {
          correo_usuario: data.email,
          contrasena_usuario: data.password
      }
      const response = await signIn(buildData);
      console.log("response superadmin: ", response)
      if(response.status === 200){
        if(response.data.rol === "Super"){
          StatusAlertService.showSuccess("Tus datos son correctos, eres un administrador");
          setTimeout(() => {
            navigate("/superAdmin/dash")
          }, 2000)
        }
      }
      /*if(response.status === 200){
          try {
              const authToken = jwtDecode(response.data.token)
              if(authToken){
                  Cookie.set("login", response.data.token)
                  console.log( Cookie.get("login") )
                  StatusAlertService.showSuccess("Tus datos son correctos, te redijiremos al Dashboard automaticamente");

                  console.log("Tokencito Super Admin: ", Cookie.get("login"))
              }
          } catch (error) {
              console.log(error.message)
          }
      }*/

      if(response.status === 400){
          StatusAlertService.showWarning(response.message);
      }
  } catch (error) {
      console.log(error)
      StatusAlertService.showError(error.message);
  }finally{
    setLoad(false)
  }
  };

  return (
    <>
      <StatusAlert />
      <div className="min-h-screen flex bg-blue-50">
        {/* Lado izquierdo con imagen amplia */}
        <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url("/images/superdoctor.jpg")' }}></div>

        {/* Lado derecho con formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Inicio de Sesión</h1>
          <img src="/images/logo-admin.png" alt="Logo Empresa" className="w-[180px] mb-6" />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5">
            {/* Email */}
            <div>
              <label className="block text-blue-700 font-medium">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full mt-1 p-2 border border-blue-300 rounded"
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-blue-700 font-medium">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full mt-1 p-2 border border-blue-300 rounded pr-10"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-2 top-4 text-blue-500"
                  onClick={() => setShowPassword(!showPassword)}
                  >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>

            {/* Enlace de contacto */}
            <div className="text-sm text-blue-600">
              ¿Tienes problemas al iniciar sesión?{" "}
              <a href="/contacto" className="underline font-medium hover:text-blue-800">
                Contacta con nosotros
              </a>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded"
              disabled={load}
              >
              {load ? 
                <div className="w-full flex justify-center items-center">
                  <svg ariaHidden="true" className="w-8 h-8 text-blue-100 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
              : "Iniciar Sesión"}
            </button>
          </form>
          </div>
          </div>
      
    </>
  );
}
