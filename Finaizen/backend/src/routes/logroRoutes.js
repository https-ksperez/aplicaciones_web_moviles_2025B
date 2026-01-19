const express = require('express');
const router = express.Router({ mergeParams: true });
const createCRUDController = require('../controllers/crudController');
const { Logro } = require('../models');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const logroController = createCRUDController(Logro, 'Logro');

router.get('/', logroController.getAll);
router.get('/:id', logroController.getOne);
router.post('/', logroController.create);
router.put('/:id', logroController.update);
router.delete('/:id', logroController.delete);

module.exports = router;
