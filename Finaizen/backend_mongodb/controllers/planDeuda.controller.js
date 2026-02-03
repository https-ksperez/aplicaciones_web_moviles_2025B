const PlanDeuda = require("../models/planDeuda.model");
const Perfil = require("../models/perfil.model");

// Crear un nuevo plan de deuda
exports.crear = async (req, res, next) => {
  try {
    const { perfilId } = req.body;

    // Verificar que el perfil existe
    const perfil = await Perfil.findById(perfilId);
    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: "Perfil no encontrado",
      });
    }

    const planDeuda = await PlanDeuda.create(req.body);

    res.status(201).json({
      success: true,
      message: "Plan de deuda creado exitosamente",
      data: planDeuda,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los planes de deuda de un perfil
exports.obtenerPorPerfil = async (req, res, next) => {
  try {
    const { perfilId } = req.params;

    const planesDeuda = await PlanDeuda.find({ perfilId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: planesDeuda.length,
      data: planesDeuda,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un plan de deuda por ID
exports.obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const planDeuda = await PlanDeuda.findById(id);

    if (!planDeuda) {
      return res.status(404).json({
        success: false,
        message: "Plan de deuda no encontrado",
      });
    }

    res.json({
      success: true,
      data: planDeuda,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un plan de deuda
exports.actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const planDeuda = await PlanDeuda.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!planDeuda) {
      return res.status(404).json({
        success: false,
        message: "Plan de deuda no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Plan de deuda actualizado exitosamente",
      data: planDeuda,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un plan de deuda
exports.eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const planDeuda = await PlanDeuda.findByIdAndDelete(id);

    if (!planDeuda) {
      return res.status(404).json({
        success: false,
        message: "Plan de deuda no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Plan de deuda eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// Registrar un pago en el plan de deuda
exports.registrarPago = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { monto, nota } = req.body;

    const planDeuda = await PlanDeuda.findById(id);

    if (!planDeuda) {
      return res.status(404).json({
        success: false,
        message: "Plan de deuda no encontrado",
      });
    }

    // Agregar pago al historial
    planDeuda.historialPagos.push({
      fecha: new Date(),
      monto,
      nota: nota || "Pago registrado",
    });

    // Actualizar monto pagado
    planDeuda.montoPagado += monto;

    await planDeuda.save();

    res.json({
      success: true,
      message: "Pago registrado exitosamente",
      data: planDeuda,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener estadísticas de deudas por perfil
exports.estadisticas = async (req, res, next) => {
  try {
    const { perfilId } = req.params;

    const planesDeuda = await PlanDeuda.find({ perfilId, estado: "activo" });

    const totalDeuda = planesDeuda.reduce((sum, p) => sum + p.montoDeuda, 0);
    const totalPagado = planesDeuda.reduce((sum, p) => sum + p.montoPagado, 0);
    const totalPendiente = totalDeuda - totalPagado;
    const cuotasTotales = planesDeuda.reduce(
      (sum, p) => sum + p.cuotaMensual,
      0
    );

    res.json({
      success: true,
      data: {
        totalDeudas: planesDeuda.length,
        totalDeuda,
        totalPagado,
        totalPendiente,
        cuotasMensuales: cuotasTotales,
        porcentajePagado:
          totalDeuda > 0 ? ((totalPagado / totalDeuda) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
