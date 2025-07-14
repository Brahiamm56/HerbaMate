const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'herbamate_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/herbamate'
    }),
    cookie: {
        secure: false, // Cambiar a true en producción con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Servir archivos estáticos de admin
app.use('/admin/css', express.static(path.join(__dirname, '../admin/css')));
app.use('/admin/js', express.static(path.join(__dirname, '../admin/js')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/herbamate', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Conectado a MongoDB');
})
.catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
});

// Importar rutas
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');

// Usar rutas
app.use('/api/productos', productosRoutes);
app.use('/api/auth', authRoutes);

// Rutas para páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, '../admin/dashboard.html'));
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 Admin: http://localhost:${PORT}/admin`);
}); 