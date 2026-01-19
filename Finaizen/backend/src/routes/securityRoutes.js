const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación y ser admin
router.use(authenticate);
router.use(isAdmin);

// Obtener KPIs
router.get('/kpis', securityController.getKPIs);

// Exportar logs a CSV
router.get('/export', securityController.exportLogs);

// Obtener todos los logs
router.get('/', securityController.getAll);

// Bloquear/desbloquear una IP
router.put('/:id/toggle-block', securityController.toggleBlock);

module.exports = router;
