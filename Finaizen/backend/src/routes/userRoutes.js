const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { User } = require('../models');

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios (solo admin)
 * @access  Private/Admin
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['contraseña'] }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['contraseña'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Solo permitir actualizar ciertos campos
    const allowedFields = [
      'nombre', 'apellido', 'correo', 'pais', 'ciudad', 
      'fechaNacimiento', 'genero', 'twoFactorEnabled',
      'premiumActivo', 'fechaInicioPremium', 'fechaFinPremium',
      'rol', 'activo', 'isPremium', 'subscriptionType', 'subscriptionEndDate'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await user.update(updateData);

    // Devolver usuario sin contraseña
    const userData = user.toJSON();
    delete userData.contraseña;

    res.json({
      success: true,
      message: 'Usuario actualizado',
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario (solo admin)
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'Usuario eliminado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
});

module.exports = router;
