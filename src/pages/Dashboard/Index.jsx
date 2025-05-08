import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from 'embla-carousel-react'
import { useAuth } from "../../context/PacienteContext/AuthContext";
import CardPaciente from "../../components/CardPaciente";

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel()

  const navigate = useNavigate();
  const {logout, infoUser} = useAuth();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  

  // Lista de elementos de menú con sus iconos y nombres
  const menuItems = [
    {
      name: "Kanban",
      icon: (
        <i className="fa-solid fa-house text-2xl text-[#374957]"></i>
      ),
      badge: (
        <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
          Pro
        </span>
      ),
    },
    {
      name: "Inbox",
      icon: (
        <i className="fa-regular fa-user text-2xl text-[#374957]"></i>
      ),
      badge: (
        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
          3
        </span>
      ),
    },
    {
      name: "Users",
      icon: (
        <i className="fa-regular fa-calendar-days text-2xl text-[#374957]"></i>
      ),
      badge: null,
    },
    {
      name: "Products",
      icon: (
        <i className="fa-solid fa-magnifying-glass text-2xl text-[#374957]"></i>
      ),
      badge: null,
    },
    {
      name: "Sign In",
      icon: (
        <i className="fa-solid fa-gear text-2xl text-[#374957]"></i>
      ),
      badge: null,
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex">
      {/* Botón para móviles */}
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Barra lateral */}
      <nav
        className={`${
          isMobile ? "fixed" : "sticky top-0"
        } h-screen transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-16"
        } ${isMobile && !isExpanded ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#6D8AFD] ">
          <ul className="space-y-10 font-medium">
            <li>
              <a
                href="#"
                className={`flex items-center p-2  text-gray-900 rounded-full dark:text-white hover:bg-gray-100 group`}
                onClick={toggleSidebar}
              >
                <i class="fa-solid fa-bars text-2xl text-[#374957]"></i>
                <span
                  className={`ms-3 whitespace-nowrap transition-opacity duration-300 text-[#374957] ${
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Dashboard
                </span>
                {/*isExpanded && item.badge*/}
              </a>
            </li>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center p-2 ${isExpanded ? "" : "bg-white"} text-gray-900 rounded-full dark:text-white hover:bg-[#5879ff] group`}
                  onClick={index === 0 ? toggleSidebar : undefined}
                >
                  {item.icon}
                  <span
                    className={`ms-3 whitespace-nowrap transition-opacity duration-300 text-white ${
                      isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
                    {item.name}
                  </span>
                  {/*isExpanded && item.badge*/}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 transition-all duration-300 ease-in-out">
      <div className="px-4 py-3 flex justify-between items-center bg-blancoGris">
        <div className="logo">
          <img src="/images/logo.png" alt="Logo QfindeR" className="logo-img" />
        </div>
        <div className="right-topbar flex justify-center items-center relative"> {/* Añadimos 'relative' aquí */}
          <button className={`cursor-pointer text-white text-xl px-4 py-2 rounded-xl border-[#7D0000] border-2 bg-[#FF4949]`}>
            Emergencia
          </button>
          <button className="mx-5 cursor-pointer">
            <i className="fa-regular fa-bell text-grisAzul text-3xl"></i>
          </button>
          <button
            type="button"
            ref={avatarButtonRef}
            onClick={toggleDropdown}
            className="w-10 h-10 rounded-full cursor-pointer"
            aria-expanded={isDropdownOpen}
            aria-controls="userDropdown"
          >
            <img src="/images/avatar-dashboard.png" alt="Avatar de registrado en dashboard" />
          </button>
          {/* Dropdown menu */}
          <div
            ref={dropdownRef}
            id="userDropdown"
            className={`z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600 absolute top-full right-0 origin-top-right mt-2 ${
              isDropdownOpen ? 'block' : 'hidden'
            }`}
          >
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div>{infoUser.nombre} {infoUser.apellido}</div>
              <div className="font-medium truncate">{infoUser.email}</div>
            </div>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Settings
                </a>
              </li>
              <li>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left cursor-pointer"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>



          </div>
        </div>

        <div className="p-8">
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
                  <div className="div-date bg-white p-3">
                    <p className="bg-grisClaro border-2 border-lila flex flex-col text-center text-2xl font-bold px-3 py-2 mb-6">
                      <span>28</span>
                      <span>Abril</span>
                    </p>
                    <p className="bg-grisClaro border-2 border-lila flex flex-col text-center text-2xl font-bold px-3 py-2">
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
                  </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;