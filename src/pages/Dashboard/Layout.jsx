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
      icon: <i className="fa-solid fa-house text-2xl text-[#374957]"></i>,
      badge: (
        <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
          Pro
        </span>
      ),
      link: "dashboard",
    },
    /*{
      name: "Paciente",
      icon: <i className="fa-regular fa-user text-2xl text-[#374957]"></i>,
      badge: (
        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
          3
        </span>
      ),
      link: "registro-paciente",
    },
    {
      name: "Recordatorio",
      icon: (
        <i className="fa-regular fa-calendar-days text-2xl text-[#374957]"></i>
      ),
      badge: null,
      link: "recordatorio",
    },*/
    {
      name: "Comunidades",
      icon: (
        <i className="fa-solid fa-users text-xl text-[#374957]"></i>
      ),
      badge: null,
      link: "comunidad",
    },
    {
      name: "Pacientes",
      icon: (
        <i className="fa-solid fa-hospital-user text-2xl text-[#374957]"></i>
      ),
      badge: null,
      link: "list_pacientes",
    },
    {
      name: "Usuarios",
      icon: (
        <i className="fa-solid fa-user-group text-xl text-[#374957]"></i>
      ),
      badge: null,
      link: "usuario?page=1",
    },
    {
      name: "Medicamentos",
      icon: (
        <i className="fa-solid fa-capsules text-2xl text-[#374957]"></i>
      ),
      badge: null,
      link: "medicamentos"
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
              {
                infoUser !== null ?
                <>
                  <div>{infoUser.nombre_usuario} {infoUser.apellido_usuario}</div>
                  <div className="font-medium truncate">{infoUser.correo_usuario}</div>
                </>
                : <div role="status">
                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
              }
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

        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;