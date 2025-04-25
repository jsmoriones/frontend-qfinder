import React from 'react'

const LoginPage = () => {
  return (
    <>
        <div className="mx-16 min-h-screen flex items-center">
            <div className="container mx-auto flex gap-12 h-full">
                <div className="w-2/5">
                    <h1 className="text-5xl text-[#111111] font-semibold my-6">Bienvenido a QfindeR</h1>
                    <p className="text-[rgba(102,102,102,80%)] text-2xl">Para un mejor despertar, soñemos con la protección social</p>

                    <form action="#" className='mt-14'>
                        <div className="flex flex-col mb-3">
                            <label htmlFor="email" className='text-base text-[#666666] mb-1'>Nombre de usuario o Email</label>
                            <input type="email" id="email" className='border-1 border-[#cdcdcd] rounded-lg p-2 text-md outline-0' />
                        </div>
                        <div className="flex flex-col mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className='text-base text-[#666666]'>Tu contraseña</label>
                                <a href="#">
                                    <span className='text-[rgba(102,102,102,80%)]'>Hiden</span>
                                </a>
                            </div>
                            <input type="password" id="password" className='border-1 border-[#cdcdcd] rounded-lg p-2 text-md outline-0' />
                        </div>
                        <div className="text-center my-6">
                            <input type="button" value="Sign In" className='cursor-pointer bg-[#505ABB] text-white text-lg px-2 w-2/5 py-3 rounded-4xl' />
                        </div>
                    </form>
                    <div className="flex justify-between items-center">
                        <p className="text-[#333333] text-base">¿No tienes una cuenta? <a href="#" className='underline'>Registrate</a></p>
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