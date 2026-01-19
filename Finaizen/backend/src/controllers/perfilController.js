const { Perfil, Ingreso, Egreso, Presupuesto, Logro, PlanAhorro, PlanDeuda, RegistroHistorial } = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener todos los perfiles del usuario
 */
const getPerfiles = async (req, res) => {
  try {
    const perfiles = await Perfil.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: perfiles
    });
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfiles',
      error: error.message
    });
  }
};

/**
 * Obtener un perfil específico
 */
const getPerfil = async (req, res) => {
  try {
    const { id } = req.params;

    const perfil = await Perfil.findOne({
      where: { id, userId: req.userId },
      include: ['ingresos', 'egresos', 'presupuestos', 'logros', 'planesAhorro', 'planesDeuda']
    });

    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    res.json({
      success: true,
      data: perfil
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

/**
 * Crear nuevo perfil
 */
const createPerfil = async (req, res) => {
  try {
    const { nombre, moneda, simboloMoneda, configuracion } = req.body;

    const perfil = await Perfil.create({
      userId: req.userId,
      nombre,
      moneda,
      simboloMoneda,
      configuracion
    });

    res.status(201).json({
      success: true,
      message: 'Perfil creado exitosamente',
      data: perfil
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear perfil',
      error: error.message
    });
  }
};

/**
 * Actualizar perfil
 */
const updatePerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, moneda, simboloMoneda, configuracion } = req.body;

    const perfil = await Perfil.findOne({
      where: { id, userId: req.userId }
    });

    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    await perfil.update({
      nombre,
      moneda,
      simboloMoneda,
      configuracion
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: perfil
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

/**
 * Eliminar perfil
 */
const deletePerfil = async (req, res) => {
  try {
    const { id } = req.params;

    const perfil = await Perfil.findOne({
      where: { id, userId: req.userId }
    });

    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    await perfil.destroy();

    res.json({
      success: true,
      message: 'Perfil eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar perfil',
      error: error.message
    });
  }
};

/**
 * Obtener resumen financiero del perfil
 */
const getResumenFinanciero = async (req, res) => {
  try {
    const { id } = req.params;

    const perfil = await Perfil.findOne({
      where: { id, userId: req.userId }
    });

    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      });
    }

    // Obtener transacciones del mes actual
    const now = new Date();
    const mes = now.getMonth() + 1;
    const anio = now.getFullYear();

    const transacciones = await RegistroHistorial.findAll({
      where: {
        perfilId: id,
        mes,
        anio
      }
    });

    // Calcular totales
    const totalIngresos = transacciones
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);

    const totalEgresos = transacciones
      .filter(t => t.tipo === 'egreso')
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);

    const balance = totalIngresos - totalEgresos;

    // Obtener presupuestos activos
    const presupuestos = await Presupuesto.findAll({
      where: {
        perfilId: id,
        activo: true,
        mes,
        anio
      }
    });

    // Obtener planes activos
    const planesAhorro = await PlanAhorro.findAll({
      where: {
        perfilId: id,
        estado: 'activo'
      }
    });

    const planesDeuda = await PlanDeuda.findAll({
      where: {
        perfilId: id,
        estado: 'activo'
      }
    });

    res.json({
      success: true,
      data: {
        periodo: { mes, anio },
        ingresos: totalIngresos,
        egresos: totalEgresos,
        balance,
        presupuestos: presupuestos.length,
        planesAhorro: planesAhorro.length,
        planesDeuda: planesDeuda.length,
        transacciones: transacciones.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen financiero',
      error: error.message
    });
  }
};

module.exports = {
  getPerfiles,
  getPerfil,
  createPerfil,
  updatePerfil,
  deletePerfil,
  getResumenFinanciero
};
