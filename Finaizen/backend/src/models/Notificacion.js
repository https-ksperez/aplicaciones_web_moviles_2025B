const { DataTypes } = require('sequelize');

const TIPOS_NOTIFICACION = [
  'info',
  'warning',
  'success',
  'error',
  'logro',
  'presupuesto',
  'transaccion'
];

module.exports = (sequelize) => {
  const Notificacion = sequelize.define('Notificacion', {
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
    perfilId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'perfiles',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    tipo: {
      type: DataTypes.ENUM(...TIPOS_NOTIFICACION),
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    icono: {
      type: DataTypes.STRING(10),
      defaultValue: '🔔'
    },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accionUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL a la que redirigir al hacer click'
    },
    data: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Datos adicionales de la notificación'
    }
  }, {
    tableName: 'notificaciones',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['userId', 'leida']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Métodos de instancia
  Notificacion.prototype.marcarComoLeida = async function() {
    this.leida = true;
    await this.save();
  };

  // Métodos estáticos
  Notificacion.crearNotificacionLogro = async function(userId, perfilId, logro) {
    return await this.create({
      userId,
      perfilId,
      tipo: 'logro',
      titulo: '🏆 ¡Nuevo Logro Desbloqueado!',
      mensaje: `Has desbloqueado "${logro.nombre}": ${logro.descripcion}`,
      icono: logro.icono,
      accionUrl: '/logros',
      data: { logroId: logro.id }
    });
  };

  Notificacion.crearNotificacionPresupuesto = async function(userId, perfilId, presupuesto) {
    let tipo = 'info';
    let icono = '📊';
    let titulo = 'Alerta de Presupuesto';
    
    const estado = presupuesto.getEstado();
    
    if (estado === 'danger') {
      tipo = 'error';
      icono = '⚠️';
      titulo = '¡Presupuesto Excedido!';
    } else if (estado === 'warning') {
      tipo = 'warning';
      icono = '🔔';
      titulo = 'Presupuesto Cerca del Límite';
    }

    return await this.create({
      userId,
      perfilId,
      tipo,
      titulo,
      mensaje: `Tu presupuesto de ${presupuesto.categoria} está al ${presupuesto.getPorcentajeGastado().toFixed(1)}%`,
      icono,
      accionUrl: '/presupuestos',
      data: { presupuestoId: presupuesto.id }
    });
  };

  // Asociaciones
  Notificacion.associate = (models) => {
    Notificacion.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'usuario'
    });
    Notificacion.belongsTo(models.Perfil, {
      foreignKey: 'perfilId',
      as: 'perfil'
    });
  };

  return Notificacion;
};
