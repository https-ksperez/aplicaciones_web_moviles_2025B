const { DataTypes } = require('sequelize');

const CATEGORIAS_PLAN_DEUDA = [
  'Tarjeta de Crédito',
  'Préstamo Personal',
  'Hipoteca',
  'Préstamo Auto',
  'Deuda Familiar',
  'Servicios',
  'Otro'
];

module.exports = (sequelize) => {
  const PlanDeuda = sequelize.define('PlanDeuda', {
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
    categoria: {
      type: DataTypes.ENUM(...CATEGORIAS_PLAN_DEUDA),
      defaultValue: 'Otro'
    },
    montoDeuda: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    montoPagado: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    tasaInteres: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      comment: 'Tasa de interés anual en porcentaje'
    },
    cuotaMensual: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    fechaPago: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Fecha del próximo pago'
    },
    estado: {
      type: DataTypes.ENUM('activo', 'pausado', 'completado', 'cancelado'),
      defaultValue: 'activo'
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'normal', 'alta', 'urgente'),
      defaultValue: 'normal'
    },
    estrategia: {
      type: DataTypes.ENUM('bola_nieve', 'avalancha', 'equilibrada', 'agresiva'),
      defaultValue: 'equilibrada'
    },
    acreedor: {
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
    numeroContrato: {
      type: DataTypes.STRING(100),
      defaultValue: ''
    },
    historialPagos: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Historial de pagos realizados'
    },
    reajustes: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Historial de reajustes del plan'
    },
    notificacionActiva: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    icono: {
      type: DataTypes.STRING(10),
      defaultValue: '💳'
    },
    color: {
      type: DataTypes.STRING(20),
      defaultValue: '#FF6B6B'
    }
  }, {
    tableName: 'planes_deuda',
    timestamps: true,
    underscored: true
  });

  // Asociaciones
  PlanDeuda.associate = (models) => {
    PlanDeuda.belongsTo(models.Perfil, {
      foreignKey: 'perfilId',
      as: 'perfil'
    });
  };

  return PlanDeuda;
};
