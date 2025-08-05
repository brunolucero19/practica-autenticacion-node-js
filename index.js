import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { UserRepository } from './user-repository.js'
process.loadEnvFile()
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json()) // Middleware para parsear JSON
app.use(cookieParser()) // Middleware para parsear cookies
app.set('view engine', 'ejs') // Configurar EJS como motor de plantillas
app.use((req, res, next) => {
  const accessToken = req.cookies.access_token
  const refreshToken = req.cookies.refresh_token

  // Inicializar el objeto session si no existe
  req.session = req.session || {}

  try {
    if (accessToken) {
      const data = jwt.verify(accessToken, process.env.JWT_SECRET)
      req.session.user = data
      req.session.hasValidToken = true
    } else if (refreshToken) {
      // Access token expirado, pero tenemos refresh token
      req.session.user = null
      req.session.hasValidToken = false
      req.session.refreshToken = refreshToken
    } else {
      req.session.user = null
      req.session.hasValidToken = false
    }
  } catch (error) {
    // Access token inválido, intentar con refresh token
    if (refreshToken) {
      req.session.user = null
      req.session.hasValidToken = false
      req.session.refreshToken = refreshToken
    } else {
      req.session.user = null
      req.session.hasValidToken = false
    }
  }
  next()
})

app.get('/', (req, res) => {
  const { user } = req.session || {}

  res.render('index', { user })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })

    // Crear access token (corta duración)
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // 15 minutos
    )

    // Crear refresh token (larga duración)
    const refreshToken = await UserRepository.createRefreshToken(user.id)

    res
      .status(200)
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutos
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
      })
      .json({ user, message: 'Login exitoso' })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
})

// Endpoint para renovar access token usando refresh token
app.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refresh_token

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token no encontrado' })
  }

  try {
    const user = await UserRepository.validateRefreshToken(refreshToken)

    // Crear nuevo access token
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    res
      .status(200)
      .cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutos
      })
      .json({ message: 'Token renovado exitosamente', user })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({ username, password })
    res.status(200).json({ id, message: 'Usuario creado exitosamente' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refresh_token

  try {
    if (refreshToken) {
      await UserRepository.revokeRefreshToken(refreshToken)
    }
  } catch (error) {
    console.log('Error revocando refresh token:', error.message)
  }

  res
    .status(200)
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .json({ message: 'Logout exitoso' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session || {}
  if (!user) {
    return res.status(403).send('Acceso no autorizado')
  }

  res.render('protected', { username: user.username })
})

app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto', PORT)
})
