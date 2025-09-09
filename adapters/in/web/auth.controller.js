class AuthController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res, next) {
    try {
      // El use case devuelve { user, token }
      const result = await this.registerUserUseCase.execute(req.body);
      
      res.status(201).json({ 
        success: true, 
        user: result.user,
        token: result.token 
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Validar campos requeridos
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
      
      // El use case devuelve { user, token } y espera email, password separados
      const result = await this.loginUserUseCase.execute(email, password);
      
      res.json({ 
        success: true, 
        user: result.user,
        token: result.token 
      });
    } catch (err) {
      // Manejar errores de autenticación específicos
      res.status(401).json({
        success: false,
        message: err.message
      });
    }
  }
}

export default AuthController;