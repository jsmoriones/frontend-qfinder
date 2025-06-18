import React from 'react'

const Home = () => {
    <>
    <header class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <img src="logo_qfinder.svg" alt="Logo QfindeR" class="h-10" />
        <nav class="space-x-6 font-medium text-gray-700 hidden md:flex">
        <a href="#inicio" class="hover:text-[#4bbffa]">Inicio</a>
        <a href="#caracteristicas" class="hover:text-[#4bbffa]">Características</a>
        <a href="#servicios" class="hover:text-[#4bbffa]">Servicios</a>
        <a href="#acerca" class="hover:text-[#4bbffa]">Acerca de</a>
        </nav>
        <div class="space-x-3">
        <button class="text-[#4bbffa] border border-[#4bbffa] px-4 py-2 rounded-full hover:bg-[#4bbffa] hover:text-white transition">Registrarse</button>
        <button class="bg-[#4bbffa] text-white px-4 py-2 rounded-full hover:bg-[#399edb] transition">Iniciar sesión</button>
        </div>
    </div>
    </header>
    <section id="inicio" class="pt-28 pb-20 bg-gradient-to-r from-blue-100 to-white">
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
        <div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">QfindeR</h1>
        <p class="text-gray-600 mb-6 text-lg">Solicita tu servicio descargando la aplicación, disponible en Android y iOS.</p>
        <a href="#" class="bg-[#4bbffa] text-white px-6 py-3 rounded-full shadow hover:bg-[#399edb] transition">Descargar aquí</a>
        </div>
        <img src="mockup_celular.png" alt="App QfindeR" class="w-full max-w-sm mx-auto" />
    </div>
    </section>
    <section id="caracteristicas" class="bg-white py-20">
    <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Características destacadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="bg-gray-50 p-6 rounded-xl text-center shadow hover:shadow-lg transition">
            <img src="icono1.svg" alt="Comunicación" class="mx-auto mb-4 w-12 h-12" />
            <h3 class="font-semibold mb-2">Comunicación Efectiva</h3>
            <p class="text-gray-600 text-sm">Contacto más directo entre auxiliar y familiar.</p>
        </div>
        {/* <!-- Repites para las otras 3 características --> */}
        </div>
    </div>
    </section>
    <section id="servicios" class="py-20 bg-gray-100">
    <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <img src="auxiliar_icon.svg" class="w-10 h-10 mb-4" />
            <h4 class="font-semibold mb-2">Auxiliares</h4>
            <p class="text-sm text-gray-600">Contacta con auxiliares calificados fácilmente.</p>
        </div>
        {/* <!-- Más tarjetas de servicios --> */}
        </div>
    </div>
    </section>
    <section id="acerca" class="py-20 bg-white">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">
        <div>
        <h2 class="text-3xl font-bold mb-4">Acerca de Nosotros</h2>
        <p class="text-gray-600">Brindamos una forma ágil y segura de contratar auxiliares de confianza mediante la app QfindeR.</p>
        </div>
        <img src="ilustracion_personas.svg" alt="Equipo" class="max-w-sm mx-auto" />
    </div>
    </section>
    <section class="py-20 bg-gradient-to-r from-white to-blue-100">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-10">
        <div>
        <h2 class="text-2xl font-bold mb-4">Descarga la app QfindeR</h2>
        <p class="text-gray-600 mb-4">Disponible en Android y iOS</p>
        <div class="flex space-x-4">
            <img src="googleplay.svg" alt="Google Play" class="h-12" />
            <img src="appstore.svg" alt="App Store" class="h-12" />
        </div>
        </div>
        <img src="mockup_celular.png" alt="App Móvil" class="w-40 md:w-60" />
    </div>
    </section>
    <footer class="bg-[#f5fafe] text-gray-700 py-10">
    <div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
        
        {/* <!-- Logo y breve descripción --> */}
        <div>
        <img src="logo_qfinder.svg" alt="QfindeR Logo" class="h-10 mb-4" />
        <p class="text-sm">QfindeR facilita la conexión entre auxiliares, empresas y familias, mejorando la atención de personas que lo necesitan.</p>
        </div>

        {/* <!-- Navegación --> */}
        <div>
        <h4 class="font-semibold mb-3">Navegación</h4>
        <ul class="space-y-2 text-sm">
            <li><a href="#inicio" class="hover:text-[#4bbffa] transition">Inicio</a></li>
            <li><a href="#caracteristicas" class="hover:text-[#4bbffa] transition">Características</a></li>
            <li><a href="#servicios" class="hover:text-[#4bbffa] transition">Servicios</a></li>
            <li><a href="#acerca" class="hover:text-[#4bbffa] transition">Acerca de</a></li>
        </ul>
        </div>

        {/* <!-- Enlaces útiles --> */}
        <div>
        <h4 class="font-semibold mb-3">Recursos</h4>
        <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-[#4bbffa] transition">Términos y condiciones</a></li>
            <li><a href="#" class="hover:text-[#4bbffa] transition">Política de privacidad</a></li>
            <li><a href="#" class="hover:text-[#4bbffa] transition">Soporte</a></li>
        </ul>
        </div>

        {/* <!-- Redes sociales --> */}
        <div>
        <h4 class="font-semibold mb-3">Síguenos</h4>
        <div class="flex space-x-4">
            <a href="#" aria-label="Facebook"><img src="facebook.svg" alt="Facebook" class="h-6" /></a>
            <a href="#" aria-label="Instagram"><img src="instagram.svg" alt="Instagram" class="h-6" /></a>
            <a href="#" aria-label="Twitter"><img src="twitter.svg" alt="Twitter" class="h-6" /></a>
        </div>
        </div>

    </div>

    {/* <!-- Separador inferior --> */}
    <div class="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2025 QfindeR. Todos los derechos reservados.
    </div>
    </footer>
    </>
}

export default Home