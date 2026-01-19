/**
 * Rutas del Scheduler (Ejecutar transacciones manualmente)
 */

const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/auth');
const { ejecutarPendientesHoy, procesarTransaccionesPendientes } = require('../services/schedulerService');
const { Ingreso, Egreso, RegistroHistorial } = require('../models');
const { Op } = require('sequelize');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /api/scheduler/status
 * Obtener estado del scheduler y transacciones pendientes
 */
router.get('/status', async (req, res) => {
  try {
    const ahora = new Date();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Contar transacciones recurrentes activas
    const ingresosActivos = await Ingreso.count({
      where: {
        activo: true,
        frecuencia: { [Op.ne]: 'ocasional' }
      }
    });

    const egresosActivos = await Egreso.count({
      where: {
        activo: true,
        frecuencia: { [Op.ne]: 'ocasional' }
      }
    });

    // Contar ejecuciones de hoy
    const ejecucionesHoy = await RegistroHistorial.count({
      where: {
        fechaEjecucion: { [Op.gte]: hoy }
      }
    });

    res.json({
      success: true,
      data: {
        horaServidor: ahora.toISOString(),
        transaccionesRecurrentes: {
          ingresos: ingresosActivos,
          egresos: egresosActivos,
          total: ingresosActivos + egresosActivos
        },
        ejecucionesHoy: ejecucionesHoy,
        schedulerActivo: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estado del scheduler',
      error: error.message
    });
  }
});

/**
 * POST /api/scheduler/ejecutar
 * Ejecutar todas las transacciones pendientes de hoy (forzado)
 */
router.post('/ejecutar', async (req, res) => {
  try {
    const resultado = await ejecutarPendientesHoy();
    
    res.json({
      success: resultado.success,
      message: `Se ejecutaron ${resultado.ejecutados || 0} transacciones`,
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al ejecutar transacciones',
      error: error.message
    });
  }
});

/**
 * POST /api/scheduler/procesar
 * Procesar transacciones que corresponden a la hora actual
 */
router.post('/procesar', async (req, res) => {
  try {
    const ejecutados = await procesarTransaccionesPendientes();
    
    res.json({
      success: true,
      message: `Se procesaron ${ejecutados} transacciones`,
      ejecutados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al procesar transacciones',
      error: error.message
    });
  }
});

/**
 * GET /api/scheduler/pendientes
 * Obtener lista de transacciones que se ejecutarán hoy
 */
router.get('/pendientes', async (req, res) => {
  try {
    const ahora = new Date();
    const diaActual = ahora.getDay();
    const diaDelMes = ahora.getDate();

    // Obtener ingresos que se ejecutarán hoy
    const ingresos = await Ingreso.findAll({
      where: {
        activo: true,
        frecuencia: { [Op.ne]: 'ocasional' }
      },
      attributes: ['id', 'descripcion', 'monto', 'frecuencia', 'diasSemana', 'diaMes', 'delay', 'categoria']
    });

    // Obtener egresos que se ejecutarán hoy
    const egresos = await Egreso.findAll({
      where: {
        activo: true,
        frecuencia: { [Op.ne]: 'ocasional' }
      },
      attributes: ['id', 'descripcion', 'monto', 'frecuencia', 'diasSemana', 'diaMes', 'delay', 'categoria']
    });

    // Filtrar los que corresponden a hoy
    const ingresosPendientes = ingresos.filter(i => {
      if (i.frecuencia === 'diario') return true;
      if (i.frecuencia === 'semanal' && i.diasSemana?.includes(diaActual)) return true;
      if (i.frecuencia === 'mensual' && i.diaMes === diaDelMes) return true;
      return false;
    });

    const egresosPendientes = egresos.filter(e => {
      if (e.frecuencia === 'diario') return true;
      if (e.frecuencia === 'semanal' && e.diasSemana?.includes(diaActual)) return true;
      if (e.frecuencia === 'mensual' && e.diaMes === diaDelMes) return true;
      return false;
    });

    res.json({
      success: true,
      data: {
        fecha: ahora.toISOString().split('T')[0],
        diaSemana: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][diaActual],
        diaDelMes,
        ingresos: ingresosPendientes.map(i => ({
          id: i.id,
          descripcion: i.descripcion,
          monto: parseFloat(i.monto),
          frecuencia: i.frecuencia,
          horaEjecucion: i.delay || '00:00',
          categoria: i.categoria
        })),
        egresos: egresosPendientes.map(e => ({
          id: e.id,
          descripcion: e.descripcion,
          monto: parseFloat(e.monto),
          frecuencia: e.frecuencia,
          horaEjecucion: e.delay || '00:00',
          categoria: e.categoria
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pendientes',
      error: error.message
    });
  }
});

module.exports = router;
