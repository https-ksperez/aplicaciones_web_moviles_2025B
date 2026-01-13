/**
 * Almacenamiento en memoria para items
 * Simula una base de datos con un arreglo en memoria
 */

let items = [
  { id: 1, name: 'Item 1', description: 'Primer elemento de ejemplo', createdAt: new Date().toISOString() },
  { id: 2, name: 'Item 2', description: 'Segundo elemento de ejemplo', createdAt: new Date().toISOString() },
  { id: 3, name: 'Item 3', description: 'Tercer elemento de ejemplo', createdAt: new Date().toISOString() }
];

let nextId = 4;

/**
 * Obtiene todos los items
 */
export const getAllItems = () => {
  return items;
};

/**
 * Obtiene un item por ID
 */
export const getItemById = (id) => {
  return items.find(item => item.id === parseInt(id));
};

/**
 * Crea un nuevo item
 */
export const createItem = (itemData) => {
  const newItem = {
    id: nextId++,
    name: itemData.name || `Item ${nextId}`,
    description: itemData.description || '',
    createdAt: new Date().toISOString()
  };
  items.push(newItem);
  return newItem;
};

/**
 * Elimina un item por ID
 */
export const deleteItem = (id) => {
  const index = items.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    const deletedItem = items.splice(index, 1)[0];
    return deletedItem;
  }
  return null;
};

/**
 * Actualiza un item por ID
 */
export const updateItem = (id, itemData) => {
  const index = items.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    items[index] = {
      ...items[index],
      ...itemData,
      id: items[index].id, // Mantener el ID original
      updatedAt: new Date().toISOString()
    };
    return items[index];
  }
  return null;
};
