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
        <div className="w-1/1 bg-[rgba(109,138,253,0.25)] bg-opacity-20 p-4 overflow-y-auto  ">
          <TitleDashboardSection text="Comunidad" />
          <Input placeholder="Search" className="mb-4" />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded shadow">
  Crear comunidad
</button>



          {mockCommunities.map((community, i) => (
            <div
              key={i}
              className="flex items-center mt-4 justify-between p-3 mb-3 bg-blue-200 rounded-lg cursor-pointer"
              onClick={() => setSelectedCommunity(community)}
            >
              
              <div className="flex items-center space-x-2">
                
                <div className="w-12 h-12 rounded-full overflow-hidden shadow  ">
  <img
    src="public\images\comunidadimagen1.png"
    alt="Avatar comunidad"
    className="w-full h-full object-cover rounded-full"
  />
</div>

                <div className=''>
                
                  <p className="font-bold">{community.name}</p>
                  <p className="text-sm">{community.members}</p>
                </div>
              </div>
              <button className="text-blue-700 font-bold cursor-pointer">Unirme</button>
            </div>
          ))}
        </div>

          </div>

          {/* Info Panel */}
          <div className="w-80 bg-indigo-100 p-4">
            <div className="flex justify-between items-center mb-4">
              <button className="text-xl cursor-pointer">✖</button>
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
  <span>Editar</span>
</button>

<button className="flex items-center gap-1 px-4 py-3 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer">
  <span>↗</span>
  <span>Compartir</span>
</button>

            </div>
<div className="mb-4 border-b pb-4">
            <p className="text-sm font-semibold mb-1">Descripción de la comunidad</p>
            <p className="text-sm text-gray-600 mb-4">Se creó el 29/04/2025</p></div>

            <button className="flex items-center text-red-600 text-sm space-x-1">
              <img
    src="public\images\comunidadimagen2reportar.png"
    alt="Avatar comunidad"
    className="w-40 h-10 object-cover rounded-full cursor-pointer items-end "
  />
            </button>
          </div>
        </div>
    
    
  );
}