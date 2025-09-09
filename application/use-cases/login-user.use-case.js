class LoginUserCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(email, password) {
        // Buscar usuario
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        // Verificar contraseña
        const isPasswordValid = await this.authService.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        // CORRECCIÓN: Pasar el usuario directamente, no {user}
        const token = this.authService.generateToken(user);
        
        // Preparar usuario para respuesta (sin password)
        let userResponse;
        if (typeof user.toJSON === 'function') {
            userResponse = user.toJSON();
        } else {
            userResponse = { ...user };
        }
        
        // Eliminar password de la respuesta
        delete userResponse.password;
        
        return { 
            user: userResponse, 
            token 
        };
    }
}

export default LoginUserCase;