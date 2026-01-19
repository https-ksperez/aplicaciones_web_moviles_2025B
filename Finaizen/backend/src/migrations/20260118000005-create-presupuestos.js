'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('presupuestos', {
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
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      monto_limite: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      monto_gastado: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      periodo: {
        type: Sequelize.ENUM('semanal', 'mensual', 'anual'),
        defaultValue: 'mensual'
      },
      alerta_en: {
        type: Sequelize.INTEGER,
        defaultValue: 80
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      mes: {
        type: Sequelize.INTEGER
      },
      anio: {
        type: Sequelize.INTEGER
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

    await queryInterface.addIndex('presupuestos', ['perfil_id']);
    await queryInterface.addIndex('presupuestos', ['mes', 'anio']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('presupuestos');
  }
};
