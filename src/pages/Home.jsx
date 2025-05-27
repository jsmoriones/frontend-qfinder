import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
        <header className="sm:container mx-auto flex justify-between items-center py-2 px-3 lg:px-0">
            <figure>
            <img
                src="images/logo.png"
                className="w-16 mq1200:w-20"
                alt="Logo de la Empresa QfindeR"
            />
            </figure>
            <nav className="hidden lg:flex gap-x-14">
            <li className="list-none">
                <a href="#" className="text-lg mq1200:text-xl uppercase font-medium">
                Inicio
                </a>
            </li>
            <li className="list-none">
                <a href="#" className="text-lg mq1200:text-xl uppercase font-medium">
                Acerca de Nosotros
                </a>
            </li>
            <li className="list-none">
                <a href="#" className="text-lg mq1200:text-xl uppercase font-medium">
                Contactanos
                </a>
            </li>
            </nav>
            <div className="hidden lg:flex gap-x-5">
            <Link
                to="/login"
                className="py-1 px-4 text-[16px] mq1200:py-2 mq1200:px-6 bg-white border-azul border-[1px] text-azul uppercase rounded-lg shadow-md mq1200:text-[17px]"
            >
                Registrarse
            </Link>
            <Link
                to="/register"
                className="py-1 px-4 text-[16px] mq1200:py-2 mq1200:px-6 bg-azul text-white uppercase rounded-lg shadow-md mq1200:text-[17px]"
            >
                Inicio Sesion
            </Link>
            </div>
            <button className="w-7 lg:hidden">
            <img src="/images/menu.png" alt="Icono de menu movil" />
            </button>
        </header>
        <div id="header">
            {/* jQuery handles to place the header background images */}
            <div id="headerimgs">
            <div id="headerimg1" className="headerimg" />
            <div id="headerimg2" className="headerimg" />
            </div>
            {/* Slideshow controls */}
            <div id="headernav-outer">
            <div id="headernav">
                <div id="back" className="btn" />
                <div id="control" className="btn" />
                <div id="next" className="btn" />
            </div>
            </div>
            <div className="md:container mx-auto relative h-full w-full flex justify-center items-center md:block">
            <div className="md:absolute top-0 bottom-0 h-full flex flex-col justify-center items-center md:items-start md:gap-y-6">
                <h1 className="text-4xl md:text-6xl font-medium slider [text-shadow:2px_2px_1px_#00000030]">
                QfindeR
                </h1>
                <p className="text-xl md:text-3xl max-w-[500px] text-center md:text-left font-light slider [text-shadow:2px_2px_1px_#00000030]">
                Solicita tu servicio descargando la aplicacion, disponible en Android
                y IOS
                </p>
                <a
                href="#"
                className="py-1 md:py-2 px-6 md:px-10 bg-verdeClaro border-verdeOscuro border-[3px] text-white rounded-lg text-[20px] text-center inline mt-10"
                >
                Descargar Aquí
                </a>
            </div>
            </div>
        </div>
        <section className="my-14">
            <h2 className="font-normal text-center text-purpuraAzul text-[28px] mq810:text-[40px]">
            CARACTERISTICAS DE LA APP QfindeR
            </h2>
            <div className="container mx-auto mq810:flex justify-between gap-x-[5%] mt-16 gap-y-12 flex-wrap mq1360:flex-nowrap">
            <div className="flex-[40%] flex flex-col items-center    mq1360:block mq1360:flex-1">
                <figure className="bg-azulAgua w-60 h-60 p-10 rounded-full">
                <img src="/images/ayuda.png" alt="" />
                </figure>
                <p className="text-rojo text-2xl my-6">Comunicación Efectica</p>
                <p className="text-xl text-center mq1360:text-left">
                Ayuda al contacto entre auxiliar y familiar para tener una
                comunicación mas efectiva.
                </p>
            </div>
            <div className="flex-[40%] flex flex-col items-center    mq1360:block mq1360:flex-1">
                <figure className="bg-azulAgua w-60 h-60 p-10 rounded-full">
                <img src="/images/obrero.png" alt="" />
                </figure>
                <p className="text-rojo text-2xl my-6">Servicio de auxiliares</p>
                <p className="text-xl leading-relaxed text-center mq1360:text-left">
                Brindará una forma rápida de contactar o contratar a auxiliares de
                distintas empresas.
                </p>
            </div>
            <div className="flex-[40%] flex flex-col items-center    mq1360:block mq1360:flex-1">
                <figure className="bg-azulAgua w-60 h-60 p-10 rounded-full">
                <img src="/images/telefono-inteligente.png" alt="" />
                </figure>
                <p className="text-rojo text-2xl my-6">Ubicación en tiempo real</p>
                <p className="text-xl leading-relaxed text-center mq1360:text-left">
                Los familiares tendrán acceso a la ubicación del paciente todo el
                tiempo, para brindar mayor seguridad y tranquilidad.
                </p>
            </div>
            <div className="flex-[40%] flex flex-col items-center    mq1360:block mq1360:flex-1">
                <figure className="bg-azulAgua w-60 h-60 p-10 rounded-full">
                <img src="/images/servicio-al-cliente.png" alt="" />
                </figure>
                <p className="text-rojo text-2xl my-6">Atención al cliente</p>
                <p className="text-xl leading-relaxed text-center mq1360:text-left">
                Se contactara con las empresas y con el servicio de QfindeR para
                atender solicitudes, quejas y reclamos
                </p>
            </div>
            </div>
        </section>
        <section className="py-14 bg-bgServicios bg-cover bg-top">
            <h2 className="text-[40px] font-normal text-center text-purpuraAzul uppercase">
            Nuestros Servicios
            </h2>
            <div className="container mx-auto mt-16 flex flex-col">
            {/*<div class="w-12/12 flex flex-row gap-x-10 mq1360:gap-x-28">
            <div class="w-4/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
            <img src="images/obrero.png" alt="Logo de Doctor" class="w-24">
            <p class=" text-2xl mb-1 mt-8">Auxiliares</p>
            <p class="text-grisTexto text-lg">Tendrás contacto con auxiliares de diferentes empresas juntos sus recomendaciones y calificación.</p>
            </div>
            <div class="w-4/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
            <img src="images/lapiz1.png" alt="Logo de Doctor" class="w-24">
            <p class=" text-2xl mb-1 mt-8">Notas</p>
            <p class="text-grisTexto text-lg">Se tendrá un registro de notas donde el auxiliar redactara sus cuidados y rutinas que se realicen al paciente.</p>
            </div>
            <div class="w-4/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
            <img src="images/medios-de-comunicacion-en-masa1.png" alt="Logo de Doctor" class="w-24">
            <p class=" text-2xl mb-1 mt-8">Medios de comunicación</p>
            <p class="text-grisTexto text-lg">La app posee diferentes medios de comunicación, entre familiares- auxiliares, auxiliar-empresa, y familiar- empresa</p>
            </div>
        </div>*/}
            {/* gap-y-10 mq1360:gap-y-28 */}
            <div className="w-12/12 flex flex-wrap flex-row items-stretch justify-center gap-x-20 mq1360:gap-x-28 gap-y-10 mq1360:gap-y-20">
                <div className="w-11/12 mq1080:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                <img src="images/obrero.png" alt="Logo de Doctor" className="w-24" />
                <p className=" text-2xl mb-1 mt-8">Auxiliares</p>
                <p className="text-grisTexto text-lg">
                    Tendrás contacto con auxiliares de diferentes empresas juntos sus
                    recomendaciones y calificación.
                </p>
                </div>
                <div className="w-11/12 mq1080:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                <img src="images/lapiz1.png" alt="Logo de Doctor" className="w-24" />
                <p className=" text-2xl mb-1 mt-8">Notas</p>
                <p className="text-grisTexto text-lg">
                    Se tendrá un registro de notas donde el auxiliar redactara sus
                    cuidados y rutinas que se realicen al paciente.
                </p>
                </div>
                <div className="w-11/12 mq1080:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                <img
                    src="images/medios-de-comunicacion-en-masa1.png"
                    alt="Logo de Doctor"
                    className="w-24"
                />
                <p className=" text-2xl mb-1 mt-8">Medios de comunicación</p>
                <p className="text-grisTexto text-lg">
                    La app posee diferentes medios de comunicación, entre familiares-
                    auxiliares, auxiliar-empresa, y familiar- empresa
                </p>
                </div>
                <div className="w-11/12 mq1080:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                <img
                    src="images/telefono-inteligente.png"
                    alt="Logo de Doctor"
                    className="w-24"
                />
                <p className=" text-2xl mb-1 mt-8">Escaneo QR</p>
                <p className="text-grisTexto text-lg">
                    Facilitar por medio de un código QR el ingreso y revisión de las
                    notas que realicen los auxiliares.
                </p>
                </div>
                <div className="w-11/12 mq1080:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                <img src="images/lapiz1.png" alt="Logo de Doctor" className="w-24" />
                <p className=" text-2xl mb-1 mt-8">Notas</p>
                <p className="text-grisTexto text-lg">
                    Se tendrá un registro de notas donde el auxiliar redactara sus
                    cuidados y rutinas que se realicen al paciente.
                </p>
                </div>
                <div className="w-11/12 mq1080:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                <img
                    src="images/medios-de-comunicacion-en-masa1.png"
                    alt="Logo de Doctor"
                    className="w-24"
                />
                <p className=" text-2xl mb-1 mt-8">Medios de comunicación</p>
                <p className="text-grisTexto text-lg">
                    La app posee diferentes medios de comunicación, entre familiares-
                    auxiliares, auxiliar-empresa, y familiar- empresa
                </p>
                </div>
            </div>
            </div>
        </section>
        <section className="mq1080:bg-dapp py-20">
            <div className="mx-auto p-10 flex flex-col mq1080:flex-row">
            <div className="w-12/12 mq1080:w-6/12">
                <div className="w-12/12 mq1080:w-10/12 h-full flex flex-col justify-center">
                <h2 className="font-normal text-center mq1080:text-left text-purpuraAzul text-4xl mq810:text-[40px]">
                    ACERCA DE NOSOTROS
                </h2>
                <p className="text-2xl text-center mq1360:text-left mt-6">
                    Brindará una forma rápida de contactar o contratar a auxiliares de
                    distintas empresas.
                </p>
                </div>
            </div>
            <div className="w-12/12 mq1080:w-6/12 flex justify-center items-center mt-20 mq1080:mt-0">
                <div className="w-10/12 bg-bgAbuelaMedico bg-no-repeat bg-center bg-92%">
                <img
                    src="/images/abuela_medico.png"
                    alt="Abuela Auxiliar"
                    className="w-4/5 mx-auto"
                />
                </div>
            </div>
            </div>
        </section>
        <section className="bg-gradient-to-r from-azulClApp1 from-27% to-white to-87% py-20">
            <div className="container flex justify-between items-center mx-auto">
            <div className="w-5/12 gap-y-7 flex flex-col">
                <h2 className="font-normal text-center mq1080:text-left text-purpuraAzul text-4xl mq810:text-[40px]">
                Descarga La App QfindeR
                </h2>
                <p className="text-2xl text-center mq1360:text-left text-textoGris">
                Disponible en todos los dispositivos mobiles en Android y IOS
                </p>
                <div className="flex gap-x-6">
                <button className="w-3/12">
                    <img src="/images/g-play.png" alt="" />
                </button>
                <button className="w-3/12">
                    <img src="/images/app-store.png" alt="" />
                </button>
                </div>
            </div>
            <div className="w-5/12 bg-cldescarga bg-no-repeat bg-center bg-65%">
                {/*
            background-image: url(/images/elipse-movil.png);
            background-repeat: no-repeat;
            background-position: center;
            background-size: 65%;
            */}
                <div className="">
                <img
                    src="/images/d-movil.png"
                    alt="representa la descarga de la aplicacion movil"
                    className="animate-celular"
                />
                </div>
            </div>
            </div>
        </section>
    </>
  )
}

export default Home