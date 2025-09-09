// Cargar información del usuario al iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupEventListeners();
});

// Cargar datos del usuario desde localStorage
function loadUserData() {
    const userName = localStorage.getItem('user_name') || 'Usuario';
    const userEmail = localStorage.getItem('user_email') || 'email@ejemplo.com';
    
    document.getElementById('userName').textContent = userName;
    document.getElementById('userEmail').textContent = userEmail;
}

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// Función para cerrar sesión
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Eliminar datos del localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        
        // Redirigir al login
        window.location.href = '/login';
    }
}