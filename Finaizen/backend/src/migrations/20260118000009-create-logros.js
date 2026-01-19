'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('logros', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      perfil_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'perfiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      icono: {
        type: Sequelize.STRING(10),
        defaultValue: '🏆'
      },
      tipo: {
        type: Sequelize.ENUM('ahorro', 'racha', 'presupuesto', 'registro', 'especial', 'empresa'),
        allowNull: false
      },
      condicion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      desbloqueado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      fecha_desbloqueo: {
        type: Sequelize.DATE,
        allowNull: true
      },
      progreso: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      meta: {
        type: Sequelize.INTEGER,
        defaultValue: 100
      },
      empresa: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      logo_empresa: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      recompensa: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      valor_recompensa: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      requiere_comprobante: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      comprobantes: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('logros', ['perfil_id']);
    await queryInterface.addIndex('logros', ['tipo']);
    await queryInterface.addIndex('logros', ['desbloqueado']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('logros');
  }
};
