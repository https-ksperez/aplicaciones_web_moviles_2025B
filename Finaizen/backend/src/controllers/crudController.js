const { Perfil } = require('../models');

// Regex para validar cualquier UUID (no solo v4)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validar si un ID tiene formato UUID válido
 */
const isValidUUID = (id) => {
  return UUID_REGEX.test(id);
};

/**
 * Factory function para crear controladores CRUD genéricos
 * @param {Object} Model - Modelo de Sequelize
 * @param {string} modelName - Nombre del modelo para mensajes
 * @param {Array} includeRelations - Relaciones a incluir
 */
const createCRUDController = (Model, modelName, includeRelations = []) => {
  return {
    /**
     * Obtener todos los registros del perfil
     */
    getAll: async (req, res) => {
      try {
        const { perfilId } = req.params;

        // Validar formato UUID
        if (!isValidUUID(perfilId)) {
          return res.status(400).json({
            success: false,
            message: 'ID de perfil inválido. Por favor cierre sesión y vuelva a iniciar.'
          });
        }

        // Verificar que el perfil pertenece al usuario
        const perfil = await Perfil.findOne({
          where: { id: perfilId, userId: req.userId }
        });

        if (!perfil) {
          return res.status(404).json({
            success: false,
            message: 'Perfil no encontrado'
          });
        }

        const records = await Model.findAll({
          where: { perfilId },
          include: includeRelations
        });

        res.json({
          success: true,
          data: records
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error al obtener ${modelName}s`,
          error: error.message
        });
      }
    },

    /**
     * Obtener un registro específico
     */
    getOne: async (req, res) => {
      try {
        const { perfilId, id } = req.params;

        // Validar formato UUID
        if (!isValidUUID(perfilId)) {
          return res.status(400).json({
            success: false,
            message: 'ID de perfil inválido. Por favor cierre sesión y vuelva a iniciar.'
          });
        }

        // Verificar que el perfil pertenece al usuario
        const perfil = await Perfil.findOne({
          where: { id: perfilId, userId: req.userId }
        });

        if (!perfil) {
          return res.status(404).json({
            success: false,
            message: 'Perfil no encontrado'
          });
        }

        const record = await Model.findOne({
          where: { id, perfilId },
          include: includeRelations
        });

        if (!record) {
          return res.status(404).json({
            success: false,
            message: `${modelName} no encontrado`
          });
        }

        res.json({
          success: true,
          data: record
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error al obtener ${modelName}`,
          error: error.message
        });
      }
    },

    /**
     * Crear nuevo registro
     */
    create: async (req, res) => {
      try {
        const { perfilId } = req.params;

        // Validar formato UUID
        if (!isValidUUID(perfilId)) {
          return res.status(400).json({
            success: false,
            message: 'ID de perfil inválido. Por favor cierre sesión y vuelva a iniciar.'
          });
        }

        // Verificar que el perfil pertenece al usuario
        const perfil = await Perfil.findOne({
          where: { id: perfilId, userId: req.userId }
        });

        if (!perfil) {
          return res.status(404).json({
            success: false,
            message: 'Perfil no encontrado'
          });
        }

        const record = await Model.create({
          ...req.body,
          perfilId
        });

        res.status(201).json({
          success: true,
          message: `${modelName} creado exitosamente`,
          data: record
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error al crear ${modelName}`,
          error: error.message
        });
      }
    },

    /**
     * Actualizar registro
     */
    update: async (req, res) => {
      try {
        const { perfilId, id } = req.params;

        // Validar formato UUID
        if (!isValidUUID(perfilId)) {
          return res.status(400).json({
            success: false,
            message: 'ID de perfil inválido. Por favor cierre sesión y vuelva a iniciar.'
          });
        }

        // Verificar que el perfil pertenece al usuario
        const perfil = await Perfil.findOne({
          where: { id: perfilId, userId: req.userId }
        });

        if (!perfil) {
          return res.status(404).json({
            success: false,
            message: 'Perfil no encontrado'
          });
        }

        const record = await Model.findOne({
          where: { id, perfilId }
        });

        if (!record) {
          return res.status(404).json({
            success: false,
            message: `${modelName} no encontrado`
          });
        }

        await record.update(req.body);

        res.json({
          success: true,
          message: `${modelName} actualizado exitosamente`,
          data: record
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error al actualizar ${modelName}`,
          error: error.message
        });
      }
    },

    /**
     * Eliminar registro
     */
    delete: async (req, res) => {
      try {
        const { perfilId, id } = req.params;

        // Validar formato UUID
        if (!isValidUUID(perfilId)) {
          return res.status(400).json({
            success: false,
            message: 'ID de perfil inválido. Por favor cierre sesión y vuelva a iniciar.'
          });
        }

        // Verificar que el perfil pertenece al usuario
        const perfil = await Perfil.findOne({
          where: { id: perfilId, userId: req.userId }
        });

        if (!perfil) {
          return res.status(404).json({
            success: false,
            message: 'Perfil no encontrado'
          });
        }

        const record = await Model.findOne({
          where: { id, perfilId }
        });

        if (!record) {
          return res.status(404).json({
            success: false,
            message: `${modelName} no encontrado`
          });
        }

        await record.destroy();

        res.json({
          success: true,
          message: `${modelName} eliminado exitosamente`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error al eliminar ${modelName}`,
          error: error.message
        });
      }
    }
  };
};

module.exports = createCRUDController;
