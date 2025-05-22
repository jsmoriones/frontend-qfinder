import { z } from "zod";
export const patientSchema = z
  .object({
    nombre: z
      .string({
        message: "El Nombre de Usuario es Requerido",
      })
      .min(3, {
        message: "El Nombre de Usuario debe tener por lo menos 3 caracteres",
      }),
    apellido: z
      .string({
        message: "El Apellido del Usuario es Requerido",
      })
      .min(3, {
        message: "El Apellido del Usuario debe tener por lo menos 3 carácteres",
      }),
    correo_usuario: z
      .string({
        message: "El correo es Obligatorio"
      })
      .email({
        message: "Porfavor Ingresa un Email Válido",
      }),
    genero: z
      .string()
      .nonempty("El género es obligatorio."),
    direccion: z
      .string()
      .min(5, {
        message: "La dirección es obligatoria, como minimo debe haber 5 carácteres"
      }),
    edad: z
      .number({
        message: "El valor debe ser numerico"
      })
      .min(0, {
        message: "La edad debe ser mayor a 0"
      })
      .max(120, {
        message: "La edad debe ser menor a 120"
      }),
    telefonoAcudiente: z
      .string({
        message: "El Télefono del Acudiente es Obligatorio",
      })
      .min(8, {
        message: "El Télefono del Acudiente debe Contener como minimo 8 digitos",
      }),
    numeroEmergencia: z
      .string({
        message: "El número de emergencia es obligatorio",
      })
      .min(8, {
        message: "El número de emergencia debe contener como minimo 8 digitos",
      }),
    discapacidad: z.string().optional(),
    alergias: z.string().optional(),
    antecedentes: z.string().optional(),
    diagnostico: z.string().optional(),
    otrosDatos: z.string().optional()
  })