# HerbaMate - Tienda de Mates Online

Una tienda web completa de productos de mate con diseño responsive, backend Node.js y base de datos MongoDB.

## 🎯 Características

### 👤 Cliente
- **Diseño responsive** con tema oscuro elegante
- **Navegación por categorías**: Mates, Termos, Bombillas, Yerbas
- **Buscador de productos** por nombre
- **Botón flotante de WhatsApp** para consultas
- **Promociones visuales** (2x1, 20% OFF, etc.)
- **Modal de detalles** de productos
- **Menú hamburguesa** para móviles

### 🔒 Administrador
- **Panel de administración** completo
- **Gestión de productos**: Crear, editar, eliminar
- **Subida de imágenes** con preview
- **Control de stock** y estado activo/inactivo
- **Estadísticas** en tiempo real
- **Filtros y búsqueda** avanzada

### 🛠 Backend
- **Node.js + Express.js**
- **MongoDB** con Mongoose
- **Autenticación** por sesiones
- **Subida de archivos** con Multer
- **API RESTful** completa
- **Middleware** de seguridad

## 🚀 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd herbamate
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `env.example` a `.env` y configura las variables:

```bash
cp env.example .env
```

Edita el archivo `.env`:
```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/herbamate

# Configuración de sesión
SESSION_SECRET=tu_secret_key_aqui

# Configuración JWT
JWT_SECRET=tu_jwt_secret_aqui

# Credenciales del administrador
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Iniciar MongoDB
Si usas MongoDB local:
```bash
# En Windows
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"

# En macOS/Linux
mongod
```

### 5. Ejecutar el proyecto
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

### 6. Acceder a la aplicación
- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Credenciales por defecto**: admin / admin123

## 📁 Estructura del Proyecto

```
herbamate/
├── public/                 # Frontend público
│   ├── index.html         # Página principal
│   ├── css/
│   │   └── styles.css     # Estilos principales
│   └── js/
│       └── main.js        # JavaScript del cliente
├── admin/                  # Panel de administración
│   ├── login.html         # Página de login
│   ├── dashboard.html     # Panel principal
│   ├── css/
│   │   └── admin.css      # Estilos del admin
│   └── js/
│       ├── login.js       # Lógica de login
│       └── dashboard.js   # Lógica del dashboard
├── backend/               # Servidor Node.js
│   ├── server.js          # Servidor principal
│   ├── routes/
│   │   ├── productos.js   # Rutas de productos
│   │   └── auth.js        # Rutas de autenticación
│   ├── models/
│   │   └── Producto.js    # Modelo de producto
│   └── middleware/
│       └── auth.js        # Middleware de autenticación
├── uploads/               # Imágenes subidas
├── package.json           # Dependencias
├── env.example           # Variables de entorno ejemplo
└── README.md             # Este archivo
```

## 🔧 API Endpoints

### Productos (Público)
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos?categoria=Mates` - Filtrar por categoría
- `GET /api/productos?busqueda=mate` - Buscar productos
- `GET /api/productos/:id` - Obtener producto específico

### Autenticación
- `POST /api/auth/login` - Login del administrador
- `POST /api/auth/logout` - Logout
- `GET /api/auth/status` - Verificar estado de sesión

### Productos (Admin - Requiere autenticación)
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto
- `PATCH /api/productos/:id/toggle` - Cambiar estado activo/inactivo

## 🎨 Personalización

### Colores y Estilos
Los colores principales se definen en `public/css/styles.css`:

```css
:root {
    --primary-color: #2c5530;    /* Verde oscuro */
    --secondary-color: #4a7c59;  /* Verde medio */
    --accent-color: #8bc34a;     /* Verde claro */
    --dark-bg: #1a1a1a;          /* Fondo oscuro */
    --darker-bg: #0f0f0f;        /* Fondo más oscuro */
    --light-text: #ffffff;       /* Texto claro */
    --gray-text: #cccccc;        /* Texto gris */
}
```

### Configuración de WhatsApp
Edita el número de WhatsApp en `public/index.html`:
```html
<a href="https://wa.me/5491112345678?text=Hola! Me interesan sus productos de mate" 
   class="whatsapp-float" target="_blank" rel="noopener">
```

## 📱 Responsive Design

El sitio está optimizado para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔒 Seguridad

- **Autenticación por sesiones** con MongoDB Store
- **Middleware de protección** para rutas admin
- **Validación de archivos** en subida de imágenes
- **Sanitización** de datos de entrada
- **Headers de seguridad** básicos

## 🚀 Despliegue

### Heroku
1. Crear cuenta en Heroku
2. Conectar repositorio
3. Configurar variables de entorno
4. Desplegar

### Vercel
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar

### DigitalOcean
1. Crear droplet
2. Instalar Node.js y MongoDB
3. Clonar repositorio
4. Configurar PM2 para producción

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté corriendo
mongosh
# o
mongo
```

### Error de permisos en uploads
```bash
# En Linux/macOS
chmod 755 uploads/
```

### Puerto ocupado
```bash
# Cambiar puerto en .env
PORT=3001
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:

- 📧 Email: info@herbamate.com
- 💬 WhatsApp: +54 11 1234-5678
- 🐛 Issues: Crear un issue en GitHub

## 🎉 Agradecimientos

- Diseño inspirado en mateandoarg.com
- Iconos de Font Awesome
- Fuentes de Google Fonts (Inter)
- Framework CSS personalizado

---

**¡Disfruta tu tienda de mates! 🧉** 