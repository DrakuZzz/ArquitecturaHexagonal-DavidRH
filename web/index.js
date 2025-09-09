import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// Dominio
import AuthService from '../domain/services/auth.service.js';

// Aplicación
import RegisterUserCase from '../application/use-cases/register-user.use-case.js';
import LoginUserCase from '../application/use-cases/login-user.use-case.js';

// Adaptadores
import AuthController from '../adapters/in/web/auth.controller.js';
import createAuthRoutes from '../adapters/in/web/routes/auth.routes.js';

// Middleware 
import CreateAuthMiddleware from '../infrastructure/middleware/auth.middleware.js'; // ← RUTA CORREGIDA

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repositorio Mock en memoria
class MockUserRepository {
    constructor() {
        this.users = [];
    }

    async findByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    async findById(id) {
        return this.users.find(user => user.id === id);
    }

    async create(userData) {
        const user = {
            id: Date.now(),
            ...userData,
            createdAt: new Date()
        };
        this.users.push(user);
        return user;
    }
}

class Application {
    constructor() {
        this.app = express();
    }

    async initialize() {
        // Servicios y repositorios
        const authService = new AuthService(process.env.JWT_SECRET || 'defaultsecret');
        const userRepo = new MockUserRepository();

        // Crear middleware de autenticación
        const authMiddleware = CreateAuthMiddleware(authService, userRepo); // ← INSTANCIA CORRECTA

        // Casos de uso
        const registerUserUseCase = new RegisterUserCase(userRepo, authService);
        const loginUserUseCase = new LoginUserCase(userRepo, authService);

        // Controladores
        const authController = new AuthController(registerUserUseCase, loginUserUseCase);

        // Middleware básico
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));

        this.app.get(['/', '/login'], (req, res) => {
            res.sendFile(path.join(__dirname, 'public/login.html'));
        });

        this.app.get('/register', (req, res) => {
            res.sendFile(path.join(__dirname, 'public/register.html'));
        });

        this.app.get('/logout', (req, res) => {
            res.sendFile(path.join(__dirname, 'public/logout.html'));
        });

        // Rutas API
        this.app.use('/api/auth', createAuthRoutes(authController));

        // Ruta para verificar tokens
        this.app.get('/api/auth/verify', authMiddleware, (req, res) => {
            res.json({ 
                valid: true, 
                user: req.user 
            });
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });

        // Manejo de errores
        this.app.use((err, req, res, next) => {
            console.error(err);

            if (err.message.includes('User not found') || err.message.includes('Invalid password')) {
                return res.status(401).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        });

        // Manejo de rutas no encontradas
        this.app.use((req, res) => {
            res.sendFile(path.join(__dirname, 'public/login.html'));
        });

        await this.start();
    }

    async start() {
        const port = process.env.PORT || 3000;
        this.server = this.app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}

// Iniciar aplicación
new Application().initialize().catch(console.error);