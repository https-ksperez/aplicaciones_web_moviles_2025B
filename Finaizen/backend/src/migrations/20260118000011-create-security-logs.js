'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('security_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      event_type: {
        type: Sequelize.ENUM(
          'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGIN_BLOCKED', 'LOGOUT', 'SESSION_EXPIRED',
          'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS', 'TWO_FACTOR_ENABLED', 'TWO_FACTOR_DISABLED',
          'EMAIL_CHANGE_REQUEST', 'EMAIL_CHANGED', 'PASSWORD_CHANGED', 'PASSWORD_CHANGE_FAILED',
          'PROFILE_UPDATED', 'PERFIL_CREATED', 'PERFIL_DELETED', 'PERFIL_SWITCHED',
          'NOTIFICATION_SETTINGS_CHANGED', 'PRIVACY_SETTINGS_CHANGED',
          'DATA_EXPORT_REQUEST', 'DATA_EXPORT_COMPLETED', 'DATA_DELETED',
          'ACCOUNT_CREATED', 'ACCOUNT_DELETED', 'ACCOUNT_SUSPENDED',
          'SUSPICIOUS_ACTIVITY_DETECTED', 'MULTIPLE_LOGIN_ATTEMPTS', 'UNUSUAL_LOCATION'
        ),
        allowNull: false
      },
      severity: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'low'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      success: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('security_logs', ['user_id', 'event_type']);
    await queryInterface.addIndex('security_logs', ['created_at']);
    await queryInterface.addIndex('security_logs', ['severity']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('security_logs');
  }
};
