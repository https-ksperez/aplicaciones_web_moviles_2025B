const Logro = require("../models/logro.model");
const Perfil = require("../models/perfil.model");

// Obtener todos los logros de un perfil
exports.getAllLogros = async (req, res, next) => {
  try {
    const { perfilId } = req.params;
    const { desbloqueado, tipo } = req.query;

    const query = { perfilId };

    if (desbloqueado !== undefined) {
      query.desbloqueado = desbloqueado === "true";
    }
    if (tipo) {
      query.tipo = tipo;
    }

    const logros = await Logro.find(query).sort({ desbloqueado: -1, createdAt: -1 });

    res.json({
      success: true,
      count: logros.length,
      data: logros,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un logro por ID
exports.getLogroById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const logro = await Logro.findById(id);

    if (!logro) {
      return res.status(404).json({
        success: false,
        message: "Logro no encontrado",
      });
    }

    res.json({
      success: true,
      data: logro,
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo logro
exports.createLogro = async (req, res, next) => {
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

    const logro = await Logro.create(req.body);

    res.status(201).json({
      success: true,
      message: "Logro creado exitosamente",
      data: logro,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un logro
exports.updateLogro = async (req, res, next) => {
  try {
    const { id } = req.params;

    const logro = await Logro.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!logro) {
      return res.status(404).json({
        success: false,
        message: "Logro no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Logro actualizado exitosamente",
      data: logro,
    });
  } catch (error) {
    next(error);
  }
};

// Desbloquear un logro
exports.desbloquearLogro = async (req, res, next) => {
  try {
    const { id } = req.params;

    const logro = await Logro.findById(id);

    if (!logro) {
      return res.status(404).json({
        success: false,
        message: "Logro no encontrado",
      });
    }

    logro.desbloqueado = true;
    logro.fechaDesbloqueo = new Date();
    logro.progreso = logro.meta;

    await logro.save();

    res.json({
      success: true,
      message: "¡Logro desbloqueado!",
      data: logro,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar progreso de un logro
exports.actualizarProgreso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { progreso } = req.body;

    const logro = await Logro.findById(id);

    if (!logro) {
      return res.status(404).json({
        success: false,
        message: "Logro no encontrado",
      });
    }

    logro.progreso = progreso;

    // Auto-desbloquear si alcanza la meta
    if (logro.progreso >= logro.meta && !logro.desbloqueado) {
      logro.desbloqueado = true;
      logro.fechaDesbloqueo = new Date();
    }

    await logro.save();

    res.json({
      success: true,
      message: logro.desbloqueado ? "¡Logro desbloqueado!" : "Progreso actualizado",
      data: logro,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un logro
exports.deleteLogro = async (req, res, next) => {
  try {
    const { id } = req.params;

    const logro = await Logro.findByIdAndDelete(id);

    if (!logro) {
      return res.status(404).json({
        success: false,
        message: "Logro no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Logro eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};
