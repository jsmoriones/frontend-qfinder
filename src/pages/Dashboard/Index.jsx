import React from "react";
import Slider from "react-slick";
import Cookies from "js-cookie";
import CardPaciente from "../../components/CardPaciente";

const Dashboard = () => {

  var settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 448,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      }
    ]
  };
  console.log(Cookies)
  const token = Cookies.get("token")

  console.log(token);
  

  return (
    <>
      {/* Carousel Pacientes */}
      <div className="container p-5">
        <div className="py-5">
          <Slider {...settings}>
            {[1, 2, 3, 4, 5, 6,7,8].map((item, index) => (
              <CardPaciente key={index} />
            ))}
          </Slider>
        </div>
      </div>

      <div className="flex mt-8 gap-5 p-8 flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 bg-azulPastel1">
          <div className="bg-[rgba(255,255,255,85%)] p-3 mb-4">
            <p className="text-xl lg:text-3xl font-bold">Agenda de Actividades físicas</p>
            <p className="text-lg lg:text-xl font-bold">Actividades mas cerca a realizar.</p>
          </div>
          <div className="flex justify-between gap-4">
            <div className="div-date bg-white p-3 flex flex-col gap-5">
              <p className="bg-grisClaro border-2 border-lila flex flex-col justify-center text-center text-xl lg:text-2xl font-bold px-3 py-2 flex-1">
                <span>28</span>
                <span>Abril</span>
              </p>
              <p className="bg-grisClaro border-2 border-lila flex flex-col justify-center text-center text-xl lg:text-2xl lg:text-2xl font-bold px-3 py-2 flex-1">
                <span>29</span>
                <span>Abril</span>
              </p>
            </div>
            <div className="flex-1 bg-white p-3">
              <div className="bg-grisClaro border-2 border-lila p-2 lg:p-3 flex justify-between mb-6">
                <div className="data-actividad flex-1">
                  <p className="text-xl lg:text-2xl font-bold text-lila mb-1">Juan Carlos:</p>
                  <ul className='list-disc pl-5'>
                    <li className="text-xl lg:text-2xl font-bold text-black">Caminata de 3 km.</li>
                  </ul>
                </div>
                <div className="hora-fecha flex flex-col">
                  <button type="button" class="text-black rounded-lg text-sm lg:text-md px-5 py-1 text-center inline-flex items-center me-2 mb-2 bg-verdeClaro">
                    <i class="fa-solid fa-clock-rotate-left mr-2"></i>
                    8:00 AM
                  </button>
                  <button type="button" class="text-black rounded-lg text-sm lg:text-md px-5 py-1 text-center inline-flex items-center me-2 mb-2 bg-azulPastel4">
                    <i class="fa-solid fa-futbol mr-2"></i>
                    hecha
                  </button>
                </div>
              </div>
              <div className="bg-grisClaro border-2 border-lila p-2 lg:p-3 flex justify-between">
                <div className="data-actividad flex-1">
                  <p className="text-xl lg:text-2xl font-bold text-lila mb-1">Juan Carlos:</p>
                  <ul className='list-disc pl-5'>
                    <li className="text-xl lg:text-2xl font-bold text-black">Caminata de 3 km.</li>
                  </ul>
                </div>
                <div className="hora-fecha flex flex-col">
                  <button type="button" class="text-black rounded-lg text-sm lg:text-md px-5 py-1 text-center inline-flex items-center me-2 mb-2 bg-verdeClaro">
                    <i class="fa-solid fa-clock-rotate-left mr-2"></i>
                    8:00 AM
                  </button>
                  <button type="button" class="text-black rounded-lg text-sm lg:text-md px-5 py-1 text-center inline-flex items-center me-2 mb-2 bg-azulPastel4">
                    <i class="fa-solid fa-futbol mr-2"></i>
                    hecha
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-4 bg-azulPastel1">
            <div className="bg-white rounded-lg p-5">
              <p className="text-xl lg:text-3xl text-center">Accesos Rapidos</p>
              <div className="grid grid-cols-3 grid-rows-2 mt-6">
                <div className="flex flex-col items-center aspect-11 p-3">
                  <figure className="bg-azulPastel5 rounded-lg border-2 border-azulFuerte overflow-hidden max-w-40 p-6 h-40">
                    <img src="/images/perfil-enfermero.png" alt="Icono Perfil ENfermero" className="w-full h-full object-contain" />
                  </figure>
                  <p className="text-xl mt-2 text-center">Perfil</p>
                </div>
                <div className="flex flex-col items-center aspect-11 p-3">
                  <figure className="bg-azulPastel5 rounded-lg border-2 border-azulFuerte overflow-hidden max-w-40 p-6 h-40">
                    <img src="/images/notes-pencil.png" alt="Icono Perfil ENfermero" className="w-full h-full object-contain" />
                  </figure>
                  <p className="text-xl mt-2 text-center">Registro de cuidados</p>
                </div>
                <div className="flex flex-col items-center aspect-11 p-3">
                  <figure className="bg-azulPastel5 rounded-lg border-2 border-azulFuerte overflow-hidden max-w-40 p-6 h-40">
                    <img src="/images/service-client.png" alt="Icono Perfil ENfermero" className="w-full h-full object-contain" />
                  </figure>
                  <p className="text-xl mt-2 text-center">Servicio al cliente</p>
                </div>
                <div className="flex flex-col items-center aspect-11 p-3">
                  <figure className="bg-azulPastel5 rounded-lg border-2 border-azulFuerte overflow-hidden max-w-40 p-6 h-40">
                    <img src="/images/community.png" alt="Icono Perfil ENfermero" className="w-full h-full object-contain" />
                  </figure>
                  <p className="text-xl mt-2 text-center">Comunidad</p>
                </div>
                <div className="flex flex-col items-center aspect-11 p-3">
                  <figure className="bg-azulPastel5 rounded-lg border-2 border-azulFuerte overflow-hidden max-w-40 p-6 h-40">
                    <img src="/images/activitys.png" alt="Icono Perfil ENfermero" className="w-full h-full object-contain" />
                  </figure>
                  <p className="text-xl mt-2 text-center">Actividades</p>
                </div>
                <div className="flex flex-col items-center aspect-11 p-3">
                  <figure className="bg-azulPastel5 rounded-lg border-2 border-azulFuerte overflow-hidden max-w-40 p-6 h-40">
                    <img src="/images/medicina.png" alt="Icono Perfil ENfermero" className="w-full h-full object-contain" />
                  </figure>
                  <p className="text-xl mt-2 text-center">Medicamentos</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;