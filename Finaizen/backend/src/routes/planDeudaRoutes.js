const express = require('express');
const router = express.Router({ mergeParams: true });
const createCRUDController = require('../controllers/crudController');
const { PlanDeuda } = require('../models');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const planDeudaController = createCRUDController(PlanDeuda, 'Plan de Deuda');

router.get('/', planDeudaController.getAll);
router.get('/:id', planDeudaController.getOne);
router.post('/', planDeudaController.create);
router.put('/:id', planDeudaController.update);
router.delete('/:id', planDeudaController.delete);

module.exports = router;
