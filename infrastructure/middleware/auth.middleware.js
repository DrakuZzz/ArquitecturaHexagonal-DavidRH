function CreateAuthMiddleware(authService, userRepository) {
    return async (req, res, next) => {
        try {
            // CORRECCIÓN 1: Usar req.headers (no req.headers())
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                return res.status(401).json({ success: false, message: 'No token provided' });
            }

            // CORRECCIÓN 2: Verificar que el header tenga el formato correcto
            if (!authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, message: 'Invalid token format' });
            }

            const token = authHeader.replace('Bearer ', '');
            
            // CORRECCIÓN 3: Verificar el token
            const decoded = authService.verifyToken(token);
            
            if (!decoded) {
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }

            // CORRECCIÓN 4: Buscar por ID correctamente (decoded.id, no decoded.user)
            const user = await userRepository.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            
            // Preparar usuario para la request (sin password)
            let userForRequest;
            if (typeof user.toJSON === 'function') {
                userForRequest = user.toJSON();
            } else {
                userForRequest = { ...user };
            }
            delete userForRequest.password;
            
            req.user = userForRequest;
            next();
            
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    };
}

export default CreateAuthMiddleware;