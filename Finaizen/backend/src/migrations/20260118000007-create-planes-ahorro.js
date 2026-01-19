'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('planes_ahorro', {
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
        defaultValue: ''
      },
      objetivo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      monto_actual: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      monto_meta: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      monto_ahorrar_mensual: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      categoria: {
        type: Sequelize.ENUM('Personal', 'Viajes', 'Vehículo', 'Casa', 'Educación', 'Otros'),
        defaultValue: 'Personal'
      },
      fecha_inicio: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      fecha_meta: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('activo', 'pausado', 'completado', 'cancelado'),
        defaultValue: 'activo'
      },
      prioridad: {
        type: Sequelize.ENUM('baja', 'normal', 'alta', 'urgente'),
        defaultValue: 'normal'
      },
      icono: {
        type: Sequelize.STRING(10),
        defaultValue: '💰'
      },
      color: {
        type: Sequelize.STRING(20),
        defaultValue: '#4CAF50'
      },
      porcentaje_completado: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      depositos_realizados: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      meses_restantes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      esta_en_plazo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      notificacion_activa: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      tipo_notificacion: {
        type: Sequelize.ENUM('semanal', 'mensual'),
        defaultValue: 'mensual'
      },
      estrategia: {
        type: Sequelize.ENUM('consistente', 'agresiva', 'flexible'),
        defaultValue: 'consistente'
      },
      historial_ahorros: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      reajustes: {
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

    await queryInterface.addIndex('planes_ahorro', ['perfil_id']);
    await queryInterface.addIndex('planes_ahorro', ['estado']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('planes_ahorro');
  }
};
