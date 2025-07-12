import React from 'react'

const UserMessageRegister = () => {
    const radialGradientStyle = {
        backgroundImage: 'radial-gradient(circle at 50% top, #2592FF, #79caff',
    };
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={radialGradientStyle}
    >
      <img src="/images/user-movil-sin-bg.png" alt="usuario con celular para iniciar sesion" className='animate-fade w-3/12' />
      {/* Contenido de tu página, por ejemplo: */}
      <h1 className="text-white text-3xl font-bold text-shadow-lg/20 animate-fade-left text-center">Ya estas registrado en Qfinder, ahora podrás acceder desde nuestra aplicación móvil.</h1>
      <h2 className="text-white text-2xl font-bold text-shadow-lg mt-2 animate-fade-right text-center">¿Aún no la tienes en tu dispositivo móvil?, descargala ahora mismo. <a href="https://qfinder-deploy-4ktr.vercel.app/Qfinder.apk" target='_blank' className='bg-white text-[#2592FF] px-2 rounded-2xl transition-all hover:text-blue-800'>¡Descargar Click Aqui!</a></h2>
      <a href="/" className='text-white transition-all hover:underline text-xl mt-4'>Volver al inicio</a>
    </div>
  )
}

export default UserMessageRegister