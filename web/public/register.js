document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    // Ocultar mensajes anteriores
    errorElement.style.display = 'none';
    successElement.style.display = 'none';
    
    // Validaciones básicas
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }
    
    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('✅ Cuenta creada exitosamente');
            
            // Guardar token y datos de usuario
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('user_name', data.user.name);
            localStorage.setItem('user_email', data.user.email);
            
            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
            
        } else {
            showError('Error: ' + (data.message || 'No se pudo crear la cuenta'));
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showError('Error de conexión con el servidor');
    }
    
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function showSuccess(message) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
});

// Validación en tiempo real de coincidencia de contraseñas
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    const errorElement = document.getElementById('errorMessage');
    
    if (confirmPassword && password !== confirmPassword) {
        errorElement.textContent = 'Las contraseñas no coinciden';
        errorElement.style.display = 'block';
    } else {
        errorElement.style.display = 'none';
    }
});