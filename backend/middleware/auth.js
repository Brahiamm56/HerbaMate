// Middleware para verificar si el usuario está autenticado como administrador
const requireAuth = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next();
    }
    
    // Si es una petición API, devolver error JSON
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ 
            error: 'No autorizado. Debe iniciar sesión como administrador.' 
        });
    }
    
    // Si es una petición de página, redirigir al login
    res.redirect('/admin');
};

// Middleware para verificar si el usuario NO está autenticado (para el login)
const requireGuest = (req, res, next) => {
    if (req.session && req.session.admin) {
        return res.redirect('/admin/dashboard');
    }
    next();
};

module.exports = {
    requireAuth,
    requireGuest
}; 