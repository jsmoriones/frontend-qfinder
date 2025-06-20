import React from 'react'
import "./Home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
const images = [
  {
    image: "slide-1.jpg",
    title: "QfindeR",
    text: "Solicita tu servicio descargando la aplicación",
  },
  {
    image: "abuelosolo.jpg",
    title: "Atención especializada",
    text: "Disfruta de una atención personalizada",
  },
  {
    image: "otonio.jpg",
    title: "Servicios confiables",
    text: "Confianza, calidad y cuidado para tus seres queridos",
  }
];

const Home = () => {
    const settings = {
        dots: true,
        infinite: true,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };
    return(
    <>
        <header className="sm:container mx-auto flex justify-between items-center py-2 px-3 lg:px-0">
            <figure>
                <img src="images/logo.png" className="w-16 custom-mq1200\:w-20" alt="Logo de la Empresa QfindeR" />
            </figure>

            {/* <nav className="hidden lg:flex gap-x-14">
                <li className="list-none">
                    <a href="#" className="text-lg custom-mq1200\:text-xl uppercase font-semibold">Inicio</a>
                </li>
                <li className="list-none">
                    <a href="#" className="text-lg custom-mq1200\:text-xl uppercase font-semibold">Acerca de Nosotros</a>
                </li>
                <li className="list-none">
                    <a href="#" className="text-lg custom-mq1200\:text-xl uppercase font-semibold">Contactanos</a>
                </li>
            </nav> */}

            <div className="hidden lg:flex gap-x-5">
                <Link to="/register" className="py-1 px-4 text-[16px] mq1200:py-2 mq1200:px-6 bg-white border-azul border-[1px] text-azul uppercase rounded-lg shadow-md mq1200:text-[17px]">Registrarse</Link>
                <Link to="/login" className="py-1 px-4 text-[17px] mcustom-mq1200\:py-2 custom-mq1200\:px-6 bg-azul text-white uppercase rounded-lg shadow-md custom-mq1200\:text-\[17px\]">Inicio Sesion</Link>
            </div>

            <button className="w-7 lg:hidden">
                <img src="/images/menu.png" alt="Icono de menu movil" />
            </button>
        </header>
        <div className="relative">
            <Slider {...settings}>
                {images.map((slide, index) => (
                <div key={index} className="h-[80vh] relative bg-black">
                    <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(/images/${slide.image})`,
                    }}
                    >
                    <div className="h-full flex flex-col justify-center items-center text-white px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold drop-shadow">{slide.title}</h1>
                        <p className="text-xl md:text-2xl mt-4 max-w-xl">{slide.text}</p>
                        <a
                        href="#"
                        className="mt-8 py-3 px-8 bg-verdeClaro border-verdeOscuro border-4 rounded-xl text-lg"
                        >
                        Descargar Aquí
                        </a>
                    </div>
                    </div>
                </div>
                ))}
            </Slider>
        </div>

        <section className="my-14">
            <h2 className="font-semibold text-center text-purpuraAzul text-[28px] md:text-[35px]">CARACTERISTICAS DE LA APP QfindeR</h2>
            
            <div className="container mx-auto md:flex justify-between gap-x-[5%] mt-16 gap-y-12 flex-wrap mq1360:flex-nowrap">
                <div className="flex-[40%] flex flex-col items-center    md:flex-1">
                <figure className="bg-azulAgua w-60 h-60 p-10 rounded-full">
                    <img src="/images/ayuda.png" alt="" />
                </figure>
                <p className="text-rojo text-2xl my-6">Comunicación Efectica</p>
                <p className="text-xl text-center mq1360:text-left">Ayuda al contacto entre auxiliar y familiar para tener una comunicación mas efectiva.</p>
                </div>

                <div className="flex-[40%] flex flex-col items-center    md:flex-1">
                <figure className="bg-azulAgua w-60 h-60 p-10 rounded-full">
                    <img src="/images/obrero.png" alt="" />
                </figure>
                <p className="text-rojo text-2xl my-6">Servicio de auxiliares</p>
                <p className="text-xl leading-relaxed text-center mq1360:text-left">Brindará una forma rápida de contactar o contratar a auxiliares de distintas empresas.</p>
                </div>

                <div className="flex-[40%] flex flex-col items-center    md:flex-1">
                <figure className="bg-azulAgua w-60 h-60 p-10 rounded-full">
                    <img src="/images/telefono-inteligente.png" alt="" />
                </figure>
                <p className="text-rojo text-2xl my-6">Ubicación en tiempo real</p>
                <p className="text-xl leading-relaxed text-center mq1360:text-left">Los familiares tendrán acceso a la ubicación del paciente todo el tiempo, para brindar  mayor seguridad y tranquilidad.</p>
                </div>

                <div className="flex-[40%] flex flex-col items-center    md:flex-1">
                <figure className="bg-azulAgua w-60 h-60 p-10 rounded-full">
                    <img src="/images/servicio-al-cliente.png" alt="" />
                </figure>
                <p className="text-rojo text-2xl my-6">Atención al cliente</p>
                <p className="text-xl leading-relaxed text-center mq1360:text-left">Se contactara con  las empresas y con el servicio de QfindeR para atender solicitudes, quejas y reclamos</p>
                </div>
            </div>
        </section>

        <section class="py-14 bg-bgServicios bg-cover bg-top">
            <h2 class="text-[40px] font-normal text-center text-purpuraAzul uppercase">Nuestros Servicios</h2>

            <div class="container mx-auto mt-16 flex flex-col">
                {/* <!--<div class="w-12/12 flex flex-row gap-x-10 mq1360:gap-x-28">
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
                </div>--> */}
                <div class="w-12/12 flex flex-wrap flex-row items-stretch justify-center gap-x-20 mq1360:gap-x-28 gap-y-10 mq1360:gap-y-20">
                    <div class="w-11/12 lg:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                        <img src="images/obrero.png" alt="Logo de Doctor" class="w-24" />
                        <p class=" text-2xl mb-1 mt-8">Auxiliares</p>
                        <p class="text-grisTexto text-lg">Tendrás contacto con auxiliares de diferentes empresas juntos sus recomendaciones y calificación.</p>
                    </div>
                    <div class="w-11/12 lg:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                        <img src="images/lapiz1.png" alt="Logo de Doctor" class="w-24" />
                        <p class=" text-2xl mb-1 mt-8">Notas</p>
                        <p class="text-grisTexto text-lg">Se tendrá un registro de notas donde el auxiliar redactara sus cuidados y rutinas que se realicen al paciente.</p>
                    </div>
                    <div class="w-11/12 lg:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                        <img src="images/medios-de-comunicacion-en-masa1.png" alt="Logo de Doctor" class="w-24" />
                        <p class=" text-2xl mb-1 mt-8">Medios de comunicación</p>
                        <p class="text-grisTexto text-lg">La app posee diferentes medios de comunicación, entre familiares- auxiliares, auxiliar-empresa, y familiar- empresa</p>
                    </div>
                    <div class="w-11/12 lg:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                        <img src="images/telefono-inteligente.png" alt="Logo de Doctor" class="w-24" />
                        <p class=" text-2xl mb-1 mt-8">Escaneo QR</p>
                        <p class="text-grisTexto text-lg">Facilitar por medio de un código QR el ingreso y revisión de las notas que realicen los auxiliares.</p>
                    </div>
                    <div class="w-11/12 lg:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                        <img src="images/lapiz1.png" alt="Logo de Doctor" class="w-24" />
                        <p class=" text-2xl mb-1 mt-8">Notas</p>
                        <p class="text-grisTexto text-lg">Se tendrá un registro de notas donde el auxiliar redactara sus cuidados y rutinas que se realicen al paciente.</p>
                    </div>
                    <div class="w-11/12 lg:w-3/12 p-8 bg-grisTrasparente border-[1px] border-black rounded-xl">
                        <img src="images/medios-de-comunicacion-en-masa1.png" alt="Logo de Doctor" class="w-24" />
                        <p class=" text-2xl mb-1 mt-8">Medios de comunicación</p>
                        <p class="text-grisTexto text-lg">La app posee diferentes medios de comunicación, entre familiares- auxiliares, auxiliar-empresa, y familiar- empresa</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-dapp py-20">
            <div class="mx-auto p-10 flex flex-col lg:flex-row">
                <div class="w-12/12 lg:w-6/12">
                    <div class="w-12/12 lg:w-10/12 h-full flex flex-col justify-center">
                        <h2 class="font-normal text-center lg:text-left text-purpuraAzul text-4xl md:text-[40px]">ACERCA DE NOSOTROS</h2>

                        <p class="text-2xl text-center xl:text-left mt-6">Brindará una forma rápida de contactar o contratar a auxiliares de distintas empresas.</p>
                    </div>
                </div>
                <div class="w-12/12 lg:w-6/12 flex justify-center items-center mt-20 lg:mt-0">
                    <div class="w-10/12 bg-bgAbuelaMedico bg-no-repeat bg-contain bg-center bg-92">
                        <img src="/images/abuela_medico.png" alt="Abuela Auxiliar" class="w-4/5 mx-auto" />
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-descarga py-20">
            <div class="container flex justify-between items-center mx-auto">
                <div class="w-5/12 gap-y-7 flex flex-col">
                    <h2 class="font-normal text-center lg:text-left text-purpuraAzul text-4xl md:text-[40px]">Descarga La App QfindeR</h2>
                    <p class="text-2xl text-center xl:text-left text-textoGris">Disponible en todos los dispositivos mobiles en Android y IOS</p>
                    <div class="flex gap-x-6 justify-center">
                        <button class="w-3/12">
                            <img src="/images/g-play.png" alt="" />
                        </button>
                        {/* <button class="w-3/12">
                            <img src="/images/app-store.png" alt="" />
                        </button> */}
                    </div>
                </div>
                <div class="w-5/12 bg-cldescarga bg-no-repeat bg-center bg-contain bg-65">
                    <div class="">
                        <img src="/images/d-movil.png" alt="representa la descarga de la aplicacion movil" class="animate-celular" />
                    </div>
                </div>
            </div>
        </section>
    </>
    )
}

export default Home