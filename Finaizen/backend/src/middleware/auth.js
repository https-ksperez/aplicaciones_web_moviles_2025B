const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

/**
 * Middleware para verificar el token JWT
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, config.JWT.SECRET);

    // Buscar usuario
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Agregar usuario a request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al verificar token',
      error: error.message
    });
  }
};

/**
 * Middleware para verificar si el usuario es admin
 */
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar permisos',
      error: error.message
    });
  }
};

/**
 * Middleware para verificar si el usuario es premium
 */
const premiumMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Esta función requiere una suscripción Premium'
      });
    }

    // Verificar si la suscripción está activa
    if (req.user.subscriptionEndDate && new Date(req.user.subscriptionEndDate) < new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Tu suscripción Premium ha expirado'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar suscripción',
      error: error.message
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  premiumMiddleware,
  // Aliases for convenience
  authenticate: authMiddleware,
  isAdmin: adminMiddleware,
  isPremium: premiumMiddleware
};
