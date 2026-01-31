const Presupuesto = require("../models/presupuesto.model");
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
 * GET /api/presupuestos/:perfilId
 * Obtener todos los presupuestos de un perfil
 */
module.exports.getAllPresupuestos = async (req, res, next) => {
  try {
    const { perfilId } = req.params;

    // Verificar que el perfil pertenece al usuario
    const esPropietario = await verificarPropietarioPerfil(req.user._id, perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este perfil", 403));
    }

    const presupuestos = await Presupuesto.find({ perfilId }).sort({ categoria: 1 });
    
    // Agregar campos calculados a cada presupuesto
    const presupuestosConEstado = presupuestos.map((p) => ({
      ...p.toObject(),
      porcentajeGastado: p.getPorcentajeGastado(),
      montoRestante: p.getMontoRestante(),
      excedido: p.isExcedido(),
      estado: p.getEstado(),
    }));

    res.json(presupuestosConEstado);
  } catch (err) {
    next(new AppError("Error al obtener los presupuestos", 500, err));
  }
};

/**
 * GET /api/presupuestos/detalle/:id
 * Obtener un presupuesto por ID
 */
module.exports.getPresupuestoById = async (req, res, next) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return next(new AppError("Presupuesto no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, presupuesto.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este presupuesto", 403));
    }

    res.json({
      ...presupuesto.toObject(),
      porcentajeGastado: presupuesto.getPorcentajeGastado(),
      montoRestante: presupuesto.getMontoRestante(),
      excedido: presupuesto.isExcedido(),
      estado: presupuesto.getEstado(),
    });
  } catch (err) {
    next(new AppError("Error al obtener el presupuesto", 500, err));
  }
};

/**
 * POST /api/presupuestos
 * Crear un nuevo presupuesto
 */
module.exports.createPresupuesto = async (req, res, next) => {
  try {
    const { perfilId, categoria, montoLimite, periodo, alertaEn } = req.body;

    // Validar campos requeridos
    if (!perfilId || !categoria || !montoLimite) {
      return next(new AppError("perfilId, categoria y montoLimite son requeridos", 400));
    }

    // Verificar propiedad del perfil
    const esPropietario = await verificarPropietarioPerfil(req.user._id, perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este perfil", 403));
    }

    // Obtener mes y año actual
    const ahora = new Date();

    const nuevoPresupuesto = await Presupuesto.create({
      perfilId,
      categoria,
      montoLimite,
      periodo: periodo || "mensual",
      alertaEn: alertaEn || 80,
      mes: ahora.getMonth() + 1,
      anio: ahora.getFullYear(),
    });

    res.status(201).json({
      mensaje: "Presupuesto creado exitosamente",
      presupuesto: nuevoPresupuesto,
    });
  } catch (err) {
    next(new AppError("Error al crear el presupuesto", 500, err));
  }
};

/**
 * PUT /api/presupuestos/:id
 * Actualizar un presupuesto
 */
module.exports.updatePresupuesto = async (req, res, next) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return next(new AppError("Presupuesto no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, presupuesto.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este presupuesto", 403));
    }

    const presupuestoActualizado = await Presupuesto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      mensaje: "Presupuesto actualizado exitosamente",
      presupuesto: presupuestoActualizado,
    });
  } catch (err) {
    next(new AppError("Error al actualizar el presupuesto", 500, err));
  }
};

/**
 * DELETE /api/presupuestos/:id
 * Eliminar un presupuesto
 */
module.exports.deletePresupuesto = async (req, res, next) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return next(new AppError("Presupuesto no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, presupuesto.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este presupuesto", 403));
    }

    await Presupuesto.deleteOne({ _id: req.params.id });

    res.json({ mensaje: "Presupuesto eliminado correctamente" });
  } catch (err) {
    next(new AppError("Error al eliminar el presupuesto", 500, err));
  }
};
