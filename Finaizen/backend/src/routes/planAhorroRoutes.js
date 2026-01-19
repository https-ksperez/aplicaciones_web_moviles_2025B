const express = require('express');
const router = express.Router({ mergeParams: true });
const createCRUDController = require('../controllers/crudController');
const { PlanAhorro } = require('../models');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const planAhorroController = createCRUDController(PlanAhorro, 'Plan de Ahorro');

router.get('/', planAhorroController.getAll);
router.get('/:id', planAhorroController.getOne);
router.post('/', planAhorroController.create);
router.put('/:id', planAhorroController.update);
router.delete('/:id', planAhorroController.delete);

module.exports = router;
