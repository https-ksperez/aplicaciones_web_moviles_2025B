const express = require('express');
const router = express.Router({ mergeParams: true });
const createCRUDController = require('../controllers/crudController');
const { Egreso } = require('../models');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const egresoController = createCRUDController(Egreso, 'Egreso');

router.get('/', egresoController.getAll);
router.get('/:id', egresoController.getOne);
router.post('/', egresoController.create);
router.put('/:id', egresoController.update);
router.delete('/:id', egresoController.delete);

module.exports = router;
