import { z } from "zod";

export const userSchema = z
  .object({
    nombre_usuario: z.string().min(3, { message: "El nombre del usuario debe tener por lo menos 3 caracteres." }),
    apellido_usuario: z.string().min(3, { message: "El apellido del usuario debe tener por lo menos 3 caracteres." }),
    direccion_usuario: z.string().min(5, { message: "La direccion del usuario debe tener por lo menos 5 caracteres." }),
    telefono_usuario: z.string().min(10, { message: "El telefono debe tener por lo menos 10 caracteres." }),
    identificacion_usuario: z.string().min(9, { message: "La identificacion debe tener por lo menos 9 caracteres." }),
    correo_usuario: z.string().email({ message: "El correo electrónico debe tener un formato válido" }),
    contrasena_usuario: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  })