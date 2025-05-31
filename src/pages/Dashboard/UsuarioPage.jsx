import React, { useEffect, useState } from 'react'
import { PuffLoader } from "react-spinners";
import AnimatedModal, { useModal } from '@jdthornton/animated-modal';
import { useForm } from 'react-hook-form';
import StatusAlert, { StatusAlertService } from 'react-status-alert'
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { getUsers, registerUser, editUser, removeUser } from '../../services/UserService';
import { userSchema } from '../../schemas/users';
import { Input, Label } from '../../components/ui';
import { clear } from 'dom-helpers';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#6D8AFD",
};

const UsuarioPage = () => {
    const [pacientes, setPacientes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEdit, setUserEdit] = useState(null);

    const { isOpen, open, close } = useModal();
    
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm({
        resolver: zodResolver(userSchema)
    });

    useEffect(() => {
        if(userEdit){
            reset(userEdit);
        }else{
            reset({})
        }
    }, [userEdit, reset]);

    useEffect(() => {
    try {
        fetchPacientes();
    } catch (error) {
        console.log(error);
    }
    }, []);
    

    const fetchPacientes = async () => {
        const response = await getUsers();
        console.log(response.data)
        if(response?.status === 200){
            setPacientes(response.data);
            setLoading(false)
        }
    };

    const handleSendData = async (data) => {
        try {
            
            let response; //await registerUser(data);
            if(userEdit){
                response = await editUser(data, userEdit.id_usuario);
                console.log("response de cuando edito el usuario: ", response)

                if(response.status === 500){
                    close();
                    StatusAlertService.showError("Hubo un error en el servidor.");
                }else if(response.status === 200){
                    close();
                    StatusAlertService.showSuccess("Usuario actualizado correctamente");
                    fetchPacientes();
                    setUserEdit(null)
                }

            }else{
                response = await registerUser(data);
                if(response.status === 200){
                    reset({});
                    close();
                    fetchPacientes();
                    StatusAlertService.showSuccess("Se registro correctamente el usuario");
                }
            }
            if(response.status === 400){
                close();
                StatusAlertService.showWarning("Hubo un error, revisa tu informacion");
            }

        } catch (error) {
            close();
            console.log("Error al registrar un usuario: ", error);
            StatusAlertService.showError("Hay un error desde el servidor.");
        }
    }

    const handleEditUser = data => {
        console.log("Usuario a editar: ", data)
        setUserEdit(data)
        open()
    }

    const handleRemoveUser = (id) => {
        console.log("Usuario a Eliminar: ", id);

        Swal.fire({
            title: "¿Estas seguro de realizar esta acción?",
            text: "Si eliminas un usuario no podrás volver a recuperarlo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, deseo borrarlo!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await removeUser(id);
                if(response.status === 200){
                    fetchPacientes();
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El usuario se elimino correctamente",
                        icon: "success"
                    });
                }
            }
        });
    }

    const headerTableUser = ["nombre", "apellido", "identificacion", "direccion", "telefono", "correo", "estado", ""];
  return (
    <>
        <StatusAlert />
        <div className="p-8">
            <div className="mb-6 flex justify-between">
                <h1 className="text-2xl font-semibold text-[#374957]">
                    Lista de Usuarios
                </h1>
                <button
                    className='cursor-pointer bg-verdebtn py-1 px-2 rounded-lg text-white hover:bg-verde1 transition-all'
                    onClick={() => {
                        reset({})
                        setUserEdit(null)
                        open()
                    }}>
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
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{paciente.nombre_usuario}</td>
                                            <td className="px-6 py-4">{paciente.apellido_usuario}</td>
                                            <td className="px-6 py-4">{paciente.identificacion_usuario}</td>
                                            <td className="px-6 py-4">{paciente.direccion_usuario}</td>
                                            <td className="px-6 py-4">{paciente.telefono_usuario.substring(0,10)}</td>
                                            <td className="px-6 py-4">{paciente.correo_usuario.substring(0,15)}</td>
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
                                            <td className="px-6 py-4 space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer"
                                                    onClick={() => handleEditUser(paciente)}>
                                                    <i className="fa-solid fa-pencil text-xl"></i>
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-400 transition-all cursor-pointer"
                                                    onClick={() => handleRemoveUser(paciente.id_usuario)}>
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
        <AnimatedModal isOpen={isOpen} close={close} style={{maxWidth: "700px", width: "100%", marginTop: 20, marginBottom: 20, overflowY: "scroll"}}>
            <h1 className="text-lg md:text-2xl text-[#111111] font-semibold text-center">{userEdit == null ? "Registrar usuario" : "Editar Usuario"}</h1>
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
                <div className="flex flex-col mb-3">
                    <Label htmlFor="lastName">Apellido de usuario:</Label>
                    <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        {...register(
                            "apellido_usuario",
                            {required: true}
                        )}
                        autoFocus
                    />
                    {errors.apellido_usuario?.message && (
                        <p className="text-red-500">{errors.apellido_usuario?.message}</p>
                    )}
                </div>
                <div className="flex flex-col mb-3">
                    <Label htmlFor="identificacion">Identificación:</Label>
                    <Input
                        type="text"
                        id="identificacion"
                        name="identificacion"
                        {...register(
                            "identificacion_usuario",
                            {required: true}
                        )}
                        autoFocus
                    />
                    {errors.identificacion_usuario?.message && (
                        <p className="text-red-500">{errors.identificacion_usuario?.message}</p>
                    )}
                </div>
                <div className="flex flex-col mb-3">
                    <Label htmlFor="direccion">Dirección residencial:</Label>
                    <Input
                        type="text"
                        id="direccion"
                        name="direccion"
                        {...register(
                            "direccion_usuario",
                            {required: true}
                        )}
                        autoFocus
                    />
                    {errors.direccion_usuario?.message && (
                        <p className="text-red-500">{errors.direccion_usuario?.message}</p>
                    )}
                </div>
                <div className="flex flex-col mb-3">
                    <Label htmlFor="telefono">Telefono del usuario:</Label>
                    <Input
                        type="text"
                        id="telefono"
                        name="telefono"
                        {...register(
                            "telefono_usuario",
                            {required: true}
                        )}
                        autoFocus
                    />
                    {errors.telefono_usuario?.message && (
                        <p className="text-red-500">{errors.telefono_usuario?.message}</p>
                    )}
                </div>
                <div className="flex flex-col mb-3">
                    <Label htmlFor="email">Correo Electrónico:</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        {...register(
                            "correo_usuario",
                            {required: true}
                        )}
                        autoFocus
                    />
                    {errors.correo_usuario?.message && (
                        <p className="text-red-500">{errors.correo_usuario?.message}</p>
                    )}
                </div>
                <div className="flex flex-col mb-3">
                    <Label htmlFor="password">Contraseña:</Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        {...register(
                            "contrasena_usuario",
                            {required: true}
                        )}
                        autoFocus
                    />
                    {errors.contrasena_usuario?.message && (
                        <p className="text-red-500">{errors.contrasena_usuario?.message}</p>
                    )}
                </div>
                <div className="flex w-full justify-end space-x-2">
                    <button
                        className='cursor-pointer bg-grisAzul py-2 px-3 rounded-lg text-white hover:bg-oscurity transition-all'
                        onClick={open}>
                        <span className='text-md'>Aceptar</span>
                    </button>
                    <button
                        className='cursor-pointer bg-rojobtn py-2 px-3 rounded-lg text-white hover:bg-rojo1 transition-all'
                        onClick={() => {
                            close()
                            reset()
                        }}>
                        <span className='text-md'>Cancelar</span>
                    </button>
                </div>
            </form>
        </AnimatedModal>
    </>
  )
}
export default UsuarioPage;