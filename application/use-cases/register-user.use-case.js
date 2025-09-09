class RegisterUserUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(userData) {
        // Validar datos requeridos
        if (!userData.email || !userData.password) {
            throw new Error("Email and password are required");
        }

        // Verificar si el usuario ya existe
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }

        // Hash de la contraseña
        const hashedPassword = await this.authService.hashPassword(userData.password);
        
        // Crear usuario (SOLO UNA VEZ)
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword,
            createdAt: new Date()
        });

        // Generar token JWT
        const token = this.authService.generateToken(user);

        // Devolver usuario (sin password) y token
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        return {
            user: userWithoutPassword,
            token
        };
    }
}

export default RegisterUserUseCase;