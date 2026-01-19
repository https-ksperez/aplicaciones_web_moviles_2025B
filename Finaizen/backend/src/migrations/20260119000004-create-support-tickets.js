'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('support_tickets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      numero_ticket: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      email_usuario: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      asunto: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('nuevo', 'pendiente', 'en_progreso', 'resuelto', 'escalado', 'cerrado'),
        defaultValue: 'nuevo'
      },
      prioridad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'urgente'),
        defaultValue: 'media'
      },
      asignado_a: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      respuesta: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fecha_resolucion: {
        type: Sequelize.DATE,
        allowNull: true
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

    // Tabla para opciones de asignación
    await queryInterface.createTable('support_agents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nivel: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('support_agents');
    await queryInterface.dropTable('support_tickets');
  }
};
