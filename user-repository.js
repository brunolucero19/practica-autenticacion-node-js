import crypto from 'node:crypto'
import dbLocal from 'db-local'
import bcrypt from 'bcrypt'
import { validateUser } from './validators/user.js'
const { Schema } = dbLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const RefreshToken = Schema('RefreshToken', {
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // Validar usuario
    const result = validateUser({ username, password })
    console.log(result)

    if (!result.success) {
      throw new Error(
        result.error.issues.map((issue) => issue.message).join(', ')
      )
    }

    // Asegurar que el usuario no exista
    const existingUser = User.findOne({ username })
    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso')
    }
    const id = crypto.randomUUID() // Generar un ID con randomUUID puede traer problemas de rendimiento en algunas BBDD
    const hashedPassword = await bcrypt.hash(password, 10) // Hashear la contraseña, el segundo parámetro es el número de rondas de salting, cuanto mayor sea, más seguro pero más lento será el proceso

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    // Validar usuario
    const result = validateUser({ username, password })
    if (!result.success) {
      throw new Error(
        result.error.issues.map((issue) => issue.message).join(', ')
      )
    }

    // Buscar usuario
    const user = User.findOne({ username })
    if (!user) {
      throw new Error('El usuario no existe')
    }

    // Verificar contraseña

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new Error('La contraseña es incorrecta')
    }

    return {
      id: user._id,
      username: user.username
    }
  }

  static async createRefreshToken (userId) {
    const tokenId = crypto.randomUUID()
    const token = crypto.randomBytes(64).toString('hex')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
    const createdAt = new Date()

    // Eliminar tokens anteriores del usuario (opcional: limitar a 1 token por usuario)
    const existingTokens = RefreshToken.find({ userId })
    existingTokens.forEach((token) => {
      RefreshToken.remove({ _id: token._id })
    })

    RefreshToken.create({
      _id: tokenId,
      userId,
      token,
      expiresAt,
      createdAt
    }).save()

    return token
  }

  static async validateRefreshToken (token) {
    const refreshToken = RefreshToken.findOne({ token })

    if (!refreshToken) {
      throw new Error('Refresh token inválido')
    }

    if (new Date() > new Date(refreshToken.expiresAt)) {
      // Token expirado, eliminarlo
      RefreshToken.remove({ _id: refreshToken._id })
      throw new Error('Refresh token expirado')
    }

    const user = User.findOne({ _id: refreshToken.userId })
    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    return {
      id: user._id,
      username: user.username
    }
  }

  static async revokeRefreshToken (token) {
    const refreshToken = RefreshToken.findOne({ token })
    if (refreshToken) {
      RefreshToken.remove({ _id: refreshToken._id })
    }
  }

  static async revokeAllRefreshTokens (userId) {
    const tokens = RefreshToken.find({ userId })
    tokens.forEach((token) => {
      RefreshToken.remove({ _id: token._id })
    })
  }
}
