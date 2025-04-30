import { z } from "zod";

export const registerSchema = z
  .object({
    nombre_usuario: z
      .string({
        required_error: "El Nombre de Usuario es Requerido",
      })
      .min(3, {
        message: "El Nombre de Usuario debe tener por lo menos 3 caracteres",
      }),

    apellido_usuario: z
      .string({
        required_error: "El Apellido del Usuario es Requerido",
      })
      .min(3, {
        message: "El Apellido del Usuario debe tener por lo menos 3 carácteres",
      }),

    identificacion_usuario: z
      .number({
        required_error: "El Número de Identificación es Obligatorio"
      })
      .min(9, {
        message: "La Identificación debe tener por lo menos 9 carácteres"
      }),

    direccion_usuario: z
      .string({
        required_error: "La Dirección Residencial del Usuario es Obligatoria"
      }),

    telefono_usuario: z
      .string({
        required_error: "El Apellido del Usuario es Requerido",
      })
      .min(8, {
        message: "El Apellido del Usuario debe tener por lo menos 8 carácteres",
      }),
    correo_usuario: z
      .string()
      .email({
        message: "Porfavor Ingresa un Email Válido",
      }),

    contrasena_usuario: z
      .string()
      .min(6, {
        message: "La Contraseña debe contar con 6 caracteres por lo menos",
      })

  })