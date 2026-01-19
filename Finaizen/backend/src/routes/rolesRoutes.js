const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación y ser admin
router.use(authenticate);
router.use(isAdmin);

// Obtener todos los roles
router.get('/', rolesController.getAll);

// Obtener todos los permisos
router.get('/permisos', rolesController.getAllPermisos);

// Crear un rol
router.post('/', rolesController.create);

// Actualizar un rol
router.put('/:id', rolesController.update);

// Eliminar un rol
router.delete('/:id', rolesController.remove);

module.exports = router;
