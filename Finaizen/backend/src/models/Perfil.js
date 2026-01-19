const { DataTypes } = require('sequelize');

// Monedas por país
const MONEDAS_POR_PAIS = {
  'Ecuador': { codigo: 'USD', simbolo: '$' },
  'Estados Unidos': { codigo: 'USD', simbolo: '$' },
  'México': { codigo: 'MXN', simbolo: '$' },
  'Colombia': { codigo: 'COP', simbolo: '$' },
  'Perú': { codigo: 'PEN', simbolo: 'S/' },
  'Argentina': { codigo: 'ARS', simbolo: '$' },
  'Chile': { codigo: 'CLP', simbolo: '$' },
  'España': { codigo: 'EUR', simbolo: '€' }
};

module.exports = (sequelize) => {
  const Perfil = sequelize.define('Perfil', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id', // Mapear a la columna snake_case en la BD
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    moneda: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD'
    },
    simboloMoneda: {
      type: DataTypes.STRING(5),
      defaultValue: '$',
      field: 'simbolo_moneda' // Mapear a la columna snake_case en la BD
    },
    configuracion: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Configuraciones personalizadas del perfil'
    }
  }, {
    tableName: 'perfiles',
    timestamps: true,
    underscored: true // Usar snake_case para created_at, updated_at
  });

  // Asociaciones
  Perfil.associate = (models) => {
    Perfil.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'usuario'
    });
    Perfil.hasMany(models.Ingreso, {
      foreignKey: 'perfilId',
      as: 'ingresos'
    });
    Perfil.hasMany(models.Egreso, {
      foreignKey: 'perfilId',
      as: 'egresos'
    });
    Perfil.hasMany(models.Presupuesto, {
      foreignKey: 'perfilId',
      as: 'presupuestos'
    });
    Perfil.hasMany(models.RegistroHistorial, {
      foreignKey: 'perfilId',
      as: 'transacciones'
    });
    Perfil.hasMany(models.Logro, {
      foreignKey: 'perfilId',
      as: 'logros'
    });
    Perfil.hasMany(models.PlanAhorro, {
      foreignKey: 'perfilId',
      as: 'planesAhorro'
    });
    Perfil.hasMany(models.PlanDeuda, {
      foreignKey: 'perfilId',
      as: 'planesDeuda'
    });
  };

  return Perfil;
};
