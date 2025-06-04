import { z } from "zod";

export const comunidadSchema = z.object({
  nombre_red: z.string().min(1, 'El nombre de la red es obligatorio'),
  descripcion_red: z.string().optional()
});