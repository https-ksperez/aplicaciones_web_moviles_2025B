import express from 'express';
import * as itemsController from '../controllers/itemsController.js';

const router = express.Router();

/**
 * Rutas para /items
 */

// GET /items - Obtener todos los items
router.get('/', itemsController.getItems);

// GET /items/:id - Obtener un item por ID
router.get('/:id', itemsController.getItemById);

// POST /items - Crear un nuevo item
router.post('/', itemsController.createItem);

// PUT /items/:id - Actualizar un item por ID
router.put('/:id', itemsController.updateItem);

// DELETE /items/:id - Eliminar un item por ID
router.delete('/:id', itemsController.deleteItem);

export default router;
