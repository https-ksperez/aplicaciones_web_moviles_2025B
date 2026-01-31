const Ingreso = require("../models/ingreso.model");
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
 * GET /api/ingresos/:perfilId
 * Obtener todos los ingresos de un perfil
 */
module.exports.getAllIngresos = async (req, res, next) => {
  try {
    const { perfilId } = req.params;

    // Verificar que el perfil pertenece al usuario
    const esPropietario = await verificarPropietarioPerfil(req.user._id, perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este perfil", 403));
    }

    const ingresos = await Ingreso.find({ perfilId }).sort({ createdAt: -1 });
    res.json(ingresos);
  } catch (err) {
    next(new AppError("Error al obtener los ingresos", 500, err));
  }
};

/**
 * GET /api/ingresos/detalle/:id
 * Obtener un ingreso por ID
 */
module.exports.getIngresoById = async (req, res, next) => {
  try {
    const ingreso = await Ingreso.findById(req.params.id);

    if (!ingreso) {
      return next(new AppError("Ingreso no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, ingreso.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este ingreso", 403));
    }

    res.json(ingreso);
  } catch (err) {
    next(new AppError("Error al obtener el ingreso", 500, err));
  }
};

/**
 * POST /api/ingresos
 * Crear un nuevo ingreso
 */
module.exports.createIngreso = async (req, res, next) => {
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

    const nuevoIngreso = await Ingreso.create({
      perfilId,
      monto,
      descripcion,
      categoria: categoria || "Otros",
      frecuencia: frecuencia || "ocasional",
      ...resto,
    });

    res.status(201).json({
      mensaje: "Ingreso creado exitosamente",
      ingreso: nuevoIngreso,
    });
  } catch (err) {
    next(new AppError("Error al crear el ingreso", 500, err));
  }
};

/**
 * PUT /api/ingresos/:id
 * Actualizar un ingreso
 */
module.exports.updateIngreso = async (req, res, next) => {
  try {
    const ingreso = await Ingreso.findById(req.params.id);

    if (!ingreso) {
      return next(new AppError("Ingreso no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, ingreso.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este ingreso", 403));
    }

    const ingresoActualizado = await Ingreso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      mensaje: "Ingreso actualizado exitosamente",
      ingreso: ingresoActualizado,
    });
  } catch (err) {
    next(new AppError("Error al actualizar el ingreso", 500, err));
  }
};

/**
 * DELETE /api/ingresos/:id
 * Eliminar un ingreso
 */
module.exports.deleteIngreso = async (req, res, next) => {
  try {
    const ingreso = await Ingreso.findById(req.params.id);

    if (!ingreso) {
      return next(new AppError("Ingreso no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, ingreso.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este ingreso", 403));
    }

    await Ingreso.deleteOne({ _id: req.params.id });

    res.json({ mensaje: "Ingreso eliminado correctamente" });
  } catch (err) {
    next(new AppError("Error al eliminar el ingreso", 500, err));
  }
};
