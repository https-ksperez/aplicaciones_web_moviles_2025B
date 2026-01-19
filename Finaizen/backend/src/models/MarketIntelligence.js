const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MarketIntelligence = sequelize.define('MarketIntelligence', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ubicacion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    rangoEdad: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'rango_edad'
    },
    gastos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    fuentesIngreso: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: 'fuentes_ingreso'
    },
    tendencias: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    }
  }, {
    tableName: 'market_intelligence',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['ubicacion', 'rango_edad']
      }
    ]
  });

  return MarketIntelligence;
};
