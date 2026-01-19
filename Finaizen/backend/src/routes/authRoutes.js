const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validator');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('correo').isEmail().withMessage('Correo inválido'),
  body('nombreUsuario').isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validate
], authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', [
  body('correo').isEmail().withMessage('Correo inválido'),
  body('contraseña').notEmpty().withMessage('La contraseña es requerida'),
  validate
], authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario autenticado (verificar token)
 * @access  Private
 */
router.get('/me', authMiddleware, authController.me);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualizar perfil del usuario
 * @access  Private
 */
router.put('/profile', authMiddleware, authController.updateProfile);

/**
 * @route   POST /api/auth/change-password
 * @desc    Cambiar contraseña
 * @access  Private
 */
router.post('/change-password', [
  authMiddleware,
  body('contraseñaActual').notEmpty().withMessage('La contraseña actual es requerida'),
  body('contraseñaNueva').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  validate
], authController.changePassword);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Cambiar contraseña (método PUT alternativo)
 * @access  Private
 */
router.put('/change-password', [
  authMiddleware,
  body('currentPassword').notEmpty().withMessage('La contraseña actual es requerida'),
  body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  validate
], authController.changePasswordAlt);

/**
 * @route   POST /api/auth/activar-premium
 * @desc    Activar suscripción premium
 * @access  Private
 */
router.post('/activar-premium', authMiddleware, authController.activarPremium);

module.exports = router;
