import { useState } from 'react';
import { TitleDashboardSection } from '../../components/ui/TitleDashboardSection';
import { ButtonLarge } from '../../components/ui/ButtonLarge';
import { Input } from '../../components/ui/Input';

const mockCommunities = Array(6).fill({
  name: 'Familias Unidas',
  members: '1.2 mill. de miembros',
});

export default function Comunidad() {
  const [selectedCommunity, setSelectedCommunity] = useState(mockCommunities[0]);

  return (
    <div className="flex h-screen">
      
    

      <div className="flex-1 flex">
        {/* Community List */}
        <div className="w-1/3 bg-blue-100 p-4 overflow-y-auto">
          <TitleDashboardSection text="Comunidad" />
          <Input placeholder="Search" className="mb-4" />

          {mockCommunities.map((community, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 mb-3 bg-blue-200 rounded-lg cursor-pointer"
              onClick={() => setSelectedCommunity(community)}
            >
              <div className="flex items-center space-x-2">
                
                <div className="w-12 h-12 rounded-full overflow-hidden shadow">
  <img
    src="public\images\comunidadimagen1.png"
    alt="Avatar comunidad"
    className="w-full h-full object-cover rounded-full"
  />
</div>

                <div>
                  <p className="font-bold">{community.name}</p>
                  <p className="text-sm">{community.members}</p>
                </div>
              </div>
              <button className="text-blue-700 font-bold">Unirme</button>
            </div>
          ))}
        </div>

        {/* Chat & Info Section */}
        <div className="flex-1 flex">
          {/* Chat Area */}
          <div className="flex-1 bg-gray-100 flex flex-col justify-between">
            <div className="p-4 bg-blue-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Aquí puedes colocar tu imagen */}
                <div className="w-8 h-8 bg-white rounded-full">
<img
    src="public\images\comunidadimagen1.png"
    alt="Avatar comunidad"
    className="w-full h-full object-cover rounded-full"
  />
                </div>
                <p className="font-bold">{selectedCommunity.name} 1</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* ícono info */}
                <div className="w-5 h-5 bg-white rounded-full"><img
    src="public\images\comunidadimagen1.png"
    alt="Avatar comunidad"
    className="w-full h-full object-cover rounded-full"
  /></div>
                <button className="text-sm bg-white rounded px-2 py-1">Unirme</button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <div className="mb-2">
                <p className="text-red-500 font-bold">Morgan</p>
                <p className="bg-white p-2 rounded-lg shadow w-fit">Blalaskskksjsnajskasjkasjkskjas</p>
                <p className="text-sm text-right text-gray-500">12:00 p.m.</p>
              </div>
              <div>
                <p className="text-red-500 font-bold">Morgan</p>
                <p className="bg-white p-2 rounded-lg shadow w-fit">Blalaskskksjsnajskasjkasjkskjas</p>
                <p className="text-sm text-right text-gray-500">12:00 p.m.</p>
              </div>
            </div>
            <div className="p-4 text-center text-sm text-gray-500">
              Únete a esta comunidad para poder interactuar con los demás miembros
            </div>
          </div>

          {/* Info Panel */}
          <div className="w-80 bg-indigo-100 p-4 border-l">
            <div className="flex justify-between items-center mb-4">
              <button className="text-xl">✖</button>
              {/* Aquí puedes colocar tu imagen */}
              <div className="w-16 h-16 bg-white rounded-full border-b pb-4"><img
    src="public\images\comunidadimagen1.png"
    alt="Avatar comunidad"
    className="w-full h-full object-cover rounded-full"
  /></div>
            </div>
            <p className="font-bold text-lg mb-1">{selectedCommunity.name} 1</p>
            <p className="text-sm text-gray-600 mb-3">Comunidad 1,200,000 miembros</p>

            <div className="flex justify-around mb-4 border-b pb-4">
              <button className="flex items-center gap-1 px-4 py-3 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer ">
  <span>+</span>
  <span>Unirme</span>
</button>

<button className="flex items-center gap-1 px-4 py-3 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer">
  <span>↗</span>
  <span>Compartir</span>
</button>

            </div>

            <p className="text-sm font-semibold mb-1">Descripción de la comunidad</p>
            <p className="text-sm text-gray-600 mb-4">Se creó el 29/04/2025</p>

            <button className="flex items-center text-red-600 text-sm space-x-1">
              <img
    src="public\images\comunidadimagen2reportar.png"
    alt="Avatar comunidad"
    className="w-40 h-10 object-cover rounded-full cursor-pointer items-end "
  />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}