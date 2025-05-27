import React from 'react'

const CardPaciente = () => {
  return (
    <div className='embla__slide rounded-lg bg-azulPastel1 p-3 w-full mr-5'>
        <div className="bg-azulPastel3 rounded-lg border-1 border-grisTarde2 flex">
            <div className="w-1/4 bg-azulPastel2 p-3 rounded-ss-lg rounded-es-lg flex flex-col items-center">
                <div className='relative w-fit rounded-full avatar-status'>
                    <img
                        className="w-20 h-20 rounded-full"
                        src="/images/avatar-paciente.png"
                        alt="Imagen Paciente"
                    />
                </div>
                <table className='bg-white w-full tablaPacienteHorario rounded-lg mt-6'>
                    <thead>
                        <th>
                            <div className='text-center'>Horas</div>
                        </th>
                    </thead>
                    <tbody>
                        <tr className='flex flex-col items-center'>
                        {
                            [1,2,3,4,5].map((item, key) => (
                                <tr key={key} className='w-full grid grid-cols-2 py-.5'>
                                    <td className='text-sm text-center'>7:00</td>
                                    <td className='text-sm text-center'>AM</td>
                                </tr>
                            ))
                        }
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="w-3/4 p-3">
                {/** Datos paciente */}
                <div className="flex justify-between py-6 gap-5 lg:space-0">
                    <p className="bg-white rounded-lg shadow-md font-semibold text-2xl px-3 py-1">Juan Carlos</p>
                    <p className="bg-white rounded-lg shadow-md font-semibold text-2xl px-3 py-1">78</p>
                </div>
                {/** Datos Salud */}
                <div className="bg-white rounded-lg py-5 px-3">
                    <p className="text-black text-shadow-md text-lg mb-5">Alzhéimer Etapa intermedia: </p>
                    <p className="text-black text-shadow-md text-md">Sintomas: </p>
                    <ul className='list-disc pl-5'>
                        <li className="text-black text-shadow-md text-md">perdida de memoria</li>
                        <li className="text-black text-shadow-md text-md">incapacidad de recibir instrucciones</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CardPaciente