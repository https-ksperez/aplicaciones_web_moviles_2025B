const { Notificacion } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.use(authMiddleware);

/**
 * Obtener todas las notificaciones del usuario
 */
router.get('/', async (req, res) => {
  try {
    const { leidas } = req.query;
    
    const where = { userId: req.userId };
    
    if (leidas !== undefined) {
      where.leida = leidas === 'true';
    }

    const notificaciones = await Notificacion.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: notificaciones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones',
      error: error.message
    });
  }
});

/**
 * Marcar notificación como leída
 */
router.put('/:id/leer', async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findOne({
      where: { id, userId: req.userId }
    });

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    await notificacion.marcarComoLeida();

    res.json({
      success: true,
      message: 'Notificación marcada como leída',
      data: notificacion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificación',
      error: error.message
    });
  }
});

/**
 * Marcar todas como leídas
 */
router.put('/leer-todas', async (req, res) => {
  try {
    await Notificacion.update(
      { leida: true },
      { where: { userId: req.userId, leida: false } }
    );

    res.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificaciones',
      error: error.message
    });
  }
});

/**
 * Eliminar notificación
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findOne({
      where: { id, userId: req.userId }
    });

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    await notificacion.destroy();

    res.json({
      success: true,
      message: 'Notificación eliminada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar notificación',
      error: error.message
    });
  }
});

module.exports = router;
