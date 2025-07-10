import { z } from 'zod';

export const PacienteSchema = z.object({
  id_usuario: z.number({
    invalid_type_error: "El ID de usuario debe ser un número"
  })
  .int({
    message: "El ID de usuario debe ser un número entero"
  })
  .positive({
    message: "El ID de usuario debe ser un número positivo"
  })
  .optional(),
  nombre: z.string()
    .min(2, {
      message: "El nombre del paciente debe tener al menos 2 carácteres"
    })
    .max(100, {
      message: "El nombre del paciente no puede exceder los 100 carácteres"
    }),
  apellido: z.string()
    .min(2, {
      message: "El apellido del paciente debe tener al menos 2 carácteres"
    })
    .max(100, {
      message: "El apellido del paciente no puede exceder los 100 carácteres"
    }),
  identificacion: z.string()
    .regex(/^[1-9]\d{7,10}$/, {
      message: "La identificación debe tener entre 8 y 11 dígitos numéricos y no puede comenzar con cero",
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
  }),
  diagnostico_principal: z.string()
    .min(3, {
      message: "El Diagnostico Principal debe tener almenos 3 carácteres"
    })
    .max(100, {
      message: "La escritura del diagnostico no puede exceder los 100 carácteres"
    }),
})


export const PacienteSchemaEdit = z.object({
  nombre: z.string()
    .min(2, {
      message: "El nombre del paciente debe tener al menos 2 carácteres"
    })
    .max(100, {
      message: "El nombre del paciente no puede exceder los 100 carácteres"
    }),
  apellido: z.string()
    .min(2, {
      message: "El apellido del paciente debe tener al menos 2 carácteres"
    })
    .max(100, {
      message: "El apellido del paciente no puede exceder los 100 carácteres"
    }),
  identificacion: z.string()
    .regex(/^[1-9]\d{7,10}$/, {
      message: "La identificación debe tener entre 8 y 11 dígitos numéricos y no puede comenzar con cero",
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
  }),
  diagnostico_principal: z.string()
    .min(3, {
      message: "El Diagnostico Principal debe tener almenos 3 carácteres"
    })
    .max(100, {
      message: "La escritura del diagnostico no puede exceder los 100 carácteres"
    }),
})