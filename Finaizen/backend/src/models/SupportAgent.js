const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SupportAgent = sequelize.define('SupportAgent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nivel: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'support_agents',
    timestamps: true,
    underscored: true
  });

  return SupportAgent;
};
