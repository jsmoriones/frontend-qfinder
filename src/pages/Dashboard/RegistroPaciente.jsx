import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TitleDashboardSection } from "../../components/ui/TitleDashboardSection";
import { useNavigate } from "react-router-dom";
import { Input, Label2 } from "../../components/ui";
import { patientSchema } from "../../schemas/patient";

const RegistroPaciente = () => {

  const {
          register,
          handleSubmit,
          formState: {errors}
      } = useForm({
          resolver: zodResolver(patientSchema)
      })

  const navigate = useNavigate()

  const handleSendData = () => {

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
              <p className="text-2xl text-black font-fontPoppins mb-1">
                Ingresa la información del paciente
              </p>
              <div className="flex justify-between items-center ml-5 mt-6 gap-12">
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
                      <Label2 htmlFor="email">Email-Acudiente:</Label2>
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
                    </div>
                    {errors.correo_usuario && (
                      <p className="text-red-500 text-right">{errors.correo_usuario?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="genero">Género:</Label2>
                      <select name="genero" id="genero" className="text-center w-1/2">
                        <option value="M">--- Seleccionar ---</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </select>
                    </div>
                    {errors.genero?.message && (
                      <p className="text-red-500 text-right">{errors.genero?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="direccion">Dirección:</Label2>
                      <Input
                        type="text"
                        id="direccion"
                        name="direccion"
                        {...register(
                          "direccion",
                          {required: true}
                        )}
                        autoFocus
                        />
                    </div>
                    {errors.direccion?.message && (
                      <p className="text-red-500 text-right">{errors.direccion?.message}</p>
                    )}
                  </div>
                </div>
                <div className="w-1/2 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="edad">Edad:</Label2>
                      <Input
                        type="number"
                        id="edad"
                        name="edad"
                        {...register(
                          "edad",
                          {required: true}
                        )}
                        autoFocus
                        />
                    </div>
                    {errors.edad?.message && (
                      <p className="text-red-500 text-right">{errors.edad?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="telefonoAcudiente">Número-Acudiente:</Label2>
                      <Input
                        type="number"
                        id="telefonoAcudiente"
                        name="telefonoAcudiente"
                        {...register(
                          "telefonoAcudiente",
                          {required: true}
                        )}
                        autoFocus
                        />
                    </div>
                    {errors.telefonoAcudiente?.message && (
                      <p className="text-red-500 text-right">{errors.telefonoAcudiente?.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Label2 htmlFor="numeroEmergencia">Número de Emergencia:</Label2>
                      <Input
                        type="number"
                        id="numeroEmergencia"
                        name="numeroEmergencia"
                        {...register(
                          "numeroEmergencia",
                          {required: true}
                        )}
                        autoFocus
                        />
                    </div>
                    {errors.numeroEmergencia?.message && (
                      <p className="text-red-500 text-right">{errors.numeroEmergencia?.message}</p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Label2 htmlFor="discapacidad">Discapacidad-(si posee):</Label2>
                    <Input
                      type="text"
                      id="discapacidad"
                      name="discapacidad"
                      {...register(
                        "discapacidad",
                        {required: true}
                      )}
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-azulPastel1 w-full rounded-xl p-4">
          <p className="text-2xl text-black font-fontPoppins mb-1">
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
          </div>

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
