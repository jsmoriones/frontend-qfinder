import { z } from 'zod';

export const PacienteSchema = z.object({
  id_usuario: z.object({
    label: z.string(),
    value: z.string().or(z.number()),
  })
  .refine(data => {
      const numValue = typeof data.value === 'string' ? parseInt(data.value, 10) : data.value;
      return typeof numValue === 'number' && !isNaN(numValue);
  }, {
      message: "El valor del ID de usuario debe ser un número válido."
  })
  .transform(data => {
      return parseInt(data.value, 10); // Asegúrate de que esto devuelve el número que esperas
  }, {
      message: "El ID de usuario es requerido y debe ser un número." // Este mensaje es del transform
  }),
  nombre: z.string()
    .min(2, {
      message: "El nombre del paciente debe tener al menos 2 carácteres"
    }),
  apellido: z.string()
    .min(2, {
      message: "El apellido del paciente debe tener al menos 2 carácteres"
    }),
  identificacion: z.string()
    .min(5, {
      message: "La identificación del paciente debe tener al menos 5 carácteres"
    }),
  fecha_nacimiento: z.string()
    .transform((str) => new Date(str))
    .refine((date) => {
      return date.getTime() <= new Date().getTime();
    }, {
      message: "La fecha no puede estar en el futuro.",
    }),
  sexo: z.enum(['masculino', 'femenino', 'otro', 'prefiero_no_decir'], {
    message: "La orientación sexual debe ser obligatoria"
  }).nullable().optional(),
  diagnostico_principal: z.string()
    .min(10, {
      message: "El Diagnostico Principal debe tener al menos 10 carácteres"
    })
    .max(100, {
      message: "La escritura del diagnostico no puede exceder los 100 carácteres"
    }),
  nivel_autonomia: z.enum(['alta', 'baja', 'media']).optional()
});