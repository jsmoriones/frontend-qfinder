import React, { useState } from 'react'
import { TitleDashboardSection } from '../../components/ui/TitleDashboardSection'
import { ButtonLarge } from '../../components/ui/ButtonLarge'

const PerfilCuidador = () => {

  const [visibleEdit, setVisibleEdit] = useState(false);

  return (
    <>
      <TitleDashboardSection
        text={"Cuidador"}
      />

      <div className='rounded-2xl overflow-hidden flex w-full'>
        <div className="bg-azulClaro2 py-14 px-5 w-1/3">
          <figure className={`${visibleEdit ?"":"border-b-grisTarde3 border-b-2 "} text-center pb-10`}>
            {
              <div className="relative aspect-11 w-36 mx-auto rounded-full overflow-hidden">
                <img src="/images/avatar-dashboard.png" alt="avatar usuario registrado" className='aspect-11 w-36 mx-auto rounded-full' />
                {visibleEdit ? (
                  <button className='absolute top-0 bottom-0 left-0 right-0 hover:bg-azulPastel4Opacity bg-opacity-50 cursor-pointer transition-all'>
                    <i class="fa-solid fa-pencil text-2xl text-black"></i>
                  </button>
                ) : null}
              </div>
            }
            {visibleEdit ? null : <figcaption className='font-bold text-2xl mt-3'>Morgan</figcaption>}
          </figure>

          {/* Informacion */}
          {
            visibleEdit ? (
              <div className="flex justify-between">
                <p className="font-bold text-xl text-azulPastel6">Nombre:</p>
                <input
                  type="text"
                  defaultValue={"Morgan"}
                  className='bg-transparent border-b-black border-b-2 text-black outline-none text-lg px-1'
                />
              </div>
            )
            : (
              <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <p className="font-bold text-xl text-azulPastel6">Edad:</p>
                  <p className="font-bold text-xl text-black">23 años</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-bold text-xl text-azulPastel6">Número:</p>
                  <p className="font-bold text-xl text-black">3108838235</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-bold text-xl text-azulPastel6">Email:</p>
                  <p className="font-bold text-xl text-black">jess@gmail.com</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-bold text-xl text-azulPastel6">Dirección:</p>
                  <p className="font-bold text-xl text-black">#12n28 - la paz</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-bold text-xl text-azulPastel6">Parentezco:</p>
                  <p className="font-bold text-xl text-black">Hijo</p>
                </div>

                <input
                  type="button"
                  className='rounded-lg bg-azulPastel5 border-2 border-black text-white font-bold text-lg w-fit px-8 py-1 mx-auto cursor-pointer'
                  value="Editar"
                  onClick={() => setVisibleEdit(true)}
                />
              </div>
            )
          }
        </div>
        <div className="bg-azulPastel1 p-3 px-5 w-2/3 flex flex-col">
          {
            visibleEdit ? (
              <>
                <p className="font-bold text-2xl mt-3">Editar Perfil</p>
                <div className="flex flex-col gap-5 pl-8 mt-5">
                  <div className="flex justify-between">
                    <p className="font-bold text-xl text-azulPastel6">Edad:</p>
                    <input
                      type="text"
                      defaultValue={"23 años"}
                      className='bg-transparent border-b-black border-b-2 text-black outline-none text-lg px-1'
                    />
                  </div>
                  <div className="flex justify-between">
                    <p className="font-bold text-xl text-azulPastel6">Número:</p>
                    <input
                      type="text"
                      defaultValue={"3108838235"}
                      className='bg-transparent border-b-black border-b-2 text-black outline-none text-lg px-1'
                    />
                  </div>
                  <div className="flex justify-between">
                    <p className="font-bold text-xl text-azulPastel6">Email:</p>
                    <input
                      type="text"
                      defaultValue={"jess@gmail.com"}
                      className='bg-transparent border-b-black border-b-2 text-black outline-none text-lg px-1'
                    />
                  </div>
                  <div className="flex justify-between">
                    <p className="font-bold text-xl text-azulPastel6">Dirección:</p>
                    <input
                      type="text"
                      defaultValue={"#12n28 - la paz"}
                      className='bg-transparent border-b-black border-b-2 text-black outline-none text-lg px-1'
                    />
                  </div>
                  <div className="flex justify-between">
                    <p className="font-bold text-xl text-azulPastel6">Parentezco:</p>
                    <input
                      type="text"
                      defaultValue={"Hijo"}
                      className='bg-transparent border-b-black border-b-2 text-black outline-none text-lg px-1'
                    />
                  </div>
                </div>
              </>
            ) : null
          }
          <p className="font-bold text-2xl mt-3">Certificados</p>
          <div className="flex gap-4 mt-5 mb-8">
            <button className='bg-white rounded-xl border-2 border-rojopdf py-1 px-2 flex items-center gap-2 cursor-pointer'>
              <i className="fa-solid fa-file-pdf text-rojopdf text-4xl"></i>
              <p className="text-sm text-black">Certificacionmedica.pdf</p>
            </button>
            <button className='bg-white rounded-xl border-2 border-rojopdf py-1 px-2 flex items-center gap-2 cursor-pointer'>
              <i className="fa-solid fa-file-pdf text-rojopdf text-4xl"></i>
              <p className="text-sm text-black">Certificacionmedica.pdf</p>
            </button>
          </div>
          <input
            type="button"
            className='rounded-lg bg-azulPastel5 border-2 border-black text-white font-bold text-lg w-fit px-8 py-1 mx-auto cursor-pointer'
            value="Agregar certificado"
          />
          {
            visibleEdit ? (
              <>
                <div className="flex justify-between w-2/3 mx-auto mt-14 mb-5">
                  <button className='rounded-lg bg-rojobtn border-2 border-black text-white font-bold text-md w-fit px-4 py-1 mx-auto cursor-pointer' onClick={() => setVisibleEdit(false)}>Cancelar</button>
                  <button className='rounded-lg bg-verdebtn border-2 border-black text-white font-bold text-md w-fit px-4 py-1 mx-auto cursor-pointer'>Guardar</button>
                </div>
              </>
            ) : null
          }
        </div>
      </div>
    </>
  )
}

export default PerfilCuidador