const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación y ser admin
router.use(authenticate);
router.use(isAdmin);

// Obtener opciones de filtros
router.get('/options', marketController.getOptions);

// Obtener todos los datos agrupados
router.get('/', marketController.getAll);

// Obtener datos por filtros
router.get('/data', marketController.getData);

// Actualizar datos de mercado
router.put('/', marketController.update);

module.exports = router;
