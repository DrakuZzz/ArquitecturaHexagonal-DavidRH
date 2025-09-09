// login.js - Cambia la redirección de '/dashboard' a '/logout'
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const credentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Login exitoso');
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('user_name', data.user.name);
            localStorage.setItem('user_email', data.user.email);
            window.location.href = '/logout'; // ← CAMBIA ESTA LÍNEA
        } else {
            alert('Error: ' + (data.message || 'Credenciales inválidas'));
        }
    } catch (error) {
        console.error('Error en login:', error);
        alert('Error de conexión con el servidor');
    }
});