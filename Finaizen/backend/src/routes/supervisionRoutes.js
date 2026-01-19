const express = require('express');
const router = express.Router();
const supervisionController = require('../controllers/supervisionController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación y ser admin
router.use(authenticate);
router.use(isAdmin);

// Obtener KPIs
router.get('/kpis', supervisionController.getKPIs);

// Obtener todas las reglas de IA
router.get('/rules', supervisionController.getRules);

// Crear una regla de IA
router.post('/rules', supervisionController.createRule);

// Eliminar una regla de IA
router.delete('/rules/:id', supervisionController.deleteRule);

// Obtener todas las transacciones para supervisión
router.get('/', supervisionController.getAll);

// Validar una transacción
router.put('/:id/validate', supervisionController.validate);

// Corregir categoría de una transacción
router.put('/:id/correct', supervisionController.correct);

module.exports = router;
