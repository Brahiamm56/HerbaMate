// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está logueado
    verificarSesion();
    
    // Event listener para el formulario
    loginForm.addEventListener('submit', handleLogin);
});

// Verificar si ya hay una sesión activa
async function verificarSesion() {
    try {
        const API_BASE = 'https://herbamate-1.onrender.com';
        const response = await fetch(`${API_BASE}/api/auth/status`);
        const data = await response.json();
        
        if (data.authenticated) {
            // Si ya está logueado, redirigir al dashboard
            window.location.href = '/admin/dashboard';
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
    }
}

// Manejar el login
async function handleLogin(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Validaciones básicas
    if (!username || !password) {
        mostrarError('Por favor completa todos los campos');
        return;
    }
    
    try {
        // Mostrar loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        submitBtn.disabled = true;
        
        const API_BASE = 'https://herbamate-1.onrender.com';
        // Realizar petición de login
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Login exitoso
            mostrarExito('Login exitoso, redirigiendo...');
            
            // Redirigir al dashboard
            setTimeout(() => {
                window.location.href = data.redirect || '/admin/dashboard';
            }, 1000);
        } else {
            // Error en el login
            mostrarError(data.error || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error en login:', error);
        mostrarError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
        // Restaurar botón
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
        submitBtn.disabled = false;
    }
}

// Mostrar error
function mostrarError(mensaje) {
    errorText.textContent = mensaje;
    errorMessage.style.display = 'flex';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Mostrar éxito
function mostrarExito(mensaje) {
    errorText.textContent = mensaje;
    errorMessage.style.display = 'flex';
    errorMessage.style.backgroundColor = '#2ed573';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        errorMessage.style.display = 'none';
        errorMessage.style.backgroundColor = '#ff4757';
    }, 3000);
}

// Limpiar error al escribir
document.getElementById('username').addEventListener('input', limpiarError);
document.getElementById('password').addEventListener('input', limpiarError);

function limpiarError() {
    errorMessage.style.display = 'none';
} 