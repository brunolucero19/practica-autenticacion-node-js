# 🔐 Sistema de Autenticación Node.js

Un proyecto completo de autenticación y autorización de usuarios construido con **Node.js**, **Express**, **JWT** y **EJS**. Incluye sistema de refresh tokens, validaciones con Zod, y una interfaz de usuario moderna.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![JWT](https://img.shields.io/badge/JWT-Token--Based-orange)
![EJS](https://img.shields.io/badge/Template-EJS-red)

## ✨ Características

- 🔑 **Autenticación completa** con registro y login
- 🔄 **Refresh Tokens** para mayor seguridad
- 🍪 **Cookies HttpOnly** para almacenamiento seguro
- 🛡️ **Hashing de contraseñas** con bcrypt
- ✅ **Validación de datos** con Zod
- 🎨 **Interfaz moderna** con EJS y CSS
- 🚀 **Rutas protegidas** con middleware
- 📱 **Diseño responsive**
- 🔐 **Renovación automática de tokens**

## 🚀 Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Autenticación**: JSON Web Tokens (JWT)
- **Base de Datos**: db-local (JSON-based)
- **Validación**: Zod
- **Templating**: EJS
- **Seguridad**: bcrypt, cookie-parser
- **Estilo**: CSS3 con Flexbox y Grid

## 📋 Prerequisitos

- Node.js 18+ instalado
- npm o yarn como gestor de paquetes

## ⚙️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd autenticacion-node-js
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:

   ```env
   JWT_SECRET=tu_clave_secreta_muy_segura_aqui
   PORT=3000
   NODE_ENV=development
   ```

4. **Ejecutar el proyecto**

   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
autenticacion-node-js/
├── views/
│   ├── index.ejs          # Página principal con formularios
│   └── protected.ejs      # Área protegida
├── validators/
│   └── user.js           # Validaciones con Zod
├── db/                   # Base de datos local
├── index.js              # Servidor principal
├── user-repository.js    # Lógica de usuarios y tokens
├── package.json
└── README.md
```

## 🔒 Sistema de Autenticación

### **Tokens Duales**

- **Access Token**: 15 minutos (operaciones diarias)
- **Refresh Token**: 30 días (renovación de acceso)

### **Flujo de Autenticación**

1. Usuario se registra/loguea
2. Recibe access token + refresh token
3. Tokens se almacenan en cookies HttpOnly
4. Access token se renueva automáticamente
5. Al logout se revocan ambos tokens

### **Seguridad Implementada**

- Contraseñas hasheadas con bcrypt (10 rounds)
- Cookies HttpOnly + Secure + SameSite
- Validación de datos con Zod
- Revocación de tokens en logout
- Middleware de autenticación centralizado

## 🛠️ API Endpoints

### **Autenticación**

```http
POST /register          # Registro de usuario
POST /login             # Inicio de sesión
POST /logout            # Cerrar sesión
POST /refresh-token     # Renovar access token
```

### **Rutas**

```http
GET /                   # Página principal
GET /protected          # Área protegida (requiere auth)
```

## 📱 Interfaz de Usuario

### **Características del Frontend**

- **Toggle entre formularios** de login/registro
- **Validación en tiempo real** de formularios
- **Mensajes de error/éxito** dinámicos
- **Renovación automática** de tokens
- **Interfaz adaptativa** para usuarios logueados

### **Experiencia de Usuario**

- Sin recargas innecesarias de página
- Feedback visual inmediato
- Transiciones suaves entre estados
- Manejo elegante de errores

## 🎯 Funcionalidades Principales

### **1. Registro de Usuarios**

- Validación de username (mín. 3 caracteres)
- Validación de password (mín. 6 caracteres)
- Verificación de contraseñas coincidentes
- Prevención de usuarios duplicados

### **2. Inicio de Sesión**

- Autenticación con username/password
- Generación de tokens JWT
- Cookies seguras automáticas

### **3. Gestión de Sesiones**

- Middleware de autenticación automático
- Renovación transparente de tokens
- Logout con limpieza de cookies

### **4. Rutas Protegidas**

- Verificación automática de tokens
- Redirección a login si no autorizado
- Acceso basado en estado de sesión

## 🔧 Scripts Disponibles

```json
{
  "dev": "node --watch index.js", // Desarrollo con auto-reload
  "start": "node index.js", // Producción
  "lint": "standard", // Linting con Standard
  "lint:fix": "standard --fix" // Auto-fix de linting
}
```

## 📚 Lo Que Aprendí

### **Backend**

- Implementación de JWT con refresh tokens
- Middleware personalizado para autenticación
- Manejo seguro de cookies
- Validación robusta con Zod
- Estructura de proyecto escalable

### **Frontend**

- Templating dinámico con EJS
- JavaScript moderno (async/await, fetch)
- Manejo de estados de UI
- Validación del lado del cliente

### **Seguridad**

- Hashing de contraseñas con bcrypt
- Tokens de corta duración + renovación
- Cookies HttpOnly para prevenir XSS
- Validación de entrada de datos

### **Mejores Prácticas**

- Separación de responsabilidades
- Manejo centralizado de errores
- Código limpio y documentado
- Experiencia de usuario fluida

## 🚀 Posibles Mejoras

- [ ] Implementar rate limiting
- [ ] Agregar autenticación OAuth
- [ ] Roles y permisos de usuario
- [ ] Base de datos PostgreSQL/MongoDB
- [ ] Tests unitarios y de integración
- [ ] Logging con Winston
- [ ] Dockerización
- [ ] CI/CD pipeline

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre** - [GitHub](https://github.com/tu-usuario)

---

⭐ ¡No olvides dar una estrella al proyecto si te fue útil!
