const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Ruta para que usuarios normales puedan crear tickets (solo requiere autenticación)
router.post('/ticket', authenticate, supportController.createUserTicket);

// Rutas de Admin - requieren autenticación y ser admin
router.use(authenticate);
router.use(isAdmin);

// Obtener KPIs
router.get('/kpis', supportController.getKPIs);

// Obtener agentes de soporte
router.get('/agents', supportController.getAgents);

// Obtener todos los tickets
router.get('/', supportController.getAll);

// Crear un ticket (admin)
router.post('/', supportController.create);

// Obtener un ticket por ID
router.get('/:id', supportController.getById);

// Actualizar un ticket
router.put('/:id', supportController.update);

// Asignar ticket a un agente
router.put('/:id/assign', supportController.assign);

module.exports = router;
