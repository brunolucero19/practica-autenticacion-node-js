// Validar usuario
import { z } from 'zod'

const userSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export const validateUser = (user) => {
  return userSchema.safeParse(user)
}
