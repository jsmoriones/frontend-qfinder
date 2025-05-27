import React, { useState, useEffect, useRef, } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/PacienteContext/AuthContext";

const Layout = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  const navigate = useNavigate();
  const {logout, infoUser} = useAuth();
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
      name: "Inicio",
      icon: (
        <i className="fa-solid fa-house text-2xl text-[#374957]"></i>
      ),
      badge: (
        <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
          Pro
        </span>
      ),
      link: "dashboard"
    },
    {
      name: "Paciente",
      icon: (
        <i className="fa-regular fa-user text-2xl text-[#374957]"></i>
      ),
      badge: (
        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
          3
        </span>
      ),
      link: "registro-paciente"
    },
    {
      name: "Recordatorio",
      icon: (
        <i className="fa-regular fa-calendar-days text-2xl text-[#374957]"></i>
      ),
      badge: null,
      link: "recordatorio"
    },
    /*{
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
    }*/
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
                <Link
                  to={item.link}
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
                </Link>
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
              <div>Michael Solano</div>
              <div className="font-medium truncate">michaelsolano@gmail.com</div>
            </div>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Dashboard
                </a>
              </li>
              <li>
                <Link to="/cuidador-perfil" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Mi Perfil
                </Link>
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
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;