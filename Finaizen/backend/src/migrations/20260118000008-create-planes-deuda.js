'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('planes_deuda', {
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
      categoria: {
        type: Sequelize.ENUM('Tarjeta de Crédito', 'Préstamo Personal', 'Hipoteca', 'Préstamo Auto', 'Deuda Familiar', 'Servicios', 'Otro'),
        defaultValue: 'Otro'
      },
      monto_deuda: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      monto_pagado: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      tasa_interes: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      cuota_mensual: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      fecha_pago: {
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
      estrategia: {
        type: Sequelize.ENUM('bola_nieve', 'avalancha', 'equilibrada', 'agresiva'),
        defaultValue: 'equilibrada'
      },
      acreedor: {
        type: Sequelize.STRING(255),
        defaultValue: ''
      },
      numero_contrato: {
        type: Sequelize.STRING(100),
        defaultValue: ''
      },
      historial_pagos: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      reajustes: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      notificacion_activa: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      icono: {
        type: Sequelize.STRING(10),
        defaultValue: '💳'
      },
      color: {
        type: Sequelize.STRING(20),
        defaultValue: '#FF6B6B'
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

    await queryInterface.addIndex('planes_deuda', ['perfil_id']);
    await queryInterface.addIndex('planes_deuda', ['estado']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('planes_deuda');
  }
};
