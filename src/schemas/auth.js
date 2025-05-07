import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .email({
        message: "Porfavor Ingresa un Email Válido",
      }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
      .regex(/[^\w\s]/, { message: "La contraseña debe contener al menos un símbolo" }),
  })

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
      .string({
        required_error: "El Número de Identificación es Obligatorio"
      })
      .min(9, {
        message: "La Identificación debe tener por lo menos 9 carácteres"
      }),

    direccion_usuario: z
      .string({
        required_error: "La Dirección Residencial del Usuario es Obligatoria"
      })
      .min(3, {
        message: "La Dirección debe contener por lo menos  3 caracteres"
      }),

    telefono_usuario: z
      .string({
        required_error: "El Télefono del Usuario es Oblogatorio",
      })
      .min(8, {
        message: "El Télefono del Usuario debe Contener como minimo 8 digitos",
      }),
    correo_usuario: z
      .string()
      .email({
        message: "Porfavor Ingresa un Email Válido",
      }),

    contrasena_usuario: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
      .regex(/[^\w\s]/, { message: "La contraseña debe contener al menos un símbolo" }),

  })