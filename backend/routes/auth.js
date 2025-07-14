const express = require('express');
const bcrypt = require('bcryptjs');
const { requireGuest } = require('../middleware/auth');
const router = express.Router();

// Login del administrador
router.post('/login', requireGuest, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Verificar credenciales (en producción usar base de datos)
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        if (username === adminUsername && password === adminPassword) {
            // Crear sesión de administrador
            req.session.admin = {
                id: 'admin',
                username: username,
                loginTime: new Date()
            };
            
            res.json({ 
                success: true, 
                message: 'Login exitoso',
                redirect: '/admin/dashboard'
            });
        } else {
            res.status(401).json({ 
                success: false, 
                error: 'Credenciales incorrectas' 
            });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error interno del servidor' 
        });
    }
});

// Logout del administrador
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir sesión:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Error al cerrar sesión' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Logout exitoso',
            redirect: '/admin'
        });
    });
});

// Verificar estado de autenticación
router.get('/status', (req, res) => {
    res.json({ 
        authenticated: !!(req.session && req.session.admin),
        admin: req.session?.admin || null
    });
});

module.exports = router; 