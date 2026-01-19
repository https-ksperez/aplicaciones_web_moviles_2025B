const { DataTypes } = require('sequelize');

// Tipos de eventos de seguridad
const EVENT_TYPES = [
  // Autenticación
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'LOGIN_BLOCKED',
  'LOGOUT',
  'SESSION_EXPIRED',
  'PASSWORD_RESET_REQUEST',
  'PASSWORD_RESET_SUCCESS',
  'TWO_FACTOR_ENABLED',
  'TWO_FACTOR_DISABLED',
  
  // Configuración
  'EMAIL_CHANGE_REQUEST',
  'EMAIL_CHANGED',
  'PASSWORD_CHANGED',
  'PASSWORD_CHANGE_FAILED',
  'PROFILE_UPDATED',
  'PERFIL_CREATED',
  'PERFIL_DELETED',
  'PERFIL_SWITCHED',
  'NOTIFICATION_SETTINGS_CHANGED',
  'PRIVACY_SETTINGS_CHANGED',
  
  // Datos
  'DATA_EXPORT_REQUEST',
  'DATA_EXPORT_COMPLETED',
  'DATA_DELETED',
  
  // Acceso
  'ACCOUNT_CREATED',
  'ACCOUNT_DELETED',
  'ACCOUNT_SUSPENDED',
  
  // Sospechoso
  'SUSPICIOUS_ACTIVITY_DETECTED',
  'MULTIPLE_LOGIN_ATTEMPTS',
  'UNUSUAL_LOCATION'
];

module.exports = (sequelize) => {
  const SecurityLog = sequelize.define('SecurityLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    eventType: {
      type: DataTypes.ENUM(...EVENT_TYPES),
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'low'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IPv4 o IPv6'
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Información de geolocalización'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Datos adicionales del evento'
    },
    success: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'security_logs',
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['userId', 'eventType']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['severity']
      }
    ]
  });

  // Métodos estáticos
  SecurityLog.logEvent = async function(userId, eventType, options = {}) {
    const {
      severity = 'low',
      description = '',
      ipAddress = null,
      userAgent = null,
      location = null,
      metadata = {},
      success = true
    } = options;

    return await this.create({
      userId,
      eventType,
      severity,
      description,
      ipAddress,
      userAgent,
      location,
      metadata,
      success
    });
  };

  // Asociaciones
  SecurityLog.associate = (models) => {
    SecurityLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'usuario'
    });
  };

  return SecurityLog;
};
