const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const perfilController = require('../controllers/perfilController');
const { validate } = require('../middleware/validator');
const { authMiddleware } = require('../middleware/auth');

// Aplicar auth middleware a todas las rutas
router.use(authMiddleware);

/**
 * @route   GET /api/perfiles
 * @desc    Obtener todos los perfiles del usuario
 * @access  Private
 */
router.get('/', perfilController.getPerfiles);

/**
 * @route   GET /api/perfiles/:id
 * @desc    Obtener un perfil específico
 * @access  Private
 */
router.get('/:id', perfilController.getPerfil);

/**
 * @route   POST /api/perfiles
 * @desc    Crear nuevo perfil
 * @access  Private
 */
router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  validate
], perfilController.createPerfil);

/**
 * @route   PUT /api/perfiles/:id
 * @desc    Actualizar perfil
 * @access  Private
 */
router.put('/:id', perfilController.updatePerfil);

/**
 * @route   DELETE /api/perfiles/:id
 * @desc    Eliminar perfil
 * @access  Private
 */
router.delete('/:id', perfilController.deletePerfil);

/**
 * @route   GET /api/perfiles/:id/resumen
 * @desc    Obtener resumen financiero del perfil
 * @access  Private
 */
router.get('/:id/resumen', perfilController.getResumenFinanciero);

module.exports = router;
