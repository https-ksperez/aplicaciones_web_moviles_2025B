/**
 * Clase de Error personalizada para la aplicación
 */
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Middleware centralizado para manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  console.log("❌ Error capturado:", err);

  // Errores de validación de Mongoose
  if (err?.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      mensaje: "Datos inválidos",
      errores: errors,
    });
  }

  // Errores de ObjectId inválido
  if (err?.name === "CastError") {
    return res.status(400).json({
      mensaje: "ID inválido",
    });
  }

  // Errores de duplicidad (unique)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      mensaje: `El campo '${field}' ya existe`,
      campo: field,
    });
  }

  // AppError personalizado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      mensaje: err.message,
      detalles: err.details,
    });
  }

  // JWT Errors
  if (err?.name === "JsonWebTokenError") {
    return res.status(401).json({
      mensaje: "Token inválido",
    });
  }

  if (err?.name === "TokenExpiredError") {
    return res.status(401).json({
      mensaje: "Token expirado",
    });
  }

  // Error genérico
  return res.status(500).json({
    mensaje: "Error interno del servidor",
  });
};

module.exports = { AppError, errorHandler };
