const { MarketIntelligence } = require('../models');

// Labels constantes
const expenseLabels = ['Restaurantes', 'Suscripciones', 'Transporte', 'Ocio', 'Ropa'];
const incomeLabels = ['Sueldo', 'Emprendimiento', 'Becas', 'Otros'];
const trendLabels = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'];

const ageOptions = [
  { value: '18-25', label: '18-25 años' },
  { value: '26-35', label: '26-35 años' },
  { value: '36-50', label: '36-50 años' }
];

const locationOptions = [
  { value: 'quito', label: 'Quito' },
  { value: 'guayaquil', label: 'Guayaquil' }
];

/**
 * Obtener datos de mercado por ubicación y rango de edad
 */
const getData = async (req, res) => {
  try {
    const { ubicacion, rangoEdad } = req.query;

    const where = {};
    if (ubicacion) where.ubicacion = ubicacion;
    if (rangoEdad) where.rangoEdad = rangoEdad;

    const data = await MarketIntelligence.findOne({ where });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Datos no encontrados para los filtros especificados'
      });
    }

    res.json({
      success: true,
      data: {
        expenses: data.gastos,
        incomeSources: data.fuentesIngreso,
        trends: data.tendencias
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de mercado',
      error: error.message
    });
  }
};

/**
 * Obtener todos los datos agrupados
 */
const getAll = async (req, res) => {
  try {
    const allData = await MarketIntelligence.findAll();

    // Agrupar por ubicación
    const grouped = {};
    allData.forEach(item => {
      if (!grouped[item.ubicacion]) {
        grouped[item.ubicacion] = {};
      }
      grouped[item.ubicacion][item.rangoEdad] = {
        expenses: item.gastos,
        incomeSources: item.fuentesIngreso,
        trends: item.tendencias
      };
    });

    res.json({
      success: true,
      data: grouped,
      labels: {
        expenseLabels,
        incomeLabels,
        trendLabels
      },
      options: {
        ageOptions,
        locationOptions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de mercado',
      error: error.message
    });
  }
};

/**
 * Obtener opciones de filtros
 */
const getOptions = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        ageOptions,
        locationOptions,
        expenseLabels,
        incomeLabels,
        trendLabels
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener opciones',
      error: error.message
    });
  }
};

/**
 * Actualizar datos de mercado
 */
const update = async (req, res) => {
  try {
    const { ubicacion, rangoEdad, gastos, fuentesIngreso, tendencias } = req.body;

    const [data, created] = await MarketIntelligence.upsert({
      ubicacion,
      rangoEdad,
      gastos,
      fuentesIngreso,
      tendencias
    });

    res.json({
      success: true,
      message: created ? 'Datos creados exitosamente' : 'Datos actualizados exitosamente',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos de mercado',
      error: error.message
    });
  }
};

module.exports = {
  getData,
  getAll,
  getOptions,
  update
};
