const { SupervisionIA, ReglaIA } = require('../models');
const { Op } = require('sequelize');

// Categorías disponibles
const categories = [
  'Entretenimiento',
  'Salud',
  'Transporte',
  'Supermercado',
  'Suscripciones',
  'Servicios',
  'Otros'
];

/**
 * Obtener todas las transacciones para supervisión
 */
const getAll = async (req, res) => {
  try {
    const { estado, confianza } = req.query;

    const where = {};
    if (estado) where.estado = estado;
    if (confianza) where.confianza = confianza;

    const transacciones = await SupervisionIA.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: transacciones.map(t => ({
        id: t.id,
        desc: t.descripcion,
        keyword: t.palabraClave,
        category: t.categoriaDetectada,
        correctCategory: t.categoriaCorrecta,
        confidence: t.confianza,
        score: t.score,
        status: t.estado
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacciones',
      error: error.message
    });
  }
};

/**
 * Obtener KPIs de supervisión
 */
const getKPIs = async (req, res) => {
  try {
    const total = await SupervisionIA.count();
    const validados = await SupervisionIA.count({ where: { estado: 'Validado' } });
    const correcciones = await SupervisionIA.count({ 
      where: { 
        estado: { [Op.in]: ['Corregir', 'Corregir y crear regla'] } 
      } 
    });

    // Calcular precisión
    const precision = total > 0 ? ((validados / total) * 100).toFixed(1) : 0;

    // Contar por confianza
    const altaConfianza = await SupervisionIA.count({ where: { confianza: 'alta' } });
    const mediaConfianza = await SupervisionIA.count({ where: { confianza: 'media' } });
    const bajaConfianza = await SupervisionIA.count({ where: { confianza: 'baja' } });

    res.json({
      success: true,
      data: {
        precision: parseFloat(precision),
        corrections: correcciones,
        problematicCategories: ['Suscripciones', 'Transporte'],
        chartData: {
          confidence: {
            labels: ['Alta', 'Media', 'Baja'],
            values: [altaConfianza, mediaConfianza, bajaConfianza]
          },
          corrections: {
            labels: ['Jul', 'Ago', 'Sep', 'Oct'],
            values: [120, 95, 88, correcciones]
          }
        },
        categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener KPIs',
      error: error.message
    });
  }
};

/**
 * Validar una transacción
 */
const validate = async (req, res) => {
  try {
    const { id } = req.params;

    const transaccion = await SupervisionIA.findByPk(id);

    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    await transaccion.update({ estado: 'Validado' });

    res.json({
      success: true,
      message: 'Transacción validada exitosamente',
      data: transaccion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al validar transacción',
      error: error.message
    });
  }
};

/**
 * Corregir categoría de una transacción
 */
const correct = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoriaCorrecta, crearRegla } = req.body;

    const transaccion = await SupervisionIA.findByPk(id);

    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    await transaccion.update({
      categoriaCorrecta,
      estado: crearRegla ? 'Corregir y crear regla' : 'Corregir',
      reglaCreada: crearRegla || false
    });

    // Si se solicita crear regla
    if (crearRegla) {
      await ReglaIA.findOrCreate({
        where: { palabraClave: transaccion.palabraClave },
        defaults: {
          palabraClave: transaccion.palabraClave,
          categoria: categoriaCorrecta,
          activa: true,
          creadoPor: req.user?.id || null
        }
      });
    }

    res.json({
      success: true,
      message: 'Transacción corregida exitosamente',
      data: transaccion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al corregir transacción',
      error: error.message
    });
  }
};

/**
 * Obtener todas las reglas de IA
 */
const getRules = async (req, res) => {
  try {
    const reglas = await ReglaIA.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: reglas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener reglas',
      error: error.message
    });
  }
};

/**
 * Crear una regla de IA
 */
const createRule = async (req, res) => {
  try {
    const { palabraClave, categoria } = req.body;

    const regla = await ReglaIA.create({
      palabraClave,
      categoria,
      activa: true,
      creadoPor: req.user?.id || null
    });

    res.status(201).json({
      success: true,
      message: 'Regla creada exitosamente',
      data: regla
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear regla',
      error: error.message
    });
  }
};

/**
 * Eliminar una regla de IA
 */
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;

    const regla = await ReglaIA.findByPk(id);

    if (!regla) {
      return res.status(404).json({
        success: false,
        message: 'Regla no encontrada'
      });
    }

    await regla.destroy();

    res.json({
      success: true,
      message: 'Regla eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar regla',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getKPIs,
  validate,
  correct,
  getRules,
  createRule,
  deleteRule
};
