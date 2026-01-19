const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SupportTicket = sequelize.define('SupportTicket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    numeroTicket: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      field: 'numero_ticket'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id'
    },
    emailUsuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'email_usuario'
    },
    asunto: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('nuevo', 'pendiente', 'en_progreso', 'resuelto', 'escalado', 'cerrado'),
      defaultValue: 'nuevo'
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente'),
      defaultValue: 'media'
    },
    asignadoA: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'asignado_a'
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fechaResolucion: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fecha_resolucion'
    }
  }, {
    tableName: 'support_tickets',
    timestamps: true,
    underscored: true
  });

  SupportTicket.associate = (models) => {
    SupportTicket.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'usuario'
    });
  };

  return SupportTicket;
};
