const { Role, Permiso, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Mapear nombres de roles del sistema a valores del ENUM de users
 */
const roleNameToEnum = {
  'administrador': 'admin',
  'admin': 'admin',
  'usuario': 'user',
  'usuario básico': 'user',
  'premium': 'user', // Premium son users con isPremium=true
  'moderador': 'admin' // Moderadores también cuentan como admins
};

/**
 * Obtener todos los roles con sus permisos
 */
const getAll = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permiso,
        as: 'permisos',
        through: { attributes: [] }
      }],
      order: [['createdAt', 'ASC']]
    });

    // Contar usuarios por rol
    const rolesWithCount = await Promise.all(roles.map(async (role) => {
      let userCount = 0;
      const roleName = role.nombre.toLowerCase();
      
      try {
        // Mapear el nombre del rol al ENUM de users
        const enumValue = roleNameToEnum[roleName];
        
        if (roleName === 'premium') {
          // Para premium, contar usuarios con isPremium = true
          userCount = await User.count({ where: { isPremium: true } });
        } else if (enumValue) {
          userCount = await User.count({ where: { rol: enumValue } });
        }
      } catch (e) {
        // Si hay error en el conteo, usar 0
        userCount = 0;
      }
      
      return {
        id: role.id,
        name: role.nombre,
        description: role.descripcion,
        userCount: userCount,
        permissions: role.permisos ? role.permisos.map(p => p.nombre) : [],
        protected: role.protegido
      };
    }));

    res.json({
      success: true,
      data: rolesWithCount
    });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener roles',
      error: error.message
    });
  }
};

/**
 * Obtener todos los permisos disponibles
 */
const getAllPermisos = async (req, res) => {
  try {
    const permisos = await Permiso.findAll({
      order: [['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: permisos.map(p => p.nombre)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener permisos',
      error: error.message
    });
  }
};

/**
 * Crear un nuevo rol
 */
const create = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    const role = await Role.create({
      nombre: name,
      descripcion: description,
      protegido: false
    });

    // Asignar permisos
    if (permissions && permissions.length > 0) {
      const permisosDb = await Permiso.findAll({
        where: { nombre: permissions }
      });
      await role.setPermisos(permisosDb);
    }

    // Recargar con permisos
    await role.reload({
      include: [{
        model: Permiso,
        as: 'permisos',
        through: { attributes: [] }
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Rol creado exitosamente',
      data: {
        id: role.id,
        name: role.nombre,
        description: role.descripcion,
        userCount: 0,
        permissions: role.permisos.map(p => p.nombre),
        protected: role.protegido
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear rol',
      error: error.message
    });
  }
};

/**
 * Actualizar un rol
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    if (role.protegido) {
      return res.status(403).json({
        success: false,
        message: 'No se puede modificar un rol protegido'
      });
    }

    await role.update({
      nombre: name || role.nombre,
      descripcion: description || role.descripcion
    });

    // Actualizar permisos si se proporcionan
    if (permissions) {
      const permisosDb = await Permiso.findAll({
        where: { nombre: permissions }
      });
      await role.setPermisos(permisosDb);
    }

    await role.reload({
      include: [{
        model: Permiso,
        as: 'permisos',
        through: { attributes: [] }
      }]
    });

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: {
        id: role.id,
        name: role.nombre,
        description: role.descripcion,
        permissions: role.permisos.map(p => p.nombre),
        protected: role.protegido
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar rol',
      error: error.message
    });
  }
};

/**
 * Eliminar un rol
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    if (role.protegido) {
      return res.status(403).json({
        success: false,
        message: 'No se puede eliminar un rol protegido'
      });
    }

    await role.destroy();

    res.json({
      success: true,
      message: 'Rol eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar rol',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getAllPermisos,
  create,
  update,
  remove
};
