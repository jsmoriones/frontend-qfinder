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
       <div className="flex items-center mb-4">
  <div className="mr-4 w-full">
    <Input placeholder="Search" className="px-3 py-2 w-full" />
  </div>
  <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded shadow">
    Crear comunidad
  </button>
</div>





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
              <div className="flex justify-around mb-4 pb-4">
              <button className="flex items-center  px-3 py-3 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer ">
  <span>Editar</span>
</button>
<div className='flex items-center px-3 py-2 border border-gray-400 rounded-lg bg-white text-lg font-medium text-black hover:bg-gray-100 cursor-pointer'>
<button className="flex items-center text-red-600 text-sm space-x-1">
  
       <i class="fa-solid fa-trash "></i>
       <a>Eliminar</a>
            </button>
            </div>

            </div>
            </div>
          ))}
        </div>

          </div>

          {/* Info Panel */}
          
        </div>
    
    
  );
}