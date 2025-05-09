import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from 'embla-carousel-react'
import CardPaciente from "../../components/CardPaciente";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel()

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const handleClickOutside = (event) => {
    if (
      isDropdownOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      avatarButtonRef.current &&
      !avatarButtonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };
  
  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px es el breakpoint 'sm' en Tailwind
    };
    
    // Comprobar al inicio
    checkIfMobile();
    
    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar evento
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  


  return (
    <>
      {/* Carousel Pacientes */}
      <div className="relative py-5">
              <button className="embla__prev cursor-pointer bg-azulPiso p-.5 w-[35px] h-[35px] rounded-full absolute left-0 top-[45%] z-40 text-2xl" onClick={scrollPrev}>
                <i className="fa-solid fa-angles-left"></i>
              </button>
              <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                  {
                    [1,2,3,4,5,6].map((item, key) => (
                      <CardPaciente key={key} />
                    ))
                  }
                </div>
              </div>
              <button className="embla__next cursor-pointer bg-azulPiso p-.5 w-[35px] h-[35px] rounded-full absolute right-0 top-[45%] z-40 text-2xl" onClick={scrollNext}>
                <i class="fa-solid fa-angles-right"></i>
              </button>
            </div>

            <div className="flex mt-8 gap-5">
              <div className="w-1/2 p-4 bg-azulPastel1">
                <div className="bg-[rgba(255,255,255,85%)] p-3 mb-4">
                  <p className="text-3xl font-bold">Agenda de Actividades físicas</p>
                  <p className="text-xl font-bold">Actividades mas cerca a realizar.</p>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="div-date bg-white p-3 flex flex-col gap-5">
                    <p className="bg-grisClaro border-2 border-lila flex flex-col justify-center text-center text-2xl font-bold px-3 py-2 flex-1">
                      <span>28</span>
                      <span>Abril</span>
                    </p>
                    <p className="bg-grisClaro border-2 border-lila flex flex-col justify-center text-center text-2xl font-bold px-3 py-2 flex-1">
                      <span>29</span>
                      <span>Abril</span>
                    </p>
                  </div>
                  <div className="flex-1 bg-white p-3">
                    <div className="bg-grisClaro border-2 border-lila p-3 flex justify-between mb-6">
                      <div className="data-actividad flex-1">
                        <p className="text-2xl font-bold text-lila mb-1">Juan Carlos:</p>
                        <ul className='list-disc pl-5'>
                          <li className="text-2xl font-bold text-black">Caminata de 3 km.</li>
                        </ul>
                      </div>
                      <div className="hora-fecha flex flex-col">
                        <button type="button" class="text-black rounded-lg text-md px-5 py-1 text-center inline-flex items-center me-2 mb-2 bg-verdeClaro">
                          <i class="fa-solid fa-clock-rotate-left mr-2"></i>
                          8:00 AM
                        </button>
                        <button type="button" class="text-black rounded-lg text-md px-5 py-1 text-center inline-flex items-center me-2 mb-2 bg-azulPastel4">
                          <i class="fa-solid fa-futbol mr-2"></i>
                          hecha
                        </button>
                      </div>
                    </div>
                    <div className="bg-grisClaro border-2 border-lila p-3 flex justify-between">
                      <div className="data-actividad flex-1">
                        <p className="text-2xl font-bold text-lila mb-1">Juan Carlos:</p>
                        <ul className='list-disc pl-5'>
                          <li className="text-2xl font-bold text-black">Caminata de 3 km.</li>
                        </ul>
                      </div>
                      <div className="hora-fecha flex flex-col">
                        <button type="button" class="text-black rounded-lg text-md px-5 py-1 text-center inline-flex items-center me-2 mb-2 bg-verdeClaro">
                          <i class="fa-solid fa-clock-rotate-left mr-2"></i>
                          8:00 AM
                        </button>
                        <button type="button" class="text-black rounded-lg text-md px-5 py-1 text-center inline-flex items-center me-2 mb-2 bg-azulPastel4">
                          <i class="fa-solid fa-futbol mr-2"></i>
                          hecha
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 p-4 bg-azulPastel1">
                  <div className="bg-white rounded-lg p-5">
                    <p className="text-3xl text-center">Accesos Rapidos</p>
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