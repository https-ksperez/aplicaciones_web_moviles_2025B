const Perfil = require("../models/perfil.model");
const { AppError } = require("../middlewares/errorHandler");

/**
 * GET /api/perfiles
 * Obtener todos los perfiles del usuario autenticado
 */
module.exports.getAllPerfiles = async (req, res, next) => {
  try {
    const perfiles = await Perfil.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(perfiles);
  } catch (err) {
    next(new AppError("Error al obtener los perfiles", 500, err));
  }
};

/**
 * GET /api/perfiles/:id
 * Obtener un perfil por ID
 */
module.exports.getPerfilById = async (req, res, next) => {
  try {
    const perfil = await Perfil.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!perfil) {
      return next(new AppError("Perfil no encontrado", 404));
    }

    res.json(perfil);
  } catch (err) {
    next(new AppError("Error al obtener el perfil", 500, err));
  }
};

/**
 * POST /api/perfiles
 * Crear un nuevo perfil
 */
module.exports.createPerfil = async (req, res, next) => {
  try {
    const { nombre, moneda, simboloMoneda, configuracion } = req.body;

    if (!nombre) {
      return next(new AppError("El nombre del perfil es requerido", 400));
    }

    const nuevoPerfil = await Perfil.create({
      userId: req.user._id,
      nombre,
      moneda: moneda || "USD",
      simboloMoneda: simboloMoneda || "$",
      configuracion: configuracion || {},
    });

    res.status(201).json({
      mensaje: "Perfil creado exitosamente",
      perfil: nuevoPerfil,
    });
  } catch (err) {
    next(new AppError("Error al crear el perfil", 500, err));
  }
};

/**
 * PUT /api/perfiles/:id
 * Actualizar un perfil
 */
module.exports.updatePerfil = async (req, res, next) => {
  try {
    const perfilActualizado = await Perfil.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!perfilActualizado) {
      return next(new AppError("Perfil no encontrado", 404));
    }

    res.json({
      mensaje: "Perfil actualizado exitosamente",
      perfil: perfilActualizado,
    });
  } catch (err) {
    next(new AppError("Error al actualizar el perfil", 500, err));
  }
};

/**
 * DELETE /api/perfiles/:id
 * Eliminar un perfil
 */
module.exports.deletePerfil = async (req, res, next) => {
  try {
    const eliminado = await Perfil.deleteOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!eliminado || eliminado.deletedCount === 0) {
      return next(new AppError("Perfil no encontrado", 404));
    }

    res.json({ mensaje: "Perfil eliminado correctamente" });
  } catch (err) {
    next(new AppError("Error al eliminar el perfil", 500, err));
  }
};
