const express = require('express');
const router = express.Router({ mergeParams: true });
const createCRUDController = require('../controllers/crudController');
const { Presupuesto } = require('../models');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const presupuestoController = createCRUDController(Presupuesto, 'Presupuesto');

router.get('/', presupuestoController.getAll);
router.get('/:id', presupuestoController.getOne);
router.post('/', presupuestoController.create);
router.put('/:id', presupuestoController.update);
router.delete('/:id', presupuestoController.delete);

module.exports = router;
