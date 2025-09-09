class User {
    constructor(id, name, email, password, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    validate() {
        if (!this.email || !this.password) {
            throw new Error("Email and password are required");
        }
        
        // Validaciones adicionales recomendadas
        if (this.email && !this.isValidEmail(this.email)) {
            throw new Error("Invalid email format");
        }
        
        if (this.password && this.password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
    }

    // Método para validar formato de email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Método para convertir a JSON (útil para responses)
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt
            // NOTE: password is intentionally excluded
        };
    }

    // Método estático para crear usuario desde datos crudos
    static createFromData(data) {
        return new User(
            data.id || Date.now(),
            data.name,
            data.email,
            data.password,
            data.createdAt || new Date()
        );
    }
}

export default User;