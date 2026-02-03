const Notificacion = require("../models/notificacion.model");

// Obtener todas las notificaciones del usuario
exports.getAllNotificaciones = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { leidas } = req.query;

    const query = { userId };

    if (leidas !== undefined) {
      query.leida = leidas === "true";
    }

    const notificaciones = await Notificacion.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: notificaciones.length,
      data: notificaciones,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener una notificación por ID
exports.getNotificacionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notificacion = await Notificacion.findOne({ _id: id, userId });

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada",
      });
    }

    res.json({
      success: true,
      data: notificacion,
    });
  } catch (error) {
    next(error);
  }
};

// Marcar notificación como leída
exports.marcarLeida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notificacion = await Notificacion.findOneAndUpdate(
      { _id: id, userId },
      { leida: true },
      { new: true }
    );

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Notificación marcada como leída",
      data: notificacion,
    });
  } catch (error) {
    next(error);
  }
};

// Marcar todas las notificaciones como leídas
exports.marcarTodasLeidas = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Notificacion.updateMany(
      { userId, leida: false },
      { leida: true }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notificaciones marcadas como leídas`,
    });
  } catch (error) {
    next(error);
  }
};

// Crear una notificación
exports.createNotificacion = async (req, res, next) => {
  try {
    const notificacion = await Notificacion.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Notificación creada exitosamente",
      data: notificacion,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una notificación
exports.deleteNotificacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notificacion = await Notificacion.findOneAndDelete({ _id: id, userId });

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Notificación eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar todas las notificaciones leídas
exports.deleteLeidas = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Notificacion.deleteMany({ userId, leida: true });

    res.json({
      success: true,
      message: `${result.deletedCount} notificaciones eliminadas`,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener conteo de notificaciones no leídas
exports.getConteoNoLeidas = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const count = await Notificacion.countDocuments({ userId, leida: false });

    res.json({
      success: true,
      data: { noLeidas: count },
    });
  } catch (error) {
    next(error);
  }
};
