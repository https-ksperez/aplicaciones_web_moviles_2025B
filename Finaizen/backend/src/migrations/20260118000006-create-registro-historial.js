'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('registro_historial', {
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
      tipo: {
        type: Sequelize.ENUM('ingreso', 'egreso'),
        allowNull: false
      },
      monto: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      transaccion_origen_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      fecha_ejecucion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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

    await queryInterface.addIndex('registro_historial', ['perfil_id']);
    await queryInterface.addIndex('registro_historial', ['tipo']);
    await queryInterface.addIndex('registro_historial', ['mes', 'anio']);
    await queryInterface.addIndex('registro_historial', ['fecha_ejecucion']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('registro_historial');
  }
};
