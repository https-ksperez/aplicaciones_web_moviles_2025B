const RegistroHistorial = require("../models/registroHistorial.model");
const Perfil = require("../models/perfil.model");

// Obtener todo el historial de un perfil
exports.getAllHistorial = async (req, res, next) => {
  try {
    const { perfilId } = req.params;
    const { mes, anio, tipo, limit = 50 } = req.query;

    console.log('📋 Historial solicitado para perfilId:', perfilId);

    // Validar que perfilId existe y es válido
    if (!perfilId || perfilId === 'undefined' || perfilId === 'null') {
      return res.status(400).json({
        success: false,
        mensaje: "perfilId es requerido y debe ser válido",
      });
    }

    const query = { perfilId };

    if (mes) query.mes = parseInt(mes);
    if (anio) query.anio = parseInt(anio);
    if (tipo) query.tipo = tipo;

    const historial = await RegistroHistorial.find(query)
      .sort({ fechaEjecucion: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: historial.length,
      data: historial,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un registro por ID
exports.getHistorialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const registro = await RegistroHistorial.findById(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado",
      });
    }

    res.json({
      success: true,
      data: registro,
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo registro en el historial
exports.createHistorial = async (req, res, next) => {
  try {
    const { perfilId } = req.params;

    // Verificar que el perfil existe
    const perfil = await Perfil.findById(perfilId);
    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: "Perfil no encontrado",
      });
    }

    const registro = await RegistroHistorial.create({
      ...req.body,
      perfilId,
    });

    res.status(201).json({
      success: true,
      message: "Registro creado exitosamente",
      data: registro,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un registro
exports.updateHistorial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const registro = await RegistroHistorial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Registro actualizado exitosamente",
      data: registro,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un registro
exports.deleteHistorial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const registro = await RegistroHistorial.findByIdAndDelete(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Registro eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// Obtener resumen del historial por perfil
exports.getResumen = async (req, res, next) => {
  try {
    const { perfilId } = req.params;
    const { mes, anio } = req.query;

    const matchQuery = { perfilId: require("mongoose").Types.ObjectId(perfilId) };
    
    if (mes) matchQuery.mes = parseInt(mes);
    if (anio) matchQuery.anio = parseInt(anio);

    const resumen = await RegistroHistorial.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$tipo",
          total: { $sum: "$monto" },
          count: { $sum: 1 },
        },
      },
    ]);

    const ingresos = resumen.find((r) => r._id === "ingreso") || { total: 0, count: 0 };
    const egresos = resumen.find((r) => r._id === "egreso") || { total: 0, count: 0 };

    res.json({
      success: true,
      data: {
        ingresos: ingresos.total,
        egresos: egresos.total,
        balance: ingresos.total - egresos.total,
        totalTransacciones: ingresos.count + egresos.count,
      },
    });
  } catch (error) {
    next(error);
  }
};
