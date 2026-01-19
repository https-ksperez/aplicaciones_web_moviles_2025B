'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      nombre_usuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      contraseña: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      pais: {
        type: Sequelize.STRING(100),
        defaultValue: 'Ecuador'
      },
      ciudad: {
        type: Sequelize.STRING(100),
        defaultValue: ''
      },
      fecha_nacimiento: {
        type: Sequelize.DATE,
        allowNull: true
      },
      genero: {
        type: Sequelize.ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decir'),
        defaultValue: 'prefiero_no_decir'
      },
      rol: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user'
      },
      is_premium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      premium_since: {
        type: Sequelize.DATE,
        allowNull: true
      },
      subscription_type: {
        type: Sequelize.ENUM('mensual', 'anual'),
        allowNull: true
      },
      subscription_end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      payment_method: {
        type: Sequelize.JSONB,
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

    // Crear índices
    await queryInterface.addIndex('users', ['correo']);
    await queryInterface.addIndex('users', ['nombre_usuario']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
