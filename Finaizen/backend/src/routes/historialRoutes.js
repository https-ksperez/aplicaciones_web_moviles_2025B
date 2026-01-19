const express = require('express');
const router = express.Router({ mergeParams: true });
const createCRUDController = require('../controllers/crudController');
const { RegistroHistorial } = require('../models');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const historialController = createCRUDController(RegistroHistorial, 'Registro Historial');

router.get('/', historialController.getAll);
router.get('/:id', historialController.getOne);
router.post('/', historialController.create);
router.put('/:id', historialController.update);
router.delete('/:id', historialController.delete);

module.exports = router;
