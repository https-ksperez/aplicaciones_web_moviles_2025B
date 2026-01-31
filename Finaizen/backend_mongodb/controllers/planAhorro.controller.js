const PlanAhorro = require("../models/planAhorro.model");
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
 * GET /api/planes-ahorro/:perfilId
 * Obtener todos los planes de ahorro de un perfil
 */
module.exports.getAllPlanesAhorro = async (req, res, next) => {
  try {
    const { perfilId } = req.params;

    // Verificar que el perfil pertenece al usuario
    const esPropietario = await verificarPropietarioPerfil(req.user._id, perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este perfil", 403));
    }

    const planes = await PlanAhorro.find({ perfilId }).sort({ createdAt: -1 });
    res.json(planes);
  } catch (err) {
    next(new AppError("Error al obtener los planes de ahorro", 500, err));
  }
};

/**
 * GET /api/planes-ahorro/detalle/:id
 * Obtener un plan de ahorro por ID
 */
module.exports.getPlanAhorroById = async (req, res, next) => {
  try {
    const plan = await PlanAhorro.findById(req.params.id);

    if (!plan) {
      return next(new AppError("Plan de ahorro no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, plan.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este plan", 403));
    }

    res.json(plan);
  } catch (err) {
    next(new AppError("Error al obtener el plan de ahorro", 500, err));
  }
};

/**
 * POST /api/planes-ahorro
 * Crear un nuevo plan de ahorro
 */
module.exports.createPlanAhorro = async (req, res, next) => {
  try {
    const {
      perfilId,
      nombre,
      descripcion,
      objetivo,
      montoMeta,
      montoAhorrarMensual,
      fechaMeta,
      categoria,
      prioridad,
      icono,
      color,
    } = req.body;

    // Validar campos requeridos
    if (!perfilId || !nombre || !objetivo || !montoMeta || !montoAhorrarMensual || !fechaMeta) {
      return next(
        new AppError(
          "perfilId, nombre, objetivo, montoMeta, montoAhorrarMensual y fechaMeta son requeridos",
          400
        )
      );
    }

    // Verificar propiedad del perfil
    const esPropietario = await verificarPropietarioPerfil(req.user._id, perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este perfil", 403));
    }

    const nuevoPlan = await PlanAhorro.create({
      perfilId,
      nombre,
      descripcion: descripcion || "",
      objetivo,
      montoMeta,
      montoAhorrarMensual,
      fechaMeta,
      categoria: categoria || "Personal",
      prioridad: prioridad || "normal",
      icono: icono || "💰",
      color: color || "#4CAF50",
    });

    res.status(201).json({
      mensaje: "Plan de ahorro creado exitosamente",
      planAhorro: nuevoPlan,
    });
  } catch (err) {
    next(new AppError("Error al crear el plan de ahorro", 500, err));
  }
};

/**
 * PUT /api/planes-ahorro/:id
 * Actualizar un plan de ahorro
 */
module.exports.updatePlanAhorro = async (req, res, next) => {
  try {
    const plan = await PlanAhorro.findById(req.params.id);

    if (!plan) {
      return next(new AppError("Plan de ahorro no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, plan.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este plan", 403));
    }

    // Actualizar campos
    Object.assign(plan, req.body);
    await plan.save(); // Esto ejecutará los pre-save hooks

    res.json({
      mensaje: "Plan de ahorro actualizado exitosamente",
      planAhorro: plan,
    });
  } catch (err) {
    next(new AppError("Error al actualizar el plan de ahorro", 500, err));
  }
};

/**
 * PUT /api/planes-ahorro/:id/depositar
 * Agregar un depósito al plan de ahorro
 */
module.exports.depositarPlanAhorro = async (req, res, next) => {
  try {
    const { monto } = req.body;

    if (!monto || monto <= 0) {
      return next(new AppError("El monto debe ser mayor a 0", 400));
    }

    const plan = await PlanAhorro.findById(req.params.id);

    if (!plan) {
      return next(new AppError("Plan de ahorro no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, plan.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este plan", 403));
    }

    // Actualizar monto y contadores
    plan.montoActual += monto;
    plan.depositosRealizados += 1;

    // Verificar si se completó
    if (plan.montoActual >= plan.montoMeta) {
      plan.estado = "completado";
    }

    await plan.save();

    res.json({
      mensaje: `Depósito de ${monto} realizado exitosamente`,
      planAhorro: plan,
    });
  } catch (err) {
    next(new AppError("Error al realizar el depósito", 500, err));
  }
};

/**
 * DELETE /api/planes-ahorro/:id
 * Eliminar un plan de ahorro
 */
module.exports.deletePlanAhorro = async (req, res, next) => {
  try {
    const plan = await PlanAhorro.findById(req.params.id);

    if (!plan) {
      return next(new AppError("Plan de ahorro no encontrado", 404));
    }

    // Verificar propiedad
    const esPropietario = await verificarPropietarioPerfil(req.user._id, plan.perfilId);
    if (!esPropietario) {
      return next(new AppError("No tienes acceso a este plan", 403));
    }

    await PlanAhorro.deleteOne({ _id: req.params.id });

    res.json({ mensaje: "Plan de ahorro eliminado correctamente" });
  } catch (err) {
    next(new AppError("Error al eliminar el plan de ahorro", 500, err));
  }
};
