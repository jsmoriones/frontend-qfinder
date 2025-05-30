import { z } from "zod";

export const userSchema = z
  .object({
    nombre_usuario: z.string().min(3, { message: "El nombre del usuario debe tener por lo menos 3 caracteres." }),
    apellido_usuario: z.string().min(3, { message: "El apellido del usuario debe tener por lo menos 3 caracteres." }),
    direccion_usuario: z.string().min(5, { message: "La direccion del usuario debe tener por lo menos 5 caracteres." }),
    telefono_usuario: z.string().min(10, { message: "El telefono debe tener por lo menos 10 caracteres." })
  })