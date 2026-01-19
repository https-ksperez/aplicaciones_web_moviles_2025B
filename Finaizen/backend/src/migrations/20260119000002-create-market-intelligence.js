'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('market_intelligence', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      ubicacion: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      rango_edad: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      gastos: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      fuentes_ingreso: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      tendencias: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índice único por ubicación y rango de edad
    await queryInterface.addIndex('market_intelligence', ['ubicacion', 'rango_edad'], {
      unique: true,
      name: 'market_ubicacion_edad_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('market_intelligence');
  }
};
