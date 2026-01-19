'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ingresos', {
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
      monto: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      categoria: {
        type: Sequelize.ENUM('Salario', 'Freelance', 'Inversiones', 'Alquiler', 'Bonos', 'Regalos', 'Otros'),
        defaultValue: 'Otros'
      },
      frecuencia: {
        type: Sequelize.ENUM('diario', 'semanal', 'mensual', 'anual', 'ocasional'),
        defaultValue: 'ocasional'
      },
      dias_semana: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      },
      dia_mes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fecha_especifica: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delay: {
        type: Sequelize.STRING(5),
        defaultValue: '00:00'
      },
      notificacion_activa: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      proxima_ejecucion: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addIndex('ingresos', ['perfil_id']);
    await queryInterface.addIndex('ingresos', ['activo']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ingresos');
  }
};
