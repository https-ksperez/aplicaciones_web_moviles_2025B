const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReglaIA = sequelize.define('ReglaIA', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    palabraClave: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'palabra_clave'
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    creadoPor: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'creado_por'
    }
  }, {
    tableName: 'reglas_ia',
    timestamps: true,
    underscored: true
  });

  ReglaIA.associate = (models) => {
    ReglaIA.belongsTo(models.User, {
      foreignKey: 'creadoPor',
      as: 'creador'
    });
  };

  return ReglaIA;
};
