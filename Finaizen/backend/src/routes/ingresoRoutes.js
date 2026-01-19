const express = require('express');
const router = express.Router({ mergeParams: true });
const createCRUDController = require('../controllers/crudController');
const { Ingreso } = require('../models');
const { authMiddleware } = require('../middleware/auth');

// Aplicar auth middleware
router.use(authMiddleware);

// Crear controlador CRUD para Ingresos
const ingresoController = createCRUDController(Ingreso, 'Ingreso');

/**
 * @route   GET /api/perfiles/:perfilId/ingresos
 * @desc    Obtener todos los ingresos del perfil
 * @access  Private
 */
router.get('/', ingresoController.getAll);

/**
 * @route   GET /api/perfiles/:perfilId/ingresos/:id
 * @desc    Obtener un ingreso específico
 * @access  Private
 */
router.get('/:id', ingresoController.getOne);

/**
 * @route   POST /api/perfiles/:perfilId/ingresos
 * @desc    Crear nuevo ingreso
 * @access  Private
 */
router.post('/', ingresoController.create);

/**
 * @route   PUT /api/perfiles/:perfilId/ingresos/:id
 * @desc    Actualizar ingreso
 * @access  Private
 */
router.put('/:id', ingresoController.update);

/**
 * @route   DELETE /api/perfiles/:perfilId/ingresos/:id
 * @desc    Eliminar ingreso
 * @access  Private
 */
router.delete('/:id', ingresoController.delete);

module.exports = router;
