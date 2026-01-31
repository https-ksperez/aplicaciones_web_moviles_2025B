require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "FinaizenSecretKey2025MuySegura!";

/**
 * Middleware para proteger rutas que requieren autenticación
 * Verifica el token JWT y agrega el usuario a req.user
 */
module.exports.protectController = async (req, res, next) => {
  let token;

  // Verificar si existe el header Authorization con Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraer el token (formato: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];
      
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar el usuario y agregarlo a la request (sin la contraseña)
      req.user = await User.findById(decoded.userId).select("-contraseña");
      
      if (!req.user) {
        return res.status(401).json({ 
          mensaje: "Usuario no encontrado" 
        });
      }
      
      next();
    } catch (error) {
      console.log("❌ Error de autenticación:", error.message);
      return res.status(401).json({ 
        mensaje: "No autorizado, token inválido" 
      });
    }
  }

  // Si no hay token
  if (!token) {
    return res.status(401).json({ 
      mensaje: "No autorizado, falta el token" 
    });
  }
};

/**
 * Middleware opcional para verificar si el usuario es admin
 */
module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === "admin") {
    next();
  } else {
    return res.status(403).json({ 
      mensaje: "Acceso denegado, se requieren permisos de administrador" 
    });
  }
};

/**
 * Middleware opcional para verificar si el usuario es premium
 */
module.exports.isPremium = (req, res, next) => {
  if (req.user && req.user.isPremium) {
    next();
  } else {
    return res.status(403).json({ 
      mensaje: "Esta función requiere una suscripción Premium" 
    });
  }
};
