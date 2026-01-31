const Egreso = require("../models/egreso.model");
const Perfil = require("../models/perfil.model");
const { AppError } = require("../middlewares/errorHandler");

/**
 * Middleware auxiliar para verificar propiedad del perfil
 */
const verificarPropietarioPerfil = async (userId, perfilId) => {
  const perfil = await Perfil.findOne({ _id: perfilId, userId });
  return perfil !== null;
};

/**
 * GET /api/egresos/:perfilId
 * Obtener todos los egresos de un perfil
 */
module.exports.getAllEgresos = async (req, res, next) => {
  try {
    const { perfilId } = req.params;

    // Verificar que el perfil pertenece al usuario
    const esPropietario = await verificarPropietarioPerfil(req.user._id, perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este perfil", 403));
    }

    const egresos = await Egreso.find({ perfilId }).sort({ createdAt: -1 });
    res.json(egresos);
  } catch (err) {
    next(new AppError("Error al obtener los egresos", 500, err));
  }
};

/**
 * GET /api/egresos/detalle/:id
 * Obtener un egreso por ID
 */
module.exports.getEgresoById = async (req, res, next) => {
  try {
    const egreso = await Egreso.findById(req.params.id);

    if (!egreso) {
      return next(new AppError("Egreso no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, egreso.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este egreso", 403));
    }

    res.json(egreso);
  } catch (err) {
    next(new AppError("Error al obtener el egreso", 500, err));
  }
};

/**
 * POST /api/egresos
 * Crear un nuevo egreso
 */
module.exports.createEgreso = async (req, res, next) => {
  try {
    const { perfilId, monto, descripcion, categoria, frecuencia, ...resto } = req.body;

    // Validar campos requeridos
    if (!perfilId || !monto || !descripcion) {
      return next(new AppError("perfilId, monto y descripcion son requeridos", 400));
    }

    // Verificar propiedad del perfil
    const esPropietario = await verificarPropietarioPerfil(req.user._id, perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este perfil", 403));
    }

    const nuevoEgreso = await Egreso.create({
      perfilId,
      monto,
      descripcion,
      categoria: categoria || "Otros",
      frecuencia: frecuencia || "ocasional",
      ...resto,
    });

    res.status(201).json({
      mensaje: "Egreso creado exitosamente",
      egreso: nuevoEgreso,
    });
  } catch (err) {
    next(new AppError("Error al crear el egreso", 500, err));
  }
};

/**
 * PUT /api/egresos/:id
 * Actualizar un egreso
 */
module.exports.updateEgreso = async (req, res, next) => {
  try {
    const egreso = await Egreso.findById(req.params.id);

    if (!egreso) {
      return next(new AppError("Egreso no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, egreso.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este egreso", 403));
    }

    const egresoActualizado = await Egreso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      mensaje: "Egreso actualizado exitosamente",
      egreso: egresoActualizado,
    });
  } catch (err) {
    next(new AppError("Error al actualizar el egreso", 500, err));
  }
};

/**
 * DELETE /api/egresos/:id
 * Eliminar un egreso
 */
module.exports.deleteEgreso = async (req, res, next) => {
  try {
    const egreso = await Egreso.findById(req.params.id);

    if (!egreso) {
      return next(new AppError("Egreso no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, egreso.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este egreso", 403));
    }

    await Egreso.deleteOne({ _id: req.params.id });

    res.json({ mensaje: "Egreso eliminado correctamente" });
  } catch (err) {
    next(new AppError("Error al eliminar el egreso", 500, err));
  }
};
