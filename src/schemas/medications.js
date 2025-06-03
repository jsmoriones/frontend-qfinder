import { z } from "zod";

export const medicationSchema = z
  .object({
    nombre: z.string().min(3, { message: "El nombre del medicamento debe tener por lo menos 3 caracteres." }),
    descripcion: z.string().min(10, { message: "La descripcion del medicamento debe tener por lo menos 10 caracteres." }),
    tipo: z.string({message: "El tipo es obligatorio"})
  })