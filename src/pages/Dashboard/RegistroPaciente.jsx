import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TitleDashboardSection } from "../../components/ui/TitleDashboardSection";
import { useNavigate } from "react-router-dom";
import { Input, Label2 } from "../../components/ui";
import { PacienteSchema } from "../../schemas/patient";
import { registerPatient } from "../../services/PacienteService";

const RegistroPaciente = () => {

  const {
          register,
          handleSubmit,
          formState: {errors}
      } = useForm({
          resolver: zodResolver(PacienteSchema)
      })

  const navigate = useNavigate()

  const handleSendData = async (data) => {
    console.log(data)
    try {
      await registerPatient(data)
    } catch (error) {
      console.log("Error al registrar un paciente: ", error)
    }
  }

  return (
    <>
      <TitleDashboardSection text={"Actividades Paciente"} />

      <form onSubmit={handleSubmit(handleSendData)} className="flex flex-col gap-4 mt-5">
        <div className="bg-azulPastel1 w-full rounded-xl p-4">
          <div className="flex justify-between gap-5">
            <div className="w-1/3">
              <img src="/images/patient.png" alt="Paciente avatar" className="w-full" />
            </div>
            <div className="w-full bg-white p-3 rounded-2xl">
              <p className="text-2xl text-center text-black font-fontPoppins mb-1">
                Ingresa la información del paciente
              </p>
              <div className="flex justify-center items-center ml-5 mt-6 gap-12">
                <div className="w-1/2 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="nombre">Nombres:</Label2>
                      <Input
                        type="text"
                        id="nombre"
                        name="nombre"
                        {...register(
                          "nombre",
                          {required: true}
                        )}
                        autoFocus
                        />
                    </div>
                    {errors.nombre?.message && (
                      <p className="text-red-500 text-right">{errors.nombre?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="apellido">Apellidos:</Label2>
                      <Input
                        type="text"
                        id="apellido"
                        name="apellido"
                        {...register(
                          "apellido",
                          {required: true}
                        )}
                        autoFocus
                      />
                    </div>
                    {errors.apellido?.message && (
                      <p className="text-red-500 text-right">{errors.apellido?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="fecha_nacimiento">Fecha de nacimiento:</Label2>
                      <Input
                        type="date"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        {...register(
                          "fecha_nacimiento",
                          {required: true}
                        )}
                        autoFocus
                      />
                    </div>
                    {errors.fecha_nacimiento && (
                      <p className="text-red-500 text-right">{errors.fecha_nacimiento?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="sexo">Género:</Label2>
                      <select
                        name="sexo"
                        id="sexo"
                        className="text-center w-1/2"
                        {...register(
                          "sexo",
                          {required: true}
                        )}
                      >
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                        <option value="prefiero_no_decir">Prefiero no decir</option>
                      </select>
                    </div>
                    {errors.sexo?.message && (
                      <p className="text-red-500 text-right">{errors.sexo?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between">
                      <Label2 htmlFor="identificacion">Identificacion:</Label2>
                      <Input
                        type="text"
                        id="identificacion"
                        name="identificacion"
                        {...register(
                          "identificacion",
                          {required: true}
                        )}
                        autoFocus
                      />
                    </div>
                    {errors.identificacion?.message && (
                      <p className="text-red-500 text-right">{errors.identificacion?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between">
                      <Label2 htmlFor="diagnostico_principal">Diagnostico Principal:</Label2>
                      <Input
                        type="text"
                        id="diagnostico_principal"
                        name="diagnostico_principal"
                        {...register(
                          "diagnostico_principal",
                          {required: true}
                        )}
                        autoFocus
                      />
                    </div>
                    {errors.diagnostico_principal?.message && (
                      <p className="text-red-500 text-right">{errors.diagnostico_principal?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="autonomia">Nivel de Autonomia:</Label2>
                      <select
                        name="autonomia"
                        id="autonomia"
                        className="text-center w-1/2"
                        {...register(
                          "nivel_autonomia",
                          {required: true}
                        )}
                      >
                        <option value="">--- Seleccionar ---</option>
                        <option value="alta">Alta</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                      </select>
                    </div>
                    {errors.autonomia?.message && (
                      <p className="text-red-500 text-right">{errors.autonomia?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-azulPastel1 w-full rounded-xl p-4">
          {/* <p className="text-2xl text-black font-fontPoppins mb-1">
            Ingresa la información del paciente
          </p>
          <div className="flex justify-between gap-5 my-8">
            <div className="bg-white p-3 rounded-xl w-full">
              <p className="text-xl text-black font-fontPoppins mb-1">
                Alergias
              </p>
              <textarea name="alergias_txt" id="alergiastxt" className="w-full p-2 rounded-lg border-1 border-grisTarde4 outline-0 resize-none" rows={"5"}></textarea>
            </div>
            <div className="bg-white p-3 rounded-xl w-full">
              <p className="text-xl text-black font-fontPoppins mb-1">
                Antecedentes médicos
              </p>
              <textarea name="alergias_txt" id="alergiastxt" className="w-full p-2 rounded-lg border-1 border-grisTarde4 outline-0 resize-none" rows={"5"}></textarea>
            </div>
            <div className="bg-white p-3 rounded-xl w-full">
              <p className="text-xl text-black font-fontPoppins mb-1">
                Diagnosticos anteriores
              </p>
              <textarea name="alergias_txt" id="alergiastxt" className="w-full p-2 rounded-lg border-1 border-grisTarde4 outline-0 resize-none" rows={"5"}></textarea>
            </div>
            <div className="bg-white p-3 rounded-xl w-full">
              <p className="text-xl text-black font-fontPoppins mb-1">
                Otros datos del acudiente
              </p>
              <textarea name="alergias_txt" id="alergiastxt" className="w-full p-2 rounded-lg border-1 border-grisTarde4 outline-0 resize-none" rows={"5"}></textarea>
            </div>
          </div> */}

          <div className="flex justify-between w-1/3 mx-auto">
            <button
              className="bg-rojo1 px-6 py-2 rounded-xl text-white font-semibold text-lg border-1 border-black cursor-pointer"
              >Cancelar</button>
            <button
              type="submit"
              className="bg-azulPastel5 px-6 py-2 rounded-xl text-white font-semibold text-lg border-1 border-black cursor-pointer"
            >Registrar</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default RegistroPaciente;
