const { DataTypes } = require('sequelize');

const CATEGORIAS_PLAN_AHORRO = [
  'Personal',
  'Viajes',
  'Vehículo',
  'Casa',
  'Educación',
  'Otros'
];

module.exports = (sequelize) => {
  const PlanAhorro = sequelize.define('PlanAhorro', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    perfilId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'perfiles',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    objetivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Descripción del objetivo de ahorro'
    },
    montoActual: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    montoMeta: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    montoAhorrarMensual: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    categoria: {
      type: DataTypes.ENUM(...CATEGORIAS_PLAN_AHORRO),
      defaultValue: 'Personal'
    },
    fechaInicio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fechaMeta: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('activo', 'pausado', 'completado', 'cancelado'),
      defaultValue: 'activo'
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'normal', 'alta', 'urgente'),
      defaultValue: 'normal'
    },
    icono: {
      type: DataTypes.STRING(10),
      defaultValue: '💰'
    },
    color: {
      type: DataTypes.STRING(20),
      defaultValue: '#4CAF50'
    },
    // Seguimiento
    porcentajeCompletado: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    depositosRealizados: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    mesesRestantes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    estaEnPlazo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    // Configuración avanzada
    notificacionActiva: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tipoNotificacion: {
      type: DataTypes.ENUM('semanal', 'mensual'),
      defaultValue: 'mensual'
    },
    estrategia: {
      type: DataTypes.ENUM('consistente', 'agresiva', 'flexible'),
      defaultValue: 'consistente'
    },
    // Historial
    historialAhorros: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Historial de depósitos realizados'
    },
    reajustes: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Historial de reajustes del plan'
    }
  }, {
    tableName: 'planes_ahorro',
    timestamps: true,
    underscored: true
  });

  // Asociaciones
  PlanAhorro.associate = (models) => {
    PlanAhorro.belongsTo(models.Perfil, {
      foreignKey: 'perfilId',
      as: 'perfil'
    });
  };

  return PlanAhorro;
};
