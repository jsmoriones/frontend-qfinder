import React, { useEffect, useState } from 'react'
import { ClipLoader, BounceLoader, PuffLoader } from "react-spinners";
import { getUsers } from '../../services/UserService';
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../../schemas/users';
import { Input, Label } from '../../components/ui';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#6D8AFD",
};

const UsuarioPage = () => {
    const [pacientes, setPacientes] = useState(null);
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");

    const { isOpen, open, close } = useModal();
    
      useEffect(() => {
        try {
            const fetchPacientes = async () => {
                const response = await getUsers();
                if(response?.status === 200){
                    setPacientes(response.data);
                    setLoading(false)
                    console.log(pacientes)
                }
            };
            fetchPacientes();
        } catch (error) {
            console.log(error);
        }
      }, []);
    
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(userSchema)
    });

    const handleSendData = () => {

    }

    const headerTableUser = ["nombre", "apellido", "identificacion", "direccion", "telefono", "correo", "estado", ""];
  return (
    <>
        <div className="p-8">
            <div className="mb-6 flex justify-between">
                <h1 className="text-2xl font-semibold text-[#374957]">
                    Lista de Usuarios
                </h1>
                <button
                    className='cursor-pointer bg-verdebtn py-1 px-2 rounded-lg text-white hover:bg-verde1 transition-all'
                    onClick={open}>
                    <i className="fa-solid fa-user-plus mr-2 text-lg"></i>
                    <span className='text-md'>Agregar Paciente</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                {
                    pacientes !== null ?
                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr className="bg-[#6D8AFD] text-white">
                                <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                                {
                                    headerTableUser.map((item, key) => (
                                        <th className="px-6 py-3 text-left text-sm font-medium" key={key}>
                                            {item}
                                        </th>
                                    ))
                                }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    
                                    pacientes.map((paciente, index) => (
                                        <tr key={paciente.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{paciente.nombre_usuario}</td>
                                            <td className="px-6 py-4">{paciente.apellido_usuario}</td>
                                            <td className="px-6 py-4">{paciente.identificacion_usuario}</td>
                                            <td className="px-6 py-4">{paciente.direccion_usuario}</td>
                                            <td className="px-6 py-4">{paciente.telefono_usuario}</td>
                                            <td className="px-6 py-4">{paciente.correo_usuario}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                    paciente.estado_usuario === "Activo"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {paciente.estado_usuario}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 space-x-5">
                                                <button className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer">
                                                    <i className="fa-solid fa-pencil text-xl"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-400 transition-all cursor-pointer">
                                                    <i class="fa-solid fa-trash text-xl"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    : (
                        <div className="flex justify-center items-center">
                            <PuffLoader
                                size={120}
                                color={"#6D8AFD"}
                                loading={loading}
                                speedMultiplier={5}
                            />
                        </div>
                    )
                }
            </div>
            </div>
        <AnimatedModal isOpen={isOpen} close={close} style={{maxWidth: "700px", width: "100%"}}>
            <h1 className="text-lg md:text-2xl text-[#111111] font-semibold my-6 text-center">Registrar usuario</h1>
            <form className='mt-10 lg:mt-14' onSubmit={handleSubmit(handleSendData)}>
                <div className="flex flex-col mb-3">
                    <Label htmlFor="name">Nombre de usuario:</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        {...register(
                            "nombre_usuario",
                            {required: true}
                        )}
                        autoFocus
                    />
                    {errors.nombre_usuario?.message && (
                        <p className="text-red-500">{errors.nombre_usuario?.message}</p>
                    )}
                </div>
            </form>
        </AnimatedModal>
    </>
  )
}

{/* <td className="px-6 py-4">
<span
    className={`px-2 py-1 text-xs rounded-full ${
    paciente.estado === "Activo"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
>
    {paciente.estado}
</span>
</td>
<td className="px-6 py-4 space-x-2">
<button className="text-blue-600 hover:underline">
    Editar
</button>
<button className="text-red-600 hover:underline">
    Eliminar
</button>
</td> */}
export default UsuarioPage;