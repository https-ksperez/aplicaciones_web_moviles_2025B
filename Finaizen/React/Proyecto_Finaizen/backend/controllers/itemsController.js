import * as itemsData from '../data/items.js';

/**
 * GET /items - Obtener todos los items
 */
export const getItems = (req, res) => {
  try {
    const items = itemsData.getAllItems();
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los items',
      error: error.message
    });
  }
};

/**
 * GET /items/:id - Obtener un item por ID
 */
export const getItemById = (req, res) => {
  try {
    const { id } = req.params;
    const item = itemsData.getItemById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item con ID ${id} no encontrado`
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el item',
      error: error.message
    });
  }
};

/**
 * POST /items - Crear un nuevo item
 */
export const createItem = (req, res) => {
  try {
    const itemData = req.body;
    
    // Validación básica
    if (!itemData.name || itemData.name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El campo "name" es requerido'
      });
    }
    
    const newItem = itemsData.createItem(itemData);
    
    res.status(201).json({
      success: true,
      message: 'Item creado exitosamente',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el item',
      error: error.message
    });
  }
};

/**
 * DELETE /items/:id - Eliminar un item por ID
 */
export const deleteItem = (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = itemsData.deleteItem(id);
    
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: `Item con ID ${id} no encontrado`
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Item eliminado exitosamente',
      data: deletedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el item',
      error: error.message
    });
  }
};

/**
 * PUT /items/:id - Actualizar un item por ID
 */
export const updateItem = (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;
    
    const updatedItem = itemsData.updateItem(id, itemData);
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: `Item con ID ${id} no encontrado`
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Item actualizado exitosamente',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el item',
      error: error.message
    });
  }
};
