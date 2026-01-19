'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supervision_ia', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      palabra_clave: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      categoria_detectada: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      categoria_correcta: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      confianza: {
        type: Sequelize.ENUM('alta', 'media', 'baja'),
        allowNull: false
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 100
        }
      },
      estado: {
        type: Sequelize.ENUM('Validado', 'Corregir', 'Corregir y crear regla', 'Pendiente'),
        defaultValue: 'Pendiente'
      },
      regla_creada: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    // Tabla para reglas de categorización IA
    await queryInterface.createTable('reglas_ia', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      palabra_clave: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      categoria: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      activa: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      creado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('reglas_ia');
    await queryInterface.dropTable('supervision_ia');
  }
};
